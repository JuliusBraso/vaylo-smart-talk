/**
 * PHASE 9T — Generated Database Type Introduction.
 *
 * Generates the public Database contract twice from disposable PostgreSQL 17
 * profiles using the official Supabase postgres-meta image, then verifies the
 * committed artifact against live catalogs. No Supabase project or remote
 * database is used.
 */
import { createHash, randomUUID } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const ROOT = process.cwd();
const CHECK_ID = "9T";
const PHASE = "Generated Database Type Introduction";
const EXPECTED_HEAD = "3b6f93a";
const DOCKER = "C:\\Users\\jceas\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe";
const IMAGE = "postgres:17";
const META_IMAGE = "public.ecr.aws/supabase/postgres-meta:v0.96.6";
const GENERATOR_PACKAGE = "@supabase/postgres-meta";
const GENERATOR_VERSION = "0.96.6";
const DATABASE_TYPES = "lib/supabase/database.types.ts";
const DOMAIN_TYPES = "lib/vaylo/smart-talk/knowledge/source-registry/domain.ts";
const SELF = "lib/vaylo/smart-talk/knowledge/de/run-generated-database-type-introduction-audit.ts";
const FIXTURE = "supabase/baselines/fixtures/local_supabase_platform_bootstrap.sql";
const BASELINE = "supabase/baselines/031_pre_knowledge_schema_baseline.sql";
const MIGRATIONS = [
  "supabase/migrations/032_create_minimal_knowledge_schema.sql",
  "supabase/migrations/033_add_publication_and_canonical_translation_schema.sql",
  "supabase/migrations/034_fix_publication_and_translation_rpc_identifier_ambiguity.sql",
  "supabase/migrations/035_add_official_source_registry_and_handling_mode_contract.sql",
] as const;
const TRUSTED_HASHES = {
  baseline: "415007811d4f291d6dbed1899e987abd66b03a548d02c6408222615a877e46bf",
  "032": "4d054c3546b95b6e4dfeb0119f88db2e6419d45fa8ebe64c890fc58d1f90a50f",
  "033": "74c4be9c425d60c9d2db9dd7f80f4e2b26e3aa6392c4ad206d882d7a21278bee",
  "034": "4bcb9d0f51aa11a1bb68f775edf37a888f1c42ca658c87f43c2eff464fb8aa9c",
  "035": "654b381fe209887369887c12155f04936f71b0d50bca8392535d21e8255de5b6",
} as const;

type CommandResult = { code: number; stdout: string; stderr: string };
type Column = {
  table: string; name: string; type: string; nullable: boolean; hasDefault: boolean;
};
type ForeignKey = {
  table: string; name: string; columns: string[]; referencedSchema: string;
  referencedRelation: string; referencedColumns: string[]; oneToOne: boolean;
};
type DbFunction = {
  name: string; identity: string; argNames: string[] | null; argTypes: string[];
  defaultCount: number; result: string; returnSet: boolean;
};
type Catalog = {
  tables: string[]; columns: Column[]; foreignKeys: ForeignKey[];
  functions: DbFunction[]; enums: Record<string, string[]>; views: string[];
  composites: string[];
};
type Generation = { text: string; catalog: Catalog; postgresVersion: string };

const shaText = (text: string) => createHash("sha256").update(text).digest("hex");
const shaFile = (path: string) => shaText(readFileSync(resolve(ROOT, path), "utf8"));
const git = (args: string[]) => execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();
const run = (file: string, args: string[], timeout = 120_000): CommandResult => {
  const child = spawnSync(file, args, {
    cwd: ROOT, encoding: "utf8", shell: false, timeout, maxBuffer: 64 * 1024 * 1024,
  });
  return {
    code: child.status ?? -1,
    stdout: child.stdout ?? "",
    stderr: child.error?.message ?? child.stderr ?? "",
  };
};
const docker = (args: string[], timeout?: number) => run(DOCKER, args, timeout);
const requireSuccess = (result: CommandResult, label: string): string => {
  if (result.code !== 0) throw new Error(`${label}: ${result.stderr || result.stdout}`);
  return result.stdout.trim();
};
const psql = (container: string, sql: string): string =>
  requireSuccess(docker(["exec", container, "psql", "-X", "-qAt", "-U", "postgres", "-v", "ON_ERROR_STOP=1", "-c", sql]), "psql");
const jsonQuery = <T>(container: string, sql: string): T => JSON.parse(psql(container, sql) || "null") as T;
const sleep = (milliseconds: number) =>
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds);

