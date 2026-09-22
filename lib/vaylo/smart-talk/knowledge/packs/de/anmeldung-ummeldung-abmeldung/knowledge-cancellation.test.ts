import assert from "node:assert/strict";
import { EventEmitter, getEventListeners } from "node:events";
import { existsSync } from "node:fs";
import * as nodeModule from "node:module";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import type { Client } from "pg";

type ResolveContext = { parentURL?: string };
type NextResolve = (specifier: string, context: ResolveContext) => { url: string };
const registerHooks = (nodeModule as unknown as {
  registerHooks: (hooks: {
    resolve: (
      specifier: string,
      context: ResolveContext,
      nextResolve: NextResolve,
    ) => { url: string; shortCircuit?: boolean };
  }) => void;
}).registerHooks;

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "server-only") {
      return { url: "data:text/javascript,export%20{};", shortCircuit: true };
    }
    let unresolvedPath: string | null = null;
    if (specifier.startsWith("@/")) {
      unresolvedPath = path.join(process.cwd(), specifier.slice(2));
    } else if (
      (specifier.startsWith("./") || specifier.startsWith("../"))
      && context.parentURL?.startsWith("file:")
    ) {
      unresolvedPath = path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier);
    }
    if (unresolvedPath && path.extname(unresolvedPath) === "") {
      for (const candidate of [`${unresolvedPath}.ts`, path.join(unresolvedPath, "index.ts")]) {
        if (existsSync(candidate)) return nextResolve(pathToFileURL(candidate).href, context);
      }
    }
    return nextResolve(specifier, context);
  },
});

type Deferred<T> = Readonly<{
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason: unknown) => void;
}>;

function deferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

async function flushUntil(predicate: () => boolean): Promise<void> {
  for (let attempt = 0; attempt < 50 && !predicate(); attempt += 1) {
    await Promise.resolve();
  }
  assert.equal(predicate(), true, "expected asynchronous stage was not reached");
}

const FEDERAL_ENV = {
  NODE_ENV: "test",
  SMART_TALK_PRODUCTION_KNOWLEDGE_CONTROLLED_ENABLED: "true",
  BIRELLO_PRODUCTION_KNOWLEDGE_RETRIEVAL_DATABASE_URL:
    "postgresql://reader:synthetic@example.invalid/knowledge",
  BIRELLO_PRODUCTION_KNOWLEDGE_RETRIEVAL_DATABASE_NAME: "knowledge",
  BIRELLO_PRODUCTION_KNOWLEDGE_READER: "birello_knowledge_reader",
} satisfies NodeJS.ProcessEnv;

const LOCAL_ENV = {
  ...FEDERAL_ENV,
  SMART_TALK_ANMELDUNG_LOCAL_CONTEXT_CONTROLLED_ENABLED: "true",
  BIRELLO_ANMELDUNG_LOCAL_CONTEXT_RETRIEVAL_DATABASE_URL:
    "postgresql://reader:synthetic@example.invalid/knowledge",
  BIRELLO_ANMELDUNG_LOCAL_CONTEXT_RETRIEVAL_DATABASE_NAME: "knowledge",
  BIRELLO_ANMELDUNG_LOCAL_CONTEXT_READER: "birello_knowledge_reader",
} satisfies NodeJS.ProcessEnv;

const CONFIGURATION = {
  database: "knowledge",
  clientConfig: { connectionString: "postgresql://reader:synthetic@example.invalid/knowledge" },
};

const LIVE_SOURCE = {
  canonicalUrl: "https://www.vg-wilburgstetten.de/verwaltung-service/oeffnungszeiten/",
  officialDomain: "www.vg-wilburgstetten.de",
  normalizedOrigin: "https://www.vg-wilburgstetten.de",
};

