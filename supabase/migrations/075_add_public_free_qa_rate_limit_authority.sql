-- Public Free-QA rate-limit authority.
-- Initial max_rows is 0 so a fresh database fails closed.
-- Production capacity is a later deployment input and is not chosen here.

do $roles$
declare
  role_name text;
  existing pg_catalog.pg_roles%rowtype;
begin
  foreach role_name in array array['abuse_control_runtime', 'abuse_control_maintenance']
  loop
    select * into existing from pg_catalog.pg_roles where rolname = role_name;
    if found then
      if existing.rolcanlogin
        or existing.rolsuper
        or existing.rolcreatedb
        or existing.rolcreaterole
        or existing.rolreplication
        or existing.rolbypassrls
        or exists (
          select 1 from pg_catalog.pg_auth_members as membership
          where membership.roleid = existing.oid or membership.member = existing.oid
        )
      then
        raise exception 'abuse_control_role_conflict';
      end if;
    else
      execute format('create role %I nologin', role_name);
    end if;
  end loop;
end
$roles$;

create schema abuse_control;

revoke all on schema abuse_control from public, anon, authenticated, service_role;
grant usage on schema abuse_control to abuse_control_runtime, abuse_control_maintenance;

create function abuse_control.attempt_row_valid(
  p_accepted_at timestamptz[],
  p_newest timestamptz
) returns boolean
language sql
immutable
security invoker
set search_path = pg_catalog, pg_temp
as $$
  select p_accepted_at is not null
    and p_newest is not null
    and pg_catalog.cardinality(p_accepted_at) between 1 and 5
    and pg_catalog.cardinality(p_accepted_at) = pg_catalog.cardinality(pg_catalog.array_remove(p_accepted_at, null::timestamptz))
    and p_accepted_at = (
      select pg_catalog.array_agg(x order by x)
      from pg_catalog.unnest(p_accepted_at) as x
    )
    and p_newest = (
      select pg_catalog.max(x)
      from pg_catalog.unnest(p_accepted_at) as x
    );
$$;

create table abuse_control.capacity (
  id smallint primary key,
  occupied integer not null,
  max_rows integer not null,
  constraint capacity_singleton check (id = 1),
  constraint capacity_occupied_nonnegative check (occupied >= 0),
  constraint capacity_max_rows_range check (max_rows between 0 and 1000000000),
  constraint capacity_occupied_within_max check (occupied <= max_rows)
);

create table abuse_control.attempts (
  key_digest bytea primary key,
  accepted_at timestamptz[] not null,
  newest_accepted_at timestamptz not null,
  constraint attempts_digest_length check (pg_catalog.octet_length(key_digest) = 32),
  constraint attempts_timestamp_bounds check (pg_catalog.cardinality(accepted_at) between 1 and 5),
  constraint attempts_row_shape check (abuse_control.attempt_row_valid(accepted_at, newest_accepted_at))
);

create index attempts_newest_accepted_at_idx
  on abuse_control.attempts (newest_accepted_at);

insert into abuse_control.capacity (id, occupied, max_rows)
values (1, 0, 0);

revoke all on table abuse_control.capacity from
  public, anon, authenticated, service_role, abuse_control_runtime, abuse_control_maintenance;
revoke all on table abuse_control.attempts from
  public, anon, authenticated, service_role, abuse_control_runtime, abuse_control_maintenance;
revoke all on all sequences in schema abuse_control from
  public, anon, authenticated, service_role, abuse_control_runtime, abuse_control_maintenance;

create function abuse_control.decide_public_free_qa_attempt_impl(
  p_key bytea,
  p_at timestamptz,
  p_mode text
) returns table (decision text)
language plpgsql
security definer
set search_path = pg_catalog, pg_temp
as $$
declare
  v_occupied integer;
  v_max_rows integer;
  v_existing timestamptz[];
  v_found boolean;
  v_at timestamptz;
  v_live timestamptz[];
  v_stored timestamptz[];
  v_newest timestamptz;
begin
  if p_key is null or pg_catalog.octet_length(p_key) <> 32 then
    raise exception 'invalid_digest';
  end if;
  if p_mode is distinct from 'production' and p_mode is distinct from 'injected' then
    raise exception 'invalid_digest';
  end if;

  select c.occupied, c.max_rows
    into v_occupied, v_max_rows
  from abuse_control.capacity as c
  where c.id = 1
  for update;
  if not found then
    raise exception 'capacity_not_configured';
  end if;

  select a.accepted_at
    into v_existing
  from abuse_control.attempts as a
  where a.key_digest = p_key
  for update;
  v_found := found;

  if p_mode = 'production' then
    v_at := pg_catalog.clock_timestamp();
  else
    v_at := p_at;
  end if;
  if v_at is null then
    raise exception 'invalid_digest';
  end if;

  if v_found then
    select coalesce(pg_catalog.array_agg(ts order by ts), '{}'::timestamptz[])
      into v_live
    from pg_catalog.unnest(v_existing) as ts
    where ts > v_at - interval '10 minutes';

    if pg_catalog.cardinality(v_live) >= 5 then
      decision := 'rejected';
      return next;
      return;
    end if;

    select pg_catalog.array_agg(ts order by ts), pg_catalog.max(ts)
      into v_stored, v_newest
    from pg_catalog.unnest(v_live || array[v_at]) as ts;

    update abuse_control.attempts
      set accepted_at = v_stored,
          newest_accepted_at = v_newest
    where key_digest = p_key;

    decision := 'accepted';
    return next;
    return;
  end if;

  if v_occupied >= v_max_rows then
    raise exception 'capacity_exhausted';
  end if;

  insert into abuse_control.attempts (key_digest, accepted_at, newest_accepted_at)
  values (p_key, array[v_at]::timestamptz[], v_at);

  update abuse_control.capacity
    set occupied = occupied + 1
  where id = 1;

  decision := 'accepted';
  return next;