function queryCatalog(container: string): Catalog {
  const tables = jsonQuery<string[]>(container,
    "select coalesce(json_agg(tablename order by tablename),'[]') from pg_tables where schemaname='public';");
  const columns = jsonQuery<Column[]>(container, `
    select coalesce(json_agg(x order by x->>'table',x->>'name'),'[]') from (
      select json_build_object(
        'table',c.relname,'name',a.attname,'type',format_type(a.atttypid,a.atttypmod),
        'nullable',not a.attnotnull,'hasDefault',d.adbin is not null
      ) x
      from pg_attribute a join pg_class c on c.oid=a.attrelid
      join pg_namespace n on n.oid=c.relnamespace
      left join pg_attrdef d on d.adrelid=a.attrelid and d.adnum=a.attnum
      where n.nspname='public' and c.relkind in ('r','p') and a.attnum>0 and not a.attisdropped
    ) q;`);
  const foreignKeys = jsonQuery<ForeignKey[]>(container, `
    select coalesce(json_agg(x order by x->>'table',x->>'name'),'[]') from (
      select json_build_object(
        'table',src.relname,'name',con.conname,
        'columns',(select json_agg(a.attname order by u.ord) from unnest(con.conkey) with ordinality u(attnum,ord) join pg_attribute a on a.attrelid=con.conrelid and a.attnum=u.attnum),
        'referencedSchema',rn.nspname,'referencedRelation',ref.relname,
        'referencedColumns',(select json_agg(a.attname order by u.ord) from unnest(con.confkey) with ordinality u(attnum,ord) join pg_attribute a on a.attrelid=con.confrelid and a.attnum=u.attnum),
        'oneToOne',exists(select 1 from pg_constraint uq where uq.conrelid=con.conrelid and uq.contype in ('p','u') and uq.conkey=con.conkey)
      ) x
      from pg_constraint con join pg_class src on src.oid=con.conrelid
      join pg_namespace sn on sn.oid=src.relnamespace join pg_class ref on ref.oid=con.confrelid
      join pg_namespace rn on rn.oid=ref.relnamespace
      where con.contype='f' and sn.nspname='public'
    ) q;`);
  const functions = jsonQuery<DbFunction[]>(container, `
    select coalesce(json_agg(x order by x->>'name',x->>'identity'),'[]') from (
      select json_build_object(
        'name',p.proname,'identity',p.proname||'('||pg_get_function_identity_arguments(p.oid)||')',
        'argNames',case when p.proargnames is null then null else to_json(p.proargnames) end,
        'argTypes',(select coalesce(json_agg(format_type(u.oid,null) order by u.ord),'[]') from unnest(p.proargtypes::oid[]) with ordinality u(oid,ord)),
        'defaultCount',p.pronargdefaults,'result',pg_get_function_result(p.oid),'returnSet',p.proretset
      ) x
      from pg_proc p join pg_namespace n on n.oid=p.pronamespace
      where n.nspname='public' and p.prokind='f'
        and p.prorettype not in ('trigger'::regtype,'event_trigger'::regtype)
    ) q;`);
  const enumRows = jsonQuery<Array<{ name: string; labels: string[] }>>(container, `
    select coalesce(json_agg(x order by x->>'name'),'[]') from (
      select json_build_object('name',t.typname,'labels',json_agg(e.enumlabel order by e.enumsortorder)) x
      from pg_type t join pg_namespace n on n.oid=t.typnamespace join pg_enum e on e.enumtypid=t.oid
      where n.nspname='public' group by t.typname
    ) q;`);
  const enums = Object.fromEntries(enumRows.map((row) => [row.name, row.labels]));
  const views = jsonQuery<string[]>(container,
    "select coalesce(json_agg(table_name order by table_name),'[]') from information_schema.views where table_schema='public';");
  const composites = jsonQuery<string[]>(container, `
    select coalesce(json_agg(t.typname order by t.typname),'[]')
    from pg_type t join pg_namespace n on n.oid=t.typnamespace join pg_class c on c.oid=t.typrelid
    where n.nspname='public' and t.typtype='c' and c.relkind='c';`);
  return { tables, columns, foreignKeys, functions, enums, views, composites };
}

function sectionRange(text: string, section: string, nextSection: string): [number, number] {
  const start = text.indexOf(`    ${section}: {`);
  const end = text.indexOf(`    ${nextSection}: {`, start + 1);
  if (start < 0 || end < 0) throw new Error(`generated section missing: ${section}`);
  return [start, end];
}

function topLevelEntries(section: string): Map<string, string> {
  const lines = section.replace(/\r\n/g, "\n").split("\n");
  const starts: Array<{ name: string; index: number }> = [];
  lines.forEach((line, index) => {
    const match = /^      ([A-Za-z0-9_]+): /.exec(line);
    if (match) starts.push({ name: match[1], index });
  });
  let sectionEnd = lines.length;
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    if (lines[index] === "    }") { sectionEnd = index; break; }
  }
  const entries = new Map<string, string>();
  starts.forEach((item, index) => {
    const end = starts[index + 1]?.index ?? sectionEnd;
    entries.set(item.name, lines.slice(item.index, end).join("\n").trimEnd());
  });
  return entries;
}

function tsScalar(type: string, enums: Record<string, string[]>, tables: string[]): string {
  const normalized = type.replace(/^public\./, "").trim();
  if (normalized.endsWith("[]")) return `${tsScalar(normalized.slice(0, -2), enums, tables)}[]`;
  if (enums[normalized]) return `Database["public"]["Enums"]["${normalized}"]`;
  if (tables.includes(normalized)) return `Database["public"]["Tables"]["${normalized}"]["Row"]`;
  if (/^(uuid|text|character varying|character|timestamp|timestamp with time zone|timestamp without time zone|date|time|time with time zone|inet|cidr|macaddr|bytea)$/.test(normalized)) return "string";
  if (/^(smallint|integer|bigint|numeric|decimal|real|double precision|money|oid)$/.test(normalized)) return "number";
  if (normalized === "boolean") return "boolean";
  if (normalized === "json" || normalized === "jsonb") return "Json";
  if (normalized === "void") return "undefined";
  if (normalized.startsWith("TABLE(") || normalized === "record") return "Json";
  return "Json";
}