test("knowledge preparation cancellation", async (suite) => {
  const controlled = await import("./controlled-runtime-retrieval");
  const live = await import("./live-operational-evidence");
  const unitId = "anmeldung-duty";

  await suite.test("already-aborted input starts no selector, database, DNS, or HTTP work", async () => {
    const controller = new AbortController();
    controller.abort();
    const calls: string[] = [];
    await assert.rejects(
      controlled.prepareControlledQuestionKnowledge(
        { text: "Anmeldung", locale: "de", environment: FEDERAL_ENV, signal: controller.signal },
        {
          selectUnitIds: async () => {
            calls.push("selector");
            return [];
          },
          retrieveRows: async () => {
            calls.push("database");
            throw new Error("must not run");
          },
          liveOperational: {
            resolveAddresses: async () => {
              calls.push("dns");
              return [];
            },
            fetch: async () => {
              calls.push("http");
              throw new Error("must not run");
            },
            now: () => new Date(0),
          },
          report: () => calls.push("report"),
        },
      ),
      (error: unknown) => live.isKnowledgePreparationCancelled(error),
    );
    assert.deepEqual(calls, []);
  });

  await suite.test("unit selector aborts its fetch and prevents later stages", async (context) => {
    const originalFetch = globalThis.fetch;
    const originalKey = process.env.OPENAI_API_KEY;
    context.after(() => {
      globalThis.fetch = originalFetch;
      if (originalKey === undefined) delete process.env.OPENAI_API_KEY;
      else process.env.OPENAI_API_KEY = originalKey;
    });
    process.env.OPENAI_API_KEY = "synthetic";
    let selectorSignal: AbortSignal | null = null;
    let localityCalls = 0;
    let retrievalCalls = 0;
    globalThis.fetch = async (_input, init) => {
      selectorSignal = init?.signal ?? null;
      return await new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener(
          "abort",
          () => reject(new DOMException("synthetic abort", "AbortError")),
          { once: true },
        );
      });
    };
    const controller = new AbortController();
    const preparation = controlled.prepareControlledQuestionKnowledge(
      { text: "Anmeldung in Weiltingen", locale: "de", environment: LOCAL_ENV, signal: controller.signal },
      {
        selectUnitIds: controlled.selectUnitsWithModel,
        selectLocalityKey: async () => {
          localityCalls += 1;
          return "weiltingen";
        },
        retrieveRows: async () => {
          retrievalCalls += 1;
          throw new Error("must not run");
        },
        retrieveAnmeldungContext: async () => {
          retrievalCalls += 1;
          throw new Error("must not run");
        },
        report: () => undefined,
      },
    );
    await flushUntil(() => selectorSignal !== null);
    controller.abort();
    await assert.rejects(preparation, (error: unknown) => live.isKnowledgePreparationCancelled(error));
    assert.equal((selectorSignal as AbortSignal | null)?.aborted, true);
    assert.equal(localityCalls, 0);
    assert.equal(retrievalCalls, 0);
  });

  await suite.test("locality selector abort prevents database and live requests", async (context) => {
    const originalFetch = globalThis.fetch;
    const originalKey = process.env.OPENAI_API_KEY;
    context.after(() => {
      globalThis.fetch = originalFetch;
      if (originalKey === undefined) delete process.env.OPENAI_API_KEY;
      else process.env.OPENAI_API_KEY = originalKey;
    });
    process.env.OPENAI_API_KEY = "synthetic";
    let selectorSignal: AbortSignal | null = null;
    let databaseCalls = 0;
    let liveCalls = 0;
    globalThis.fetch = async (_input, init) => {
      selectorSignal = init?.signal ?? null;
      return await new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener(
          "abort",
          () => reject(new DOMException("synthetic abort", "AbortError")),
          { once: true },
        );
      });
    };
    const controller = new AbortController();
    const preparation = controlled.prepareControlledQuestionKnowledge(
      { text: "Öffnungszeiten in Weiltingen", locale: "de", environment: LOCAL_ENV, signal: controller.signal },
      {
        selectUnitIds: async () => [unitId],
        selectLocalityKey: controlled.selectLocalityKeyWithModel,
        retrieveRows: async () => {
          databaseCalls += 1;
          throw new Error("must not run");
        },
        retrieveAnmeldungContext: async () => {
          databaseCalls += 1;
          throw new Error("must not run");
        },
        liveOperational: {
          resolveAddresses: async () => {
            liveCalls += 1;
            return ["203.0.113.1"];
          },
          fetch: async () => {
            liveCalls += 1;
            throw new Error("must not run");
          },
          now: () => new Date(0),
        },
        report: () => undefined,
      },
    );
    await flushUntil(() => selectorSignal !== null);
    controller.abort();
    await assert.rejects(preparation, (error: unknown) => live.isKnowledgePreparationCancelled(error));
    assert.equal((selectorSignal as AbortSignal | null)?.aborted, true);
    assert.equal(databaseCalls, 0);
    assert.equal(liveCalls, 0);
  });

  await suite.test("mocked pg lifecycle terminates once during connect, checks, and RPC", async (dbSuite) => {
    for (const stopAt of ["connect", "identity", "privilege", "rpc"] as const) {
      await dbSuite.test(`abort during ${stopAt}`, async () => {
        const pending = deferred<never>();
        const events = new EventEmitter();
        const queries: string[] = [];
        let endCalls = 0;
        let activeReject: ((reason: unknown) => void) | null = null;
        const hold = () => new Promise<never>((_resolve, reject) => {
          activeReject = reject;
          void pending.promise.catch(() => undefined);
        });
        const client = Object.assign(events, {
          connect: async () => {
            if (stopAt === "connect") return await hold();
          },
          query: async (sql: string) => {
            queries.push(sql);
            if (stopAt === "identity" && sql.includes("current_user")) return await hold();
            if (stopAt === "privilege" && sql.includes("has_function_privilege")) return await hold();
            if (stopAt === "rpc" && sql.includes("knowledge_retrieve_evidence_packets")) return await hold();
            if (sql.includes("current_user")) {
              return {
                rows: [{
                  reader: "birello_knowledge_reader",
                  database_name: "knowledge",
                  rolsuper: false,
                  rolcreatedb: false,
                  rolcreaterole: false,
                  rolreplication: false,
                  rolbypassrls: false,
                  database_owner: false,
                }],
              };
            }
            if (sql.includes("has_function_privilege")) {
              return { rows: [{ retrieval: true, ingestion: false, schema_create: false, table_access: 0 }] };
            }
            return { rows: [] };
          },
          end: async () => {
            endCalls += 1;
            activeReject?.(new Error("synthetic connection termination"));
          },
        }) as unknown as Client;
        const controller = new AbortController();
        const operation = controlled.retrieveRowsFromProduction(
          [],
          ["DE"],
          CONFIGURATION,
          controller.signal,
          () => client,
        );
        await flushUntil(() =>
          stopAt === "connect"
            ? activeReject !== null
            : queries.some((query) =>
                stopAt === "identity"
                  ? query.includes("current_user")
                  : stopAt === "privilege"
                    ? query.includes("has_function_privilege")
                    : query.includes("knowledge_retrieve_evidence_packets")
              )
        );
        const queryCountAtAbort = queries.length;
        controller.abort();
        await assert.rejects(operation, (error: unknown) => live.isKnowledgePreparationCancelled(error));
        assert.equal(endCalls, 1);
        assert.equal(queries.length, queryCountAtAbort);
        assert.equal(events.listenerCount("error"), 0);
      });
    }
  });

  await suite.test("mocked local-context reader terminates its owned client during RPC", async () => {
    const events = new EventEmitter();
    const queries: string[] = [];
    let endCalls = 0;
    let rejectRpc: ((reason: unknown) => void) | null = null;
    const client = Object.assign(events, {
      connect: async () => undefined,
      query: async (sql: string) => {
        queries.push(sql);
        if (sql.includes("knowledge_retrieve_anmeldung_context")) {
          return await new Promise<never>((_resolve, reject) => {
            rejectRpc = reject;
          });
        }
        if (sql.includes("current_user")) {
          return {
            rows: [{
              reader: "birello_knowledge_reader",
              database_name: "knowledge",
              rolsuper: false,
              rolcreatedb: false,
              rolcreaterole: false,
              rolreplication: false,
              rolbypassrls: false,
              database_owner: false,
            }],
          };
        }
        if (sql.includes("has_function_privilege")) {
          return {
            rows: [{
              context_retrieval: true,
              ingestion: false,
              locality_ingestion: false,
              schema_create: false,
            }],
          };
        }
        return { rows: [] };
      },
      end: async () => {
        endCalls += 1;
        rejectRpc?.(new Error("synthetic connection termination"));
      },
    }) as unknown as Client;
    const controller = new AbortController();
    const operation = controlled.retrieveAnmeldungContextFromControlledReader(
      [],
      "09571181",
      CONFIGURATION,
      controller.signal,
      () => client,
    );
    await flushUntil(() => rejectRpc !== null);
    const queryCountAtAbort = queries.length;
    controller.abort();
    await assert.rejects(operation, (error: unknown) => live.isKnowledgePreparationCancelled(error));
    assert.equal(endCalls, 1);
    assert.equal(queries.length, queryCountAtAbort);
    assert.equal(events.listenerCount("error"), 0);
  });

  await suite.test("abort during mocked pg cleanup cannot become a successful result", async () => {
    const events = new EventEmitter();
    const close = deferred<void>();
    let endCalls = 0;
    const client = Object.assign(events, {
      connect: async () => undefined,
      query: async (sql: string) => {
        if (sql.includes("current_user")) {
          return {
            rows: [{
              reader: "birello_knowledge_reader",
              database_name: "knowledge",
              rolsuper: false,
              rolcreatedb: false,
              rolcreaterole: false,
              rolreplication: false,
              rolbypassrls: false,
              database_owner: false,
            }],
          };
        }
        if (sql.includes("has_function_privilege")) {
          return { rows: [{ retrieval: true, ingestion: false, schema_create: false, table_access: 0 }] };
        }
        return { rows: [] };
      },
      end: async () => {
        endCalls += 1;
        await close.promise;
      },
    }) as unknown as Client;
    const controller = new AbortController();
    const operation = controlled.retrieveRowsFromProduction(
      [],
      ["DE"],
      CONFIGURATION,
      controller.signal,
      () => client,
    );
    await flushUntil(() => endCalls === 1);
    controller.abort();
    close.resolve();
    await assert.rejects(operation, (error: unknown) => live.isKnowledgePreparationCancelled(error));
    assert.equal(endCalls, 1);
    assert.equal(events.listenerCount("error"), 0);
  });

  await suite.test("late DNS success and failure are handled and cannot start HTTP", async (dnsSuite) => {
    for (const settlement of ["success", "failure"] as const) {
      await dnsSuite.test(settlement, async () => {
        const dns = deferred<readonly string[]>();
        let httpCalls = 0;
        const controller = new AbortController();
        const unhandled: unknown[] = [];
        const onUnhandled = (reason: unknown) => unhandled.push(reason);
        process.on("unhandledRejection", onUnhandled);
        try {
          const operation = live.fetchLiveOpeningHours(
            LIVE_SOURCE,
            {
              resolveAddresses: async () => await dns.promise,
              fetch: async () => {
                httpCalls += 1;
                throw new Error("must not run");
              },
              now: () => new Date(0),
            },
            controller.signal,
          );
          await Promise.resolve();
          controller.abort();
          await assert.rejects(operation, (error: unknown) => live.isKnowledgePreparationCancelled(error));
          if (settlement === "success") dns.resolve(["93.184.216.34"]);
          else dns.reject(new Error("synthetic late DNS failure"));
          await Promise.resolve();
          await new Promise<void>((resolve) => setImmediate(resolve));
          assert.equal(httpCalls, 0);
          assert.deepEqual(unhandled, []);
        } finally {
          process.removeListener("unhandledRejection", onUnhandled);
        }
      });
    }
  });

  await suite.test("live HTTP aborts before headers and during stream reading", async (httpSuite) => {
    await httpSuite.test("before headers", async () => {
      let requestSignal: AbortSignal | null = null;
      const controller = new AbortController();
      const operation = live.fetchLiveOpeningHours(
        LIVE_SOURCE,
        {
          resolveAddresses: async () => ["93.184.216.34"],
          fetch: async (_input, init) => {
            requestSignal = init?.signal ?? null;
            return await new Promise<Response>((_resolve, reject) => {
              init?.signal?.addEventListener(
                "abort",
                () => reject(new DOMException("synthetic abort", "AbortError")),
                { once: true },
              );
            });
          },
          now: () => new Date(0),
        },
        controller.signal,
      );
      await flushUntil(() => requestSignal !== null);
      controller.abort();
      await assert.rejects(operation, (error: unknown) => live.isKnowledgePreparationCancelled(error));
      assert.equal((requestSignal as AbortSignal | null)?.aborted, true);
    });

    await httpSuite.test("pending body read", async () => {
      let cancelCalls = 0;
      let releaseCalls = 0;
      let readResolve: ((result: ReadableStreamReadResult<Uint8Array>) => void) | null = null;
      const body = {
        getReader: () => ({
          read: async () => await new Promise<ReadableStreamReadResult<Uint8Array>>((resolve) => {
            readResolve = resolve;
          }),
          cancel: async () => {
            cancelCalls += 1;
            readResolve?.({ done: true, value: undefined });
          },
          releaseLock: () => {
            releaseCalls += 1;
          },
        }),
      };
      const response = {
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "text/html" }),
        body,
      } as unknown as Response;
      const controller = new AbortController();
      const operation = live.fetchLiveOpeningHours(
        LIVE_SOURCE,
        {
          resolveAddresses: async () => ["93.184.216.34"],
          fetch: async () => response,
          now: () => new Date(0),
        },
        controller.signal,
      );
      await flushUntil(() => readResolve !== null);
      controller.abort();
      await assert.rejects(operation, (error: unknown) => live.isKnowledgePreparationCancelled(error));
      assert.equal(cancelCalls, 1);
      assert.equal(releaseCalls, 1);
    });
  });

  await suite.test("ordinary failures and no-signal success remain compatible", async (context) => {
    const originalFetch = globalThis.fetch;
    const originalKey = process.env.OPENAI_API_KEY;
    context.after(() => {
      globalThis.fetch = originalFetch;
      if (originalKey === undefined) delete process.env.OPENAI_API_KEY;
      else process.env.OPENAI_API_KEY = originalKey;
    });
    process.env.OPENAI_API_KEY = "synthetic";
    globalThis.fetch = async () => {
      throw new Error("synthetic ordinary provider failure");
    };
    assert.deepEqual(await controlled.selectUnitsWithModel("Anmeldung"), []);
    assert.equal(await controlled.selectLocalityKeyWithModel("Weiltingen"), null);

    globalThis.fetch = async () => new Response(JSON.stringify({
      choices: [{ message: { content: JSON.stringify({ unitIds: [unitId] }) } }],
    }), { status: 200, headers: { "content-type": "application/json" } });
    assert.deepEqual(await controlled.selectUnitsWithModel("Anmeldung"), [unitId]);

    const liveFailure = await live.fetchLiveOpeningHours(LIVE_SOURCE, {
      resolveAddresses: async () => {
        throw new Error("synthetic DNS failure");
      },
      fetch: async () => {
        throw new Error("must not run");
      },
      now: () => new Date(0),
    });
    assert.equal(liveFailure.ok, false);
    if (!liveFailure.ok) assert.equal(liveFailure.failureStage, "dns");
  });

  await suite.test("selector timeout remains bounded and owned resources are cleaned", async (context) => {
    const originalFetch = globalThis.fetch;
    const originalKey = process.env.OPENAI_API_KEY;
    context.mock.timers.enable({ apis: ["setTimeout"] });
    context.after(() => {
      globalThis.fetch = originalFetch;
      if (originalKey === undefined) delete process.env.OPENAI_API_KEY;
      else process.env.OPENAI_API_KEY = originalKey;
      context.mock.timers.reset();
    });
    process.env.OPENAI_API_KEY = "synthetic";
    let requestSignal: AbortSignal | null = null;
    globalThis.fetch = async (_input, init) => {
      requestSignal = init?.signal ?? null;
      return await new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener(
          "abort",
          () => reject(new DOMException("synthetic timeout", "TimeoutError")),
          { once: true },
        );
      });
    };
    const selection = controlled.selectUnitsWithModel("Anmeldung");
    await flushUntil(() => requestSignal !== null);
    context.mock.timers.tick(6_000);
    assert.deepEqual(await selection, []);
    assert.equal((requestSignal as AbortSignal | null)?.aborted, true);

    requestSignal = null;
    const locality = controlled.selectLocalityKeyWithModel("Weiltingen");
    await flushUntil(() => requestSignal !== null);
    context.mock.timers.tick(6_000);
    assert.equal(await locality, null);
    assert.equal((requestSignal as AbortSignal | null)?.aborted, true);
  });

  await suite.test("live HTTP timeout remains active through response-body reading", async (context) => {
    context.mock.timers.enable({ apis: ["setTimeout"] });
    context.after(() => context.mock.timers.reset());
    let requestSignal: AbortSignal | null = null;
    let cancelCalls = 0;
    let readResolve: ((result: ReadableStreamReadResult<Uint8Array>) => void) | null = null;
    const response = {
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "text/html" }),
      body: {
        getReader: () => ({
          read: async () => await new Promise<ReadableStreamReadResult<Uint8Array>>((resolve) => {
            readResolve = resolve;
          }),
          cancel: async () => {
            cancelCalls += 1;
            readResolve?.({ done: true, value: undefined });
          },
          releaseLock: () => undefined,
        }),
      },
    } as unknown as Response;
    const operation = live.fetchLiveOpeningHours(LIVE_SOURCE, {
      resolveAddresses: async () => ["93.184.216.34"],
      fetch: async (_input, init) => {
        requestSignal = init?.signal ?? null;
        return response;
      },
      now: () => new Date(0),
    });
    await flushUntil(() => requestSignal !== null && readResolve !== null);
    context.mock.timers.tick(7_000);
    const result = await operation;
    assert.equal(result.ok, false);
    if (!result.ok) assert.equal(result.failureStage, "fetch");
    assert.equal((requestSignal as AbortSignal | null)?.aborted, true);
    assert.equal(cancelCalls, 1);
  });

  async function captureUnhandled(work: () => Promise<void>): Promise<unknown[]> {
    const unhandled: unknown[] = [];
    const onUnhandled = (reason: unknown) => unhandled.push(reason);
    process.on("unhandledRejection", onUnhandled);
    try {
      await work();
      await new Promise<void>((resolve) => setImmediate(resolve));
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
      return unhandled;
    } finally {
      process.removeListener("unhandledRejection", onUnhandled);
    }
  }

  function syntheticNullBodyResponse(text: () => Promise<string>): Response {
    return {
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "text/html" }),
      body: null,
      text,
    } as unknown as Response;
  }

  await suite.test("DNS resolver abort plus rejected Promise has no unhandled rejection", async () => {
    const controller = new AbortController();
    let fetchCalls = 0;
    const unhandled = await captureUnhandled(async () => {
      await assert.rejects(
        live.fetchLiveOpeningHours(LIVE_SOURCE, {
          resolveAddresses: () => {
            controller.abort();
            return Promise.reject(new Error("synthetic DNS failure"));
          },
          fetch: async () => {
            fetchCalls += 1;
            throw new Error("must not run");
          },
          now: () => new Date(0),
        }, controller.signal),
        (error: unknown) => live.isKnowledgePreparationCancelled(error),
      );
    });
    assert.equal(fetchCalls, 0);
    assert.deepEqual(unhandled, []);
    assert.equal(getEventListeners(controller.signal, "abort").length, 0);
  });

  await suite.test("DNS resolver abort plus fulfilled Promise starts no HTTP request", async () => {
    const controller = new AbortController();
    let fetchCalls = 0;
    await assert.rejects(
      live.fetchLiveOpeningHours(LIVE_SOURCE, {
        resolveAddresses: () => {
          controller.abort();
          return Promise.resolve(["93.184.216.34"]);
        },
        fetch: async () => {
          fetchCalls += 1;
          throw new Error("must not run");
        },
        now: () => new Date(0),
      }, controller.signal),
      (error: unknown) => live.isKnowledgePreparationCancelled(error),
    );
    await new Promise<void>((resolve) => setImmediate(resolve));
    assert.equal(fetchCalls, 0);
    assert.equal(getEventListeners(controller.signal, "abort").length, 0);
  });

  await suite.test("non-streaming response text abort plus rejected Promise has no unhandled rejection", async () => {
    const controller = new AbortController();
    const response = syntheticNullBodyResponse(() => {
      controller.abort();
      return Promise.reject(new Error("synthetic body failure"));
    });
    const unhandled = await captureUnhandled(async () => {
      await assert.rejects(
        live.fetchLiveOpeningHours(LIVE_SOURCE, {
          resolveAddresses: async () => ["93.184.216.34"],
          fetch: async () => response,
          now: () => new Date(0),
        }, controller.signal),
        (error: unknown) => live.isKnowledgePreparationCancelled(error),
      );
    });
    assert.deepEqual(unhandled, []);
    assert.equal(getEventListeners(controller.signal, "abort").length, 0);
  });

  await suite.test("non-streaming response text abort plus fulfilled text publishes no evidence", async () => {
    const controller = new AbortController();
    const response = syntheticNullBodyResponse(() => {
      controller.abort();
      return Promise.resolve("<p>Montag 08:00 Uhr bis 12:00 Uhr.</p>");
    });
    await assert.rejects(
      live.fetchLiveOpeningHours(LIVE_SOURCE, {
        resolveAddresses: async () => ["93.184.216.34"],
        fetch: async () => response,
        now: () => new Date(0),
      }, controller.signal),
      (error: unknown) => live.isKnowledgePreparationCancelled(error),
    );
    await new Promise<void>((resolve) => setImmediate(resolve));
    assert.equal(getEventListeners(controller.signal, "abort").length, 0);
  });

  await suite.test("already-aborted live fetch starts neither resolver nor HTTP or body work", async () => {
    const controller = new AbortController();
    controller.abort();
    let resolverCalls = 0;
    let fetchCalls = 0;
    let textCalls = 0;
    await assert.rejects(
      live.fetchLiveOpeningHours(LIVE_SOURCE, {
        resolveAddresses: async () => {
          resolverCalls += 1;
          return ["93.184.216.34"];
        },
        fetch: async () => {
          fetchCalls += 1;
          textCalls += 1;
          return syntheticNullBodyResponse(async () => {
            textCalls += 1;
            return "<p>Montag 08:00 Uhr bis 12:00 Uhr.</p>";
          });
        },
        now: () => new Date(0),
      }, controller.signal),
      (error: unknown) => live.isKnowledgePreparationCancelled(error),
    );
    assert.equal(resolverCalls, 0);
    assert.equal(fetchCalls, 0);
    assert.equal(textCalls, 0);
  });

  await suite.test("ordinary resolver and non-streaming body rejections retain fixed failures", async (failureSuite) => {
    await failureSuite.test("resolver rejection remains a DNS failure", async () => {
      let fetchCalls = 0;
      const controller = new AbortController();
      const unhandled = await captureUnhandled(async () => {
        const result = await live.fetchLiveOpeningHours(LIVE_SOURCE, {
          resolveAddresses: () => Promise.reject(new Error("synthetic DNS failure")),
          fetch: async () => {
            fetchCalls += 1;
            throw new Error("must not run");
          },
          now: () => new Date(0),
        }, controller.signal);
        assert.equal(result.ok, false);
        if (!result.ok) assert.equal(result.failureStage, "dns");
      });
      assert.equal(fetchCalls, 0);
      assert.deepEqual(unhandled, []);
      assert.equal(controller.signal.aborted, false);
    });

    await failureSuite.test("response text rejection remains a fetch failure", async () => {
      const response = syntheticNullBodyResponse(
        () => Promise.reject(new Error("synthetic body failure")),
      );
      const unhandled = await captureUnhandled(async () => {
        const result = await live.fetchLiveOpeningHours(LIVE_SOURCE, {
          resolveAddresses: async () => ["93.184.216.34"],
          fetch: async () => response,
          now: () => new Date(0),
        });
        assert.equal(result.ok, false);
        if (!result.ok) {
          assert.equal(result.failureStage, "fetch");
          assert.equal(result.fetchSucceeded, true);
        }
      });
      assert.deepEqual(unhandled, []);
    });
  });
});