end;
$$;

create function abuse_control.decide_public_free_qa_attempt_at(
  p_key bytea,
  p_at timestamptz
) returns table (decision text)
language sql
security definer
set search_path = pg_catalog, pg_temp
as $$
  select d.decision
  from abuse_control.decide_public_free_qa_attempt_impl(p_key, p_at, 'injected') as d;
$$;

create function abuse_control.decide_public_free_qa_attempt(p_key bytea)
returns table (decision text)
language sql
security definer
set search_path = pg_catalog, pg_temp
as $$
  select d.decision
  from abuse_control.decide_public_free_qa_attempt_impl(p_key, null::timestamptz, 'production') as d;
$$;

create function abuse_control.delete_expired_public_free_qa_attempts_impl(
  p_batch integer,
  p_at timestamptz,
  p_mode text
) returns integer
language plpgsql
security definer
set search_path = pg_catalog, pg_temp
as $$
declare
  v_occupied integer;
  v_deleted integer;
  v_at timestamptz;
begin
  if p_batch is null or p_batch < 1 or p_batch > 500 then
    raise exception 'invalid_cleanup_batch';
  end if;
  if p_mode is distinct from 'production' and p_mode is distinct from 'injected' then
    raise exception 'invalid_cleanup_batch';
  end if;

  select c.occupied
    into v_occupied
  from abuse_control.capacity as c
  where c.id = 1
  for update;
  if not found then
    raise exception 'capacity_not_configured';
  end if;

  if p_mode = 'production' then
    v_at := pg_catalog.clock_timestamp();
  else
    v_at := p_at;
  end if;
  if v_at is null then
    raise exception 'invalid_cleanup_batch';
  end if;

  with expired as (
    select a.key_digest
    from abuse_control.attempts as a
    where a.newest_accepted_at <= v_at - interval '10 minutes'
    order by a.key_digest
    limit p_batch
    for update
  ), removed as (
    delete from abuse_control.attempts as target
    using expired
    where target.key_digest = expired.key_digest
    returning target.key_digest
  )
  select pg_catalog.count(*)::integer into v_deleted from removed;

  if v_deleted > v_occupied then
    raise exception 'capacity_not_configured';
  end if;

  update abuse_control.capacity
    set occupied = occupied - v_deleted
  where id = 1;

  return v_deleted;
end;
$$;

create function abuse_control.delete_expired_public_free_qa_attempts_at(
  p_batch integer,
  p_at timestamptz
) returns integer
language sql
security definer
set search_path = pg_catalog, pg_temp
as $$
  select abuse_control.delete_expired_public_free_qa_attempts_impl(p_batch, p_at, 'injected');
$$;

create function abuse_control.delete_expired_public_free_qa_attempts(p_batch integer)
returns integer
language sql
security definer
set search_path = pg_catalog, pg_temp
as $$
  select abuse_control.delete_expired_public_free_qa_attempts_impl(p_batch, null::timestamptz, 'production');
$$;

create function abuse_control.set_public_free_qa_max_rows(p_max_rows integer)
returns void
language plpgsql
security definer
set search_path = pg_catalog, pg_temp
as $$
declare
  v_occupied integer;
begin
  select c.occupied
    into v_occupied
  from abuse_control.capacity as c
  where c.id = 1
  for update;
  if not found then
    raise exception 'capacity_not_configured';
  end if;

  if p_max_rows is null
    or p_max_rows < 0
    or p_max_rows > 1000000000
    or p_max_rows < v_occupied
  then
    raise exception 'capacity_configuration_rejected';
  end if;

  update abuse_control.capacity
    set max_rows = p_max_rows
  where id = 1;
end;
$$;

revoke all on function abuse_control.attempt_row_valid(timestamptz[], timestamptz) from
  public, anon, authenticated, service_role, abuse_control_runtime, abuse_control_maintenance;
revoke all on function abuse_control.decide_public_free_qa_attempt_impl(bytea, timestamptz, text) from
  public, anon, authenticated, service_role, abuse_control_runtime, abuse_control_maintenance;
revoke all on function abuse_control.decide_public_free_qa_attempt_at(bytea, timestamptz) from
  public, anon, authenticated, service_role, abuse_control_runtime, abuse_control_maintenance;
revoke all on function abuse_control.delete_expired_public_free_qa_attempts_impl(integer, timestamptz, text) from
  public, anon, authenticated, service_role, abuse_control_runtime, abuse_control_maintenance;
revoke all on function abuse_control.delete_expired_public_free_qa_attempts_at(integer, timestamptz) from
  public, anon, authenticated, service_role, abuse_control_runtime, abuse_control_maintenance;
revoke all on function abuse_control.decide_public_free_qa_attempt(bytea) from
  public, anon, authenticated, service_role, abuse_control_maintenance;
revoke all on function abuse_control.delete_expired_public_free_qa_attempts(integer) from
  public, anon, authenticated, service_role, abuse_control_runtime;
revoke all on function abuse_control.set_public_free_qa_max_rows(integer) from
  public, anon, authenticated, service_role, abuse_control_runtime;

grant execute on function abuse_control.decide_public_free_qa_attempt(bytea)
  to abuse_control_runtime;
grant execute on function abuse_control.delete_expired_public_free_qa_attempts(integer)
  to abuse_control_maintenance;
grant execute on function abuse_control.set_public_free_qa_max_rows(integer)
  to abuse_control_maintenance;