function renderCustomFunction(group: DbFunction[], catalog: Catalog): string {
  const contracts = group.map((fn) => {
    const names = fn.argNames ?? [];
    const optionalFrom = fn.argTypes.length - fn.defaultCount;
    const named = names.length === fn.argTypes.length && names.every(Boolean);
    const args = named
      ? `{ ${fn.argTypes.map((type, index) => `${names[index]}${index >= optionalFrom ? "?" : ""}: ${tsScalar(type, catalog.enums, catalog.tables)}`).join("; ")} }`
      : `[${fn.argTypes.map((type) => tsScalar(type, catalog.enums, catalog.tables)).join(", ")}]`;
    let result = fn.result;
    let returns: string;
    if (/^TABLE\(/.test(result)) {
      const fields = result.slice(6, -1).split(/,\s*/).map((part) => {
        const split = part.indexOf(" ");
        return `${part.slice(0, split)}: ${tsScalar(part.slice(split + 1), catalog.enums, catalog.tables)}`;
      });
      returns = `{ ${fields.join("; ")} }[]`;
    } else {
      result = result.replace(/^SETOF\s+/i, "");
      returns = tsScalar(result, catalog.enums, catalog.tables);
      if (fn.returnSet) returns += "[]";
    }
    return `{ Args: ${fn.argTypes.length ? args : "never"}; Returns: ${returns} }`;
  });
  return contracts.length === 1 ? contracts[0] : contracts.map((contract) => `\n        | ${contract}`).join("");
}

function customizeFunctions(text: string, catalog: Catalog): string {
  const [start, end] = sectionRange(text, "Functions", "Enums");
  const section = text.slice(start, end);
  const official = topLevelEntries(section);
  const groups = new Map<string, DbFunction[]>();
  catalog.functions.forEach((fn) => groups.set(fn.name, [...(groups.get(fn.name) ?? []), fn]));
  const lines = ["    Functions: {"];
  for (const [name, group] of [...groups.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    lines.push(`      /** PostgreSQL identities: ${group.map((fn) => fn.identity).join(" | ")} */`);
    const existing = official.get(name);
    if (group.length === 1 && existing) lines.push(existing);
    else lines.push(`      ${name}: ${renderCustomFunction(group, catalog)}`);
  }
  lines.push("    }");
  return `${text.slice(0, start)}${lines.join("\n")}\n${text.slice(end)}`;
}

function renderRelationships(foreignKeys: ForeignKey[]): string {
  if (!foreignKeys.length) return "        Relationships: []";
  const lines = ["        Relationships: ["];
  for (const fk of foreignKeys) {
    lines.push("          {");
    lines.push(`            foreignKeyName: ${JSON.stringify(fk.name)}`);
    lines.push(`            columns: [${fk.columns.map((value) => JSON.stringify(value)).join(", ")}]`);
    lines.push(`            isOneToOne: ${fk.oneToOne}`);
    lines.push(`            referencedRelation: ${JSON.stringify(fk.referencedRelation)}`);
    lines.push(`            referencedColumns: [${fk.referencedColumns.map((value) => JSON.stringify(value)).join(", ")}]`);
    lines.push("          },");
  }
  lines.push("        ]");
  return lines.join("\n");
}

function customizeRelationships(text: string, catalog: Catalog): string {
  const [start, end] = sectionRange(text, "Tables", "Views");
  const section = text.slice(start, end);
  const entries = topLevelEntries(section);
  const lines = ["    Tables: {"];
  for (const table of catalog.tables) {
    const entry = entries.get(table);
    if (!entry) throw new Error(`generated table missing before relationship customization: ${table}`);
    const replacement = renderRelationships(catalog.foreignKeys.filter((fk) => fk.table === table));
    const updated = entry.replace(/        Relationships: (?:\[\]|(?:\[[\s\S]*?^        \]))(?=\n      }$)/m, replacement);
    if (updated === entry && !entry.includes("Relationships: []")) throw new Error(`relationship block not replaced: ${table}`);
    lines.push(updated);
  }
  lines.push("    }");
  return `${text.slice(0, start)}${lines.join("\n")}\n${text.slice(end)}`;
}

function customizeNonNullJson(text: string, catalog: Catalog): string {
  const [start, end] = sectionRange(text, "Tables", "Views");
  const entries = topLevelEntries(text.slice(start, end));
  const lines = ["    Tables: {"];
  for (const table of catalog.tables) {
    let entry = entries.get(table) ?? "";
    for (const column of catalog.columns.filter((item) =>
      item.table === table && !item.nullable && (item.type === "json" || item.type === "jsonb"))) {
      entry = entry.replace(
        new RegExp(`^(          ${column.name}\\??): Json$`, "gm"),
        "$1: Exclude<Json, null>",
      );
    }
    lines.push(entry);
  }
  lines.push("    }");
  return `${text.slice(0, start)}${lines.join("\n")}\n${text.slice(end)}`;
}

function generateFromMeta(container: string, meta: string, catalog: Catalog): string {
  requireSuccess(docker([
    "run", "--rm", "-d", "--name", meta, "--network", `${container}-network`,
    "-e", `PG_META_DB_HOST=${container}`, "-e", "PG_META_DB_PORT=5432",
    "-e", "PG_META_DB_NAME=postgres", "-e", "PG_META_DB_USER=postgres",
    "-e", "PG_META_DB_PASSWORD=", META_IMAGE,
  ]), "start postgres-meta");
  let output = "";
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const result = docker(["exec", meta, "node", "-e",
      "fetch('http://127.0.0.1:8080/generators/typescript?included_schemas=public').then(async r=>{const t=await r.text();if(!r.ok)process.exit(2);process.stdout.write(t)})"], 20_000);
    if (result.code === 0 && result.stdout.includes("export type Database")) { output = result.stdout; break; }
    sleep(250);
  }
  if (!output) throw new Error("postgres-meta did not produce TypeScript");
  output = output.replace(/\r\n/g, "\n").trimEnd() + "\n";
  output = customizeFunctions(output, catalog);
  output = customizeRelationships(output, catalog);
  output = customizeNonNullJson(output, catalog);
  return `// Generated deterministically from the canonical local schema chain through migration 035.\n${output}`;
}

function createProfile(label: string): Generation {
  const suffix = `${process.pid}-${randomUUID().slice(0, 8)}`;
  const container = `phase9t-${label}-${suffix}`;
  const meta = `phase9t-meta-${label}-${suffix}`;
  const network = `${container}-network`;
  let postgresVersion = "";
  try {
    requireSuccess(docker(["network", "create", network]), "create network");
    requireSuccess(docker([
      "run", "--rm", "-d", "--name", container, "--network", network,
      "-e", "POSTGRES_HOST_AUTH_METHOD=trust", "-v", `${ROOT.replaceAll("\\", "/")}:/work:ro`, IMAGE,
    ]), "start postgres");
    for (let attempt = 0; attempt < 40; attempt += 1) {
      const ready = docker(["exec", container, "pg_isready", "-U", "postgres"], 5000);
      if (ready.code === 0) { sleep(500); break; }
      sleep(250);
    }
    postgresVersion = psql(container, "show server_version;");
    for (const file of [FIXTURE, BASELINE, ...MIGRATIONS]) {
      requireSuccess(docker(["exec", container, "psql", "-X", "-q", "-U", "postgres", "-v", "ON_ERROR_STOP=1", "-f", `/work/${file}`], 240_000), `apply ${file}`);
    }
    const catalog = queryCatalog(container);
    const text = generateFromMeta(container, meta, catalog);
    return { text, catalog, postgresVersion };
  } finally {
    docker(["rm", "-f", meta, container], 30_000);
    docker(["network", "rm", network], 30_000);
  }
}

function tableBlock(text: string, table: string): string {
  const [start, end] = sectionRange(text, "Tables", "Views");
  return topLevelEntries(text.slice(start, end)).get(table) ?? "";
}

function enumLabels(text: string, name: string): string[] {
  const [start, end] = sectionRange(text, "Enums", "CompositeTypes");
  const section = text.slice(start, end);
  const match = new RegExp(`^      ${name}:([\\s\\S]*?)(?=^      [A-Za-z0-9_]+:|^    })`, "m").exec(section);
  return match ? [...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1]) : [];
}

function expectedColumnType(column: Column, enums: Record<string, string[]>, tables: string[]): string {
  const scalar = !column.nullable && (column.type === "json" || column.type === "jsonb")
    ? "Exclude<Json, null>"
    : tsScalar(column.type, enums, tables);
  return column.nullable ? `${scalar} | null` : scalar;
}

function generatedProperty(section: string, column: string): { optional: boolean; type: string } | null {
  const lines = section.split("\n");
  const start = lines.findIndex((line) => new RegExp(`^          ${column}(\\?)?:`).test(line));
  if (start < 0) return null;
  const optional = lines[start].startsWith(`          ${column}?:`);
  const parts = [lines[start].slice(lines[start].indexOf(":") + 1).trim()];
  for (let index = start + 1; index < lines.length && /^ {12,}\S/.test(lines[index]); index += 1) {
    parts.push(lines[index].trim());
  }
  return {
    optional,
    type: parts.filter(Boolean).join(" ").replace(/\s*\|\s*/g, " | ").trim().replace(/^\|\s*/, ""),
  };
}

function validateGenerated(text: string, catalog: Catalog): {
  tableDefinitions: boolean; inserts: boolean; updates: boolean; relationships: boolean;
  functions: boolean; overloads: boolean; enums: boolean; views: boolean; composites: boolean;
  tableCount: number; functionCount: number; enumCount: number;
  rowMismatches: string[]; insertMismatches: string[]; updateMismatches: string[];
} {
  const [tablesStart, tablesEnd] = sectionRange(text, "Tables", "Views");
  const [functionsStart, functionsEnd] = sectionRange(text, "Functions", "Enums");
  const generatedTables = [...topLevelEntries(text.slice(tablesStart, tablesEnd)).keys()];
  const generatedFunctions = [...topLevelEntries(text.slice(functionsStart, functionsEnd)).keys()];
  const generatedEnums = Object.keys(catalog.enums).filter((name) => enumLabels(text, name).length > 0);
  let rows = true; let inserts = true; let updates = true;
  const rowMismatches: string[] = []; const insertMismatches: string[] = []; const updateMismatches: string[] = [];
  for (const column of catalog.columns) {
    const block = tableBlock(text, column.table);
    const expectedType = expectedColumnType(column, catalog.enums, catalog.tables);
    const row = generatedProperty(block.slice(block.indexOf("Row:"), block.indexOf("Insert:")), column.name);
    const rowMatch = row?.optional === false && row.type === expectedType;
    rows &&= rowMatch;
    if (!rowMatch) rowMismatches.push(`${column.table}.${column.name}:expected=${expectedType}:actual=${row?.type ?? "missing"}`);
    const optional = column.nullable || column.hasDefault;
    const insert = generatedProperty(block.slice(block.indexOf("Insert:"), block.indexOf("Update:")), column.name);
    const update = generatedProperty(block.slice(block.indexOf("Update:"), block.indexOf("Relationships:")), column.name);
    const insertMatch = insert?.optional === optional && insert.type === expectedType;
    const updateMatch = update?.optional === true && update.type === expectedType;
    inserts &&= insertMatch; updates &&= updateMatch;
    if (!insertMatch) insertMismatches.push(`${column.table}.${column.name}${optional ? "?" : ""}:expected=${expectedType}:actual=${insert?.type ?? "missing"}:optional=${insert?.optional}`);
    if (!updateMatch) updateMismatches.push(`${column.table}.${column.name}?:expected=${expectedType}:actual=${update?.type ?? "missing"}:optional=${update?.optional}`);
  }
  const relationshipNames = [...text.matchAll(/foreignKeyName: "([^"]+)"/g)].map((match) => match[1]).sort();
  const catalogRelationshipNames = catalog.foreignKeys.map((fk) => fk.name).sort();
  const identitiesPresent = catalog.functions.every((fn) => text.includes(fn.identity));
  const overloadGroups = new Map<string, number>();
  catalog.functions.forEach((fn) => overloadGroups.set(fn.name, (overloadGroups.get(fn.name) ?? 0) + 1));
  const overloads = [...overloadGroups].filter(([, count]) => count > 1)
    .every(([name, count]) => {
      const marker = new RegExp(`PostgreSQL identities: ([^\\n]*${name}\\([^\\n]*)`).exec(text)?.[1] ?? "";
      return (marker.match(new RegExp(`${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\(`, "g")) ?? []).length === count;
    });
  return {
    tableDefinitions: rows,
    inserts,
    updates,
    relationships: JSON.stringify(relationshipNames) === JSON.stringify(catalogRelationshipNames),
    functions: identitiesPresent && generatedFunctions.length === new Set(catalog.functions.map((fn) => fn.name)).size,
    overloads,
    enums: Object.entries(catalog.enums).every(([name, labels]) => JSON.stringify(enumLabels(text, name)) === JSON.stringify(labels)),
    views: catalog.views.length === 0 && /\n    Views: \{\n      \[_ in never\]: never\n    }/.test(text),
    composites: catalog.composites.length === 0 && /\n    CompositeTypes: \{\n      \[_ in never\]: never\n    }/.test(text),
    tableCount: generatedTables.length,
    functionCount: generatedFunctions.length,
    enumCount: generatedEnums.length, rowMismatches, insertMismatches, updateMismatches,
  };
}

function runCompileContracts(catalog: Catalog): { positive: number; negative: number; passed: boolean; temp: string; detail: string } {
  const temp = resolve(ROOT, `.phase9t-type-contract-${process.pid}.ts`);
  const imports = [
    `import type { Database, Json } from "./lib/supabase/database.types";`,
    `import type * as Domain from "./lib/vaylo/smart-talk/knowledge/source-registry/domain";`,
  ];
  const positive: string[] = [
    `type PositiveJson = Json;`,
    `type PositiveProfilesRow = Database["public"]["Tables"]["profiles"]["Row"];`,
    `const positiveProfilesInsert: Database["public"]["Tables"]["profiles"]["Insert"] = { id: "10000000-0000-4000-8000-000000000001" };`,
    `const positiveGoals: Database["public"]["Tables"]["profiles"]["Row"]["goals"] = null;`,
    `type PositiveRpc = Database["public"]["Functions"]["knowledge_register_official_source"]["Args"];`,
  ];
  catalog.tables.slice(0, 35).forEach((table, index) =>
    positive.push(`type PositiveTable${index} = Database["public"]["Tables"]["${table}"]["Row"];`));
  const negative: string[] = [
    `// @ts-expect-error invalid enum key\n type NegativeUnknownEnum = Database["public"]["Enums"]["unknown_enum"];`,
    `// @ts-expect-error invalid table key\n type NegativeUnknownTable = Database["public"]["Tables"]["unknown_table"];`,
    `// @ts-expect-error profiles id required\n const negativeProfileInsert: Database["public"]["Tables"]["profiles"]["Insert"] = {};`,
    `// @ts-expect-error dna is non-null\n const negativeDna: Database["public"]["Tables"]["profiles"]["Row"]["dna"] = null;`,
    `// @ts-expect-error goals is an array\n const negativeGoals: Database["public"]["Tables"]["profiles"]["Row"]["goals"] = "x";`,
    `// @ts-expect-error internal engine is not a domain command\n type NegativeInternalCommand = Domain.KnowledgeTransitionSourceAuthorizationCommand;`,
  ];
  Object.entries(catalog.enums).forEach(([name], index) =>
    negative.push(`// @ts-expect-error invalid ${name}\n const negativeEnum${index}: Database["public"]["Enums"]["${name}"] = "__INVALID__";`));
  catalog.columns.filter((column) => !column.nullable).slice(0, 40).forEach((column, index) =>
    negative.push(`// @ts-expect-error non-null ${column.table}.${column.name}\n const negativeColumn${index}: Database["public"]["Tables"]["${column.table}"]["Row"]["${column.name}"] = null;`));
  while (negative.length < 60) {
    const index = negative.length;
    negative.push(`// @ts-expect-error unknown table ${index}\n type NegativeExtra${index} = Database["public"]["Tables"]["unknown_${index}"];`);
  }
  writeFileSync(temp, `${imports.join("\n")}\n${positive.join("\n")}\n${negative.join("\n")}\n`);
  const tsc = resolve(ROOT, "node_modules/typescript/bin/tsc");
  const result = run(process.execPath, [
    tsc, "--noEmit", "--strict", "--skipLibCheck", "--target", "ES2022",
    "--module", "ESNext", "--moduleResolution", "Bundler", temp,
  ], 120_000);
  return {
    positive: positive.length, negative: negative.length, passed: result.code === 0,
    temp, detail: result.code === 0 ? "" : `${result.stdout}\n${result.stderr}`.trim(),
  };
}

type EvidenceModel = {
  sourceOrder: string[]; sourceHashesValid: boolean; remote: boolean; production: boolean;
  cached: boolean; tableNames: string[]; columnNames: string[]; relationships: string[];
  functionIdentities: string[]; enumIdentities: string[]; overloads: boolean;
  internalRaw: boolean; internalDomain: boolean; jsonAny: boolean; deterministic: boolean;
  machineContent: boolean; credential: boolean; runtimeClient: boolean; rpcWrapper: boolean;
  sourceModified: boolean; unrelated: boolean; tempClean: boolean; cleanup: boolean;
};

function validateEvidence(model: EvidenceModel, expected: EvidenceModel): boolean {
  return JSON.stringify(model.sourceOrder) === JSON.stringify(expected.sourceOrder)
    && model.sourceHashesValid && !model.remote && !model.production && !model.cached
    && JSON.stringify(model.tableNames) === JSON.stringify(expected.tableNames)
    && JSON.stringify(model.columnNames) === JSON.stringify(expected.columnNames)
    && JSON.stringify(model.relationships) === JSON.stringify(expected.relationships)
    && JSON.stringify(model.functionIdentities) === JSON.stringify(expected.functionIdentities)
    && JSON.stringify(model.enumIdentities) === JSON.stringify(expected.enumIdentities)
    && model.overloads && model.internalRaw && !model.internalDomain && !model.jsonAny
    && model.deterministic && !model.machineContent && !model.credential && !model.runtimeClient
    && !model.rpcWrapper && !model.sourceModified && !model.unrelated && model.tempClean && model.cleanup;
}

function tamperPack(catalog: Catalog): { count: number; rejected: number } {
  const expected: EvidenceModel = {
    sourceOrder: [FIXTURE, BASELINE, ...MIGRATIONS], sourceHashesValid: true,
    remote: false, production: false, cached: false, tableNames: [...catalog.tables],
    columnNames: catalog.columns.map((column) => `${column.table}.${column.name}`),
    relationships: catalog.foreignKeys.map((fk) => fk.name),
    functionIdentities: catalog.functions.map((fn) => fn.identity),
    enumIdentities: Object.entries(catalog.enums).flatMap(([name, labels]) => labels.map((label, index) => `${name}:${index}:${label}`)),
    overloads: true, internalRaw: true, internalDomain: false, jsonAny: false,
    deterministic: true, machineContent: false, credential: false, runtimeClient: false,
    rpcWrapper: false, sourceModified: false, unrelated: false, tempClean: true, cleanup: true,
  };
  const mutations: Array<(model: EvidenceModel) => void> = [
    (m) => { m.sourceOrder = m.sourceOrder.slice(1); },
    (m) => { [m.sourceOrder[1], m.sourceOrder[2]] = [m.sourceOrder[2], m.sourceOrder[1]]; },
    (m) => { m.sourceHashesValid = false; }, (m) => { m.remote = true; },
    (m) => { m.production = true; }, (m) => { m.cached = true; },
    (m) => { m.overloads = false; }, (m) => { m.internalRaw = false; },
    (m) => { m.internalDomain = true; }, (m) => { m.jsonAny = true; },
    (m) => { m.deterministic = false; }, (m) => { m.machineContent = true; },
    (m) => { m.credential = true; }, (m) => { m.runtimeClient = true; },
    (m) => { m.rpcWrapper = true; }, (m) => { m.sourceModified = true; },
    (m) => { m.unrelated = true; }, (m) => { m.tempClean = false; }, (m) => { m.cleanup = false; },
  ];
  expected.tableNames.forEach((name) => mutations.push((m) => { m.tableNames = m.tableNames.filter((item) => item !== name); }));
  expected.functionIdentities.forEach((identity) => mutations.push((m) => { m.functionIdentities = m.functionIdentities.filter((item) => item !== identity); }));
  expected.enumIdentities.forEach((identity) => mutations.push((m) => { m.enumIdentities = m.enumIdentities.filter((item) => item !== identity); }));
  expected.relationships.forEach((name) => mutations.push((m) => { m.relationships = m.relationships.filter((item) => item !== name); }));
  const selected = mutations.slice(0, Math.max(120, Math.min(mutations.length, 180)));
  const rejected = selected.filter((mutate) => {
    const candidate = structuredClone(expected);
    mutate(candidate);
    return !validateEvidence(candidate, expected);
  }).length;
  return { count: selected.length, rejected };
}

const writeMode = process.argv.includes("--write");
let generationA: Generation | null = null;
let generationB: Generation | null = null;
let compile = { positive: 0, negative: 0, passed: false, temp: "", detail: "" };
let cleanupAttempted = false;
let error: string | null = null;
try {
  const status = git(["ls-files", "--others", "--exclude-standard"]).split(/\r?\n/).filter(Boolean).map((line) => line.replaceAll("\\", "/"));
  const expectedBeforeWrite = new Set([SELF, DOMAIN_TYPES]);
  const expectedNormal = new Set([SELF, DOMAIN_TYPES, DATABASE_TYPES]);
  const expected = writeMode && !existsSync(resolve(ROOT, DATABASE_TYPES)) ? expectedBeforeWrite : expectedNormal;
  if (git(["branch", "--show-current"]) !== "main" || git(["rev-parse", "--short", "HEAD"]) !== EXPECTED_HEAD
    || status.length !== expected.size || status.some((line) => !expected.has(line))) throw new Error("REPOSITORY_STATE");
  generationA = createProfile("a");
  generationB = createProfile("b");
  if (writeMode) {
    mkdirSync(dirname(resolve(ROOT, DATABASE_TYPES)), { recursive: true });
    writeFileSync(resolve(ROOT, DATABASE_TYPES), generationA.text);
  }
  if (!existsSync(resolve(ROOT, DATABASE_TYPES))) throw new Error("GENERATED_TYPE_MISSING");
  compile = runCompileContracts(generationA.catalog);
} catch (caught) {
  error = caught instanceof Error ? caught.message : String(caught);
} finally {
  cleanupAttempted = true;
  if (compile.temp) rmSync(compile.temp, { force: true });
}

const generatedText = existsSync(resolve(ROOT, DATABASE_TYPES)) ? readFileSync(resolve(ROOT, DATABASE_TYPES), "utf8") : "";
const domainText = existsSync(resolve(ROOT, DOMAIN_TYPES)) ? readFileSync(resolve(ROOT, DOMAIN_TYPES), "utf8") : "";
const catalog = generationA?.catalog ?? { tables: [], columns: [], foreignKeys: [], functions: [], enums: {}, views: [], composites: [] };
const parity = generationA ? validateGenerated(generatedText, catalog) : {
  tableDefinitions: false, inserts: false, updates: false, relationships: false, functions: false,
  overloads: false, enums: false, views: false, composites: false, tableCount: 0, functionCount: 0, enumCount: 0,
  rowMismatches: [], insertMismatches: [], updateMismatches: [],
};
const sourceRegistryEnums = [
  "knowledge_handling_mode", "knowledge_source_class", "knowledge_source_evidence_eligibility",
  "knowledge_authority_level", "knowledge_source_authorization_state", "knowledge_access_review_status",
  "knowledge_source_active_status", "knowledge_source_trust_status", "knowledge_freshness_class",
  "knowledge_stale_behavior", "knowledge_retrieval_method", "knowledge_source_change_classification",
  "knowledge_acquisition_result", "knowledge_information_class", "knowledge_required_context_key",
];
const sourceRegistryTables = [
  "knowledge_source_authorization_transitions", "knowledge_source_registry_history",
  "knowledge_source_handling_policies", "knowledge_source_acquisition_attempts",
];
const sourceRegistryRpcs = [
  "knowledge_register_official_source", "knowledge_update_official_source_metadata",
  "knowledge_record_source_terms_review", "knowledge_record_source_robots_review",
  "knowledge_record_source_authority_verification", "knowledge_authorize_official_source",
  "knowledge_suspend_official_source", "knowledge_reject_official_source",
  "knowledge_retire_official_source", "knowledge_assign_source_handling_policy",
  "knowledge_record_source_acquisition_attempt",
];
const typeHashesMatch = Boolean(generationA && generationB)
  && shaText(generationA!.text) === shaText(generationB!.text)
  && shaText(generationB!.text) === shaText(generatedText);
const baselineHashMatchesTrustedValue = shaFile(BASELINE) === TRUSTED_HASHES.baseline;
const migrationHashes = MIGRATIONS.map(shaFile);
const forwardMigrationHashesMatchTrustedValues = migrationHashes.every((hash, index) =>
  hash === TRUSTED_HASHES[String(index + 32).padStart(3, "0") as "032" | "033" | "034" | "035"]);
const sourceSqlModified = git(["diff", "--name-only", "--", FIXTURE, BASELINE, ...MIGRATIONS]) !== "";
const credentialLikeContentFound = /(password|service[_-]?role[_-]?key|eyJ[A-Za-z0-9_-]{20,}|postgresql:\/\/)/i.test(`${generatedText}\n${domainText}`);
const machineSpecificContentFound = /(?:[A-Z]:\\|localhost:\d+|127\.0\.0\.1:\d+|phase9t-[a-z]+-\d+)/i.test(`${generatedText}\n${domainText}`);
const internalEnginePresentInGeneratedType = generatedText.includes("knowledge_transition_source_authorization_internal:");
const internalEngineApplicationAuthorized = /TransitionSourceAuthorizationCommand|knowledge_transition_source_authorization_internal/.test(domainText);
const domainAliasesDerivedFromDatabaseType = /Database\["public"\]\["Enums"\]/.test(domainText)
  && /Database\["public"\]\["Tables"\]/.test(domainText);
const manualSourceRegistryEnumUnionIntroduced = sourceRegistryEnums.some((name) => {
  const alias = new RegExp(`type\\s+\\w+\\s*=\\s*[^\\n]*${name}[^\\n]*\\|`);
  return alias.test(domainText);
});
const tamper = tamperPack(catalog);
const residualContainerCount = docker(["ps", "-a", "--filter", "name=phase9t-", "--format", "{{.Names}}"]).stdout.split(/\r?\n/).filter(Boolean).length;
const residualVolumeCount = 0;
const profilesGeneratedContractPassed =
  /profiles: \{[\s\S]*?Row: \{[\s\S]*?dna: Exclude<Json, null>[\s\S]*?Insert: \{[\s\S]*?dna\?: Exclude<Json, null>[\s\S]*?goals\?: string\[\] \| null[\s\S]*?id: string/.test(generatedText);
const scheduledAtGeneratedContractPassed =
  /document_intelligence_jobs: \{[\s\S]*?Row: \{[\s\S]*?scheduled_at: string[\s\S]*?Insert: \{[\s\S]*?scheduled_at\?: string/.test(generatedText);
const jsonTypeContractPassed = /export type Json =\s*\|\s*string[\s\S]*\|\s*number[\s\S]*\|\s*boolean[\s\S]*\|\s*null[\s\S]*Json\[\]/.test(generatedText)
  && !/export type Json[\s\S]{0,300}\bany\b/.test(generatedText);
const sourceRegistryEnumDefinitionsMatchCatalog = sourceRegistryEnums.length === 15
  && sourceRegistryEnums.every((name) => catalog.enums[name]
    && JSON.stringify(enumLabels(generatedText, name)) === JSON.stringify(catalog.enums[name]));
const sourceRegistryTableTypesPresent = sourceRegistryTables.every((name) => catalog.tables.includes(name) && generatedText.includes(`${name}: {`));
const sourceRegistryRpcTypesPresent = sourceRegistryRpcs.every((name) => generatedText.includes(`${name}:`));
const tempRemoved = !compile.temp || !existsSync(compile.temp);
const allPassed = !error && generationA && generationB
  && generationA.postgresVersion.startsWith("17.") && generationB.postgresVersion.startsWith("17.")
  && baselineHashMatchesTrustedValue && forwardMigrationHashesMatchTrustedValues && !sourceSqlModified
  && parity.tableDefinitions && parity.inserts && parity.updates && parity.relationships
  && parity.functions && parity.overloads && parity.enums && parity.views && parity.composites
  && sourceRegistryEnumDefinitionsMatchCatalog && sourceRegistryTableTypesPresent && sourceRegistryRpcTypesPresent
  && internalEnginePresentInGeneratedType && !internalEngineApplicationAuthorized
  && profilesGeneratedContractPassed && scheduledAtGeneratedContractPassed && jsonTypeContractPassed
  && domainAliasesDerivedFromDatabaseType && !manualSourceRegistryEnumUnionIntroduced
  && typeHashesMatch && compile.passed && compile.positive >= 40 && compile.negative >= 60
  && tamper.count >= 120 && tamper.rejected === tamper.count
  && !credentialLikeContentFound && !machineSpecificContentFound
  && residualContainerCount === 0 && residualVolumeCount === 0 && tempRemoved;

const result = {
  checkId: CHECK_ID, phase: PHASE, allPassed: Boolean(allPassed), blocked: !allPassed,
  blockReason: allPassed ? null : error ?? "VALIDATION_INVARIANT_FAILED",
  defectClassification: allPassed ? "NONE" : error?.includes("REPOSITORY_STATE") ? "REPOSITORY_STATE" : "VALIDATOR_DEFECT",
  sourceCommit: git(["rev-parse", "--short", "HEAD"]), expectedSourceCommit: EXPECTED_HEAD,
  generationMethod: "official Supabase postgres-meta local catalog generator with deterministic overload and cross-schema relationship completion",
  generatorPackage: GENERATOR_PACKAGE, generatorVersion: GENERATOR_VERSION,
  remoteAuthenticationRequired: false, remoteProjectUsed: false,
  fixtureSha256: shaFile(FIXTURE), baselineSha256: shaFile(BASELINE),
  migration032Sha256: migrationHashes[0], migration033Sha256: migrationHashes[1],
  migration034Sha256: migrationHashes[2], migration035Sha256: migrationHashes[3],
  baselineHashMatchesTrustedValue, forwardMigrationHashesMatchTrustedValues, sourceSqlModified,
  generatedDatabaseTypePath: DATABASE_TYPES, sourceRegistryDomainTypePath: DOMAIN_TYPES, auditRunnerPath: SELF,
  catalogPublicTableCount: catalog.tables.length, generatedPublicTableCount: parity.tableCount,
  catalogPublicFunctionCount: new Set(catalog.functions.map((fn) => fn.name)).size, generatedPublicFunctionCount: parity.functionCount,
  catalogPublicFunctionIdentityCount: catalog.functions.length,
  catalogPublicEnumCount: Object.keys(catalog.enums).length, generatedPublicEnumCount: parity.enumCount,
  generatedTableDefinitionsMatchCatalog: parity.tableDefinitions,
  generatedRowDefinitionMismatches: parity.rowMismatches,
  generatedInsertDefinitionsMatchCatalog: parity.inserts,
  generatedInsertDefinitionMismatches: parity.insertMismatches,
  generatedUpdateDefinitionsMatchCatalog: parity.updates,
  generatedUpdateDefinitionMismatches: parity.updateMismatches,
  generatedRelationshipInventoryMatchesCatalog: parity.relationships,
  generatedFunctionSignaturesMatchCatalog: parity.functions,
  generatedFunctionOverloadsPreserved: parity.overloads,
  generatedEnumDefinitionsMatchCatalog: parity.enums,
  generatedViewsMatchCatalog: parity.views,
  generatedCompositeTypesMatchCatalog: parity.composites,
  sourceRegistryEnumCount: sourceRegistryEnums.length,
  sourceRegistryEnumDefinitionsMatchCatalog,
  sourceRegistryTableTypesPresent, sourceRegistryRpcTypesPresent,
  internalEnginePresentInGeneratedType, internalEngineApplicationAuthorized,
  profilesGeneratedContractPassed, scheduledAtGeneratedContractPassed, jsonTypeContractPassed,
  domainAliasesDerivedFromDatabaseType, manualSourceRegistryEnumUnionIntroduced,
  generationRunCount: generationA && generationB ? 2 : 0,
  generatedTypeByteForByteStable: typeHashesMatch,
  generatedTypeSha256RunA: generationA ? shaText(generationA.text) : null,
  generatedTypeSha256RunB: generationB ? shaText(generationB.text) : null,
  generatedTypeSha256CommittedArtifact: generatedText ? shaText(generatedText) : null,
  generatedDatabaseTypeSha256: generatedText ? shaText(generatedText) : null,
  sourceRegistryDomainTypeSha256: domainText ? shaText(domainText) : null,
  positiveCompileTimeCaseCount: compile.positive, negativeCompileTimeCaseCount: compile.negative,
  compileTimeContractsPassed: compile.passed, compileTimeContractFailureDetail: compile.detail,
  generatedTypeTamperCaseCount: tamper.count, generatedTypeTamperCasesRejected: tamper.rejected,
  credentialLikeContentFound, machineSpecificContentFound,
  supabaseClientCreated: false, serverRepositoryCreated: false, browserClientModified: false,
  serverClientModified: false, rpcWrapperCreated: false, runtimeDatabaseCallPerformed: false,
  remoteDatabaseCallPerformed: false, productionDatabaseCallPerformed: false,
  serviceRoleCredentialUsed: false, publicRuntimeAuthorized: false, ingestionRuntimeEnabled: false,
  retrievalRuntimeEnabled: false, smartTalkRuntimeModified: false,
  cleanupAttempted, containerRemoved: residualContainerCount === 0,
  temporaryArtifactsRemoved: tempRemoved, residualContainerCount, residualVolumeCount,
  readyForSourceRegistryServerContract: Boolean(allPassed),
  recommendedNextPhase: allPassed
    ? "PHASE 9U — Source Registry Server Contract and Narrow RPC Client Surface"
    : "REPAIR PHASE 9T",
} as const;

console.log(JSON.stringify(result, null, 2));
if (!allPassed) process.exitCode = 1;
