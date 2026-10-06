import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import * as nodeModule from "node:module";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

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

const ASSESSMENT_SPECIFIER = "@/lib/vaylo/smart-talk/pii/explain-text-controlled-assessment";
const realAssessmentHref = pathToFileURL(
  path.join(process.cwd(), "lib/vaylo/smart-talk/pii/explain-text-controlled-assessment.ts"),
).href;
const assessmentWrapper = `
import { assessExplainTextCandidate as realAssess } from ${JSON.stringify(realAssessmentHref)};
export function assessExplainTextCandidate(input) {
  if (globalThis.__explainTextAssessmentThrows) {
    throw new Error("synthetic-assessment-failure");
  }
  if (globalThis.__explainTextAssessmentOverride) {
    return globalThis.__explainTextAssessmentOverride;
  }
  return realAssess(input);
}
`;

registerHooks({
  resolve(specifier: string, context: ResolveContext, nextResolve: NextResolve) {
    if (specifier === "server-only") {
      return { url: "data:text/javascript,export%20{};", shortCircuit: true };
    }
    if (specifier === "next/server") {
      return nextResolve("next/server.js", context);
    }
    if (specifier === ASSESSMENT_SPECIFIER) {
      return {
        url: `data:text/javascript,${encodeURIComponent(assessmentWrapper)}`,
        shortCircuit: true,
      };
    }

    let unresolvedPath: string | null = null;
    if (specifier.startsWith("@/")) {
      unresolvedPath = path.join(process.cwd(), specifier.slice(2));
    } else if (
      (specifier.startsWith("./") || specifier.startsWith("../")) &&
      context.parentURL?.startsWith("file:")
    ) {
      unresolvedPath = path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier);
    }

    if (unresolvedPath && path.extname(unresolvedPath) === "") {
      for (const candidate of [
        `${unresolvedPath}.ts`,
        `${unresolvedPath}.tsx`,
        path.join(unresolvedPath, "index.ts"),
        path.join(unresolvedPath, "index.tsx"),
      ]) {
        if (existsSync(candidate)) return nextResolve(pathToFileURL(candidate).href, context);
      }
    }
    return nextResolve(specifier, context);
  },
});

const SECRET = "synthetic-internal-secret";
const SYNTHETIC_EMAIL = "ada.vzor@example.test";
const EMAIL_TEXT = `Kontakt ${SYNTHETIC_EMAIL} kvoli oznamu.`;
const NO_SIGNAL_TEXT = "Prosim vysvetlite tento oznam o poplatku.";
const RESULT_KEYS = [
  "code",
  "modelCallPermitted",
  "paymentAuthorized",
  "publicProcessingPermitted",
  "readyForModel",
  "redactionFindings",
  "textTreatedAsAnonymous",
].sort();

type PostHandler = (request: Request) => Promise<Response>;

const testGlobals = globalThis as typeof globalThis & {
  __explainTextAssessmentThrows?: boolean;
  __explainTextAssessmentOverride?: unknown;
};

function withHeaderView(request: Request, contentLength: string | null): Request {
  return new Proxy(request, {
    get(target, prop) {
      if (prop === "headers") {
        const headers = new Headers(target.headers);
        if (contentLength === null) headers.delete("content-length");
        else headers.set("content-length", contentLength);
        return headers;
      }
      const value = Reflect.get(target, prop, target);
      return typeof value === "function" ? value.bind(target) : value;
    },
  });
}

function trackBodyReads(request: Request): { request: Request; reads: () => number } {
  let reads = 0;
  const wrapped = new Proxy(request, {
    get(target, prop) {
      if (
        prop === "body" ||
        prop === "text" ||
        prop === "json" ||
        prop === "arrayBuffer" ||
        prop === "blob" ||
        prop === "formData"
      ) {
        reads += 1;
      }
      const value = Reflect.get(target, prop, target);
      return typeof value === "function" ? value.bind(target) : value;
    },
  });
  return { request: wrapped, reads: () => reads };
}

function postJson(
  body: string,
  headers: Record<string, string> = {},
  contentLength: string | null = undefined as unknown as string | null,
): Request {
  const request = new Request("http://localhost/api/smart-talk/explain-text-assessment", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...headers,
    },
    body,
  });
  if (contentLength === undefined) return request;
  return withHeaderView(request, contentLength);
}

async function readJson(response: Response): Promise<Record<string, unknown>> {
  return await response.json() as Record<string, unknown>;
}

function assertClosedPermissions(body: Record<string, unknown>, forbidden: readonly string[]) {
  assert.deepEqual(Object.keys(body).sort(), RESULT_KEYS);
  assert.equal(body.modelCallPermitted, false);
  assert.equal(body.readyForModel, false);
  assert.equal(body.textTreatedAsAnonymous, false);
  assert.equal(body.paymentAuthorized, false);
  assert.equal(body.publicProcessingPermitted, false);
  assert.equal("safeForModel" in body, false);
  const serialized = JSON.stringify(body);
  for (const value of forbidden) {
    assert.equal(serialized.includes(value), false, `response leaked ${value}`);
  }
  assert.equal(serialized.includes("synthetic-assessment-failure"), false);
  assert.equal(serialized.includes("Error"), false);
}

test("internal explain-text assessment", async (t) => {
  const { POST } = await import("./route") as { POST: PostHandler };
  const originalFetch = globalThis.fetch;
  let fetchCalls = 0;
  globalThis.fetch = async () => {
    fetchCalls += 1;
    throw new Error("synthetic-fetch-must-not-run");
  };
  const previousSecret = process.env.VAYLO_INTERNAL_RUNTIME_SECRET;

  try {
    await t.test("missing server secret is rejected before the body is read", async () => {
      delete process.env.VAYLO_INTERNAL_RUNTIME_SECRET;
      const tracked = trackBodyReads(postJson(
        JSON.stringify({ candidateText: EMAIL_TEXT }),
        { "x-vaylo-internal-runtime-secret": SECRET },
      ));
      const response = await POST(tracked.request);
      const body = await readJson(response);
      assert.equal(response.status, 403);
      assert.equal(response.headers.get("cache-control"), "no-store");
      assert.equal(body.code, "closed");
      assert.equal(body.redactionFindings, "unavailable");
      assert.equal(tracked.reads(), 0);
      assertClosedPermissions(body, [SYNTHETIC_EMAIL, EMAIL_TEXT, SECRET]);
    });

    await t.test("invalid header is rejected before the body is read", async () => {
      process.env.VAYLO_INTERNAL_RUNTIME_SECRET = SECRET;
      const tracked = trackBodyReads(postJson(
        JSON.stringify({ candidateText: EMAIL_TEXT }),
        { "x-vaylo-internal-runtime-secret": "wrong-secret" },
      ));
      const response = await POST(tracked.request);
      const body = await readJson(response);
      assert.equal(response.status, 403);
      assert.equal(tracked.reads(), 0);
      assert.equal(body.code, "closed");
      assertClosedPermissions(body, [SYNTHETIC_EMAIL, "wrong-secret", SECRET]);
    });

    await t.test("a non-JSON content type is rejected before the body is read", async () => {
      process.env.VAYLO_INTERNAL_RUNTIME_SECRET = SECRET;
      const tracked = trackBodyReads(postJson(
        JSON.stringify({ candidateText: EMAIL_TEXT }),
        {
          "content-type": "text/plain",
          "x-vaylo-internal-runtime-secret": SECRET,
        },
      ));
      const response = await POST(tracked.request);
      const body = await readJson(response);
      assert.equal(response.status, 415);
      assert.equal(response.headers.get("cache-control"), "no-store");
      assert.equal(tracked.reads(), 0);
      assert.equal(body.code, "closed");
      assert.equal(body.redactionFindings, "unavailable");
      assertClosedPermissions(body, [SYNTHETIC_EMAIL, EMAIL_TEXT]);
    });

    await t.test("application/json with charset is still assessed", async () => {
      process.env.VAYLO_INTERNAL_RUNTIME_SECRET = SECRET;
      const response = await POST(postJson(
        JSON.stringify({ candidateText: NO_SIGNAL_TEXT }),
        {
          "content-type": "application/json; charset=utf-8",
          "x-vaylo-internal-runtime-secret": SECRET,
        },
      ));
      const body = await readJson(response);
      assert.equal(response.status, 200);
      assert.equal(body.code, "no_supported_signal");
      assertClosedPermissions(body, [NO_SIGNAL_TEXT]);
    });

    await t.test("an oversized stream is closed at 64 KiB even when content-length is absent", async () => {
      process.env.VAYLO_INTERNAL_RUNTIME_SECRET = SECRET;
      let pulled = 0;
      const stream = new ReadableStream<Uint8Array>({
        pull(controller) {
          const size = 1024;
          pulled += size;
          if (pulled > 256 * 1024) {
            controller.error(new Error("synthetic-overread"));
            return;
          }
          controller.enqueue(new Uint8Array(size).fill(65));
        },
      });
      const request = withHeaderView(new Request("http://localhost/api/smart-talk/explain-text-assessment", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-vaylo-internal-runtime-secret": SECRET,
        },
        body: stream,
        duplex: "half",
      } as RequestInit), null);
      const response = await POST(request);
      const body = await readJson(response);
      assert.equal(response.status, 413);
      assert.equal(body.code, "closed");
      assert.equal(pulled <= 64 * 1024 + 1024, true);
      assertClosedPermissions(body, ["synthetic-overread", "A".repeat(32)]);
    });

    await t.test("an oversized body with a small content-length is still closed at 64 KiB", async () => {
      process.env.VAYLO_INTERNAL_RUNTIME_SECRET = SECRET;
      let pulled = 0;
      const stream = new ReadableStream<Uint8Array>({
        pull(controller) {
          const size = 1024;
          pulled += size;
          if (pulled > 256 * 1024) {
            controller.error(new Error("synthetic-overread"));
            return;
          }
          controller.enqueue(new Uint8Array(size).fill(66));
        },
      });
      const request = withHeaderView(new Request("http://localhost/api/smart-talk/explain-text-assessment", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-vaylo-internal-runtime-secret": SECRET,
        },
        body: stream,
        duplex: "half",
      } as RequestInit), "4");
      const response = await POST(request);
      const body = await readJson(response);
      assert.equal(response.status, 413);
      assert.equal(body.code, "closed");
      assert.equal(pulled > 4, true);
      assert.equal(pulled <= 64 * 1024 + 1024, true);
      assertClosedPermissions(body, ["synthetic-overread", "B".repeat(32)]);
    });

    await t.test("a lying large content-length does not reject a small JSON body", async () => {
      process.env.VAYLO_INTERNAL_RUNTIME_SECRET = SECRET;
      const response = await POST(postJson(
        JSON.stringify({ candidateText: NO_SIGNAL_TEXT }),
        { "x-vaylo-internal-runtime-secret": SECRET },
        "10000000",
      ));
      const body = await readJson(response);
      assert.equal(response.status, 200);
      assert.equal(body.code, "no_supported_signal");
      assert.equal(body.redactionFindings, "none");
      assertClosedPermissions(body, [NO_SIGNAL_TEXT, "vysvetlite"]);
    });

    await t.test("invalid JSON shapes stay closed", async () => {
      process.env.VAYLO_INTERNAL_RUNTIME_SECRET = SECRET;
      const payloads = [
        "{",
        "[]",
        "null",
        JSON.stringify("text-only"),
        JSON.stringify({ candidateText: NO_SIGNAL_TEXT, extra: true }),
        JSON.stringify({ note: NO_SIGNAL_TEXT }),
        JSON.stringify({ candidateText: 12 }),
      ];
      for (const payload of payloads) {
        const response = await POST(postJson(payload, {
          "x-vaylo-internal-runtime-secret": SECRET,
        }));
        const body = await readJson(response);
        assert.equal(response.status, 400);
        assert.equal(body.code, "closed");
        assert.equal(body.redactionFindings, "unavailable");
        assertClosedPermissions(body, [NO_SIGNAL_TEXT, "text-only"]);
      }
    });

    await t.test("synthetic email stays a revision and is not echoed", async () => {
      process.env.VAYLO_INTERNAL_RUNTIME_SECRET = SECRET;
      const response = await POST(postJson(
        JSON.stringify({ candidateText: EMAIL_TEXT }),
        { "x-vaylo-internal-runtime-secret": SECRET },
      ));
      const body = await readJson(response);
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("cache-control"), "no-store");
      assert.equal(body.code, "needs_user_revision");
      assert.equal(body.redactionFindings === "present" || body.redactionFindings === "none", true);
      assertClosedPermissions(body, [SYNTHETIC_EMAIL, EMAIL_TEXT]);
    });

    await t.test("text without a supported signal does not authorize processing", async () => {
      process.env.VAYLO_INTERNAL_RUNTIME_SECRET = SECRET;
      const response = await POST(postJson(
        JSON.stringify({ candidateText: NO_SIGNAL_TEXT }),
        { "x-vaylo-internal-runtime-secret": SECRET },
      ));
      const body = await readJson(response);
      assert.equal(response.status, 200);
      assert.equal(body.code, "no_supported_signal");
      assert.equal(body.redactionFindings, "none");
      assertClosedPermissions(body, [NO_SIGNAL_TEXT]);
    });

    await t.test("a closed assessment result is an error and is not HTTP 200", async () => {
      process.env.VAYLO_INTERNAL_RUNTIME_SECRET = SECRET;
      testGlobals.__explainTextAssessmentOverride = {
        code: "closed",
        redactionFindings: "unavailable",
        modelCallPermitted: true,
        readyForModel: true,
        textTreatedAsAnonymous: true,
        paymentAuthorized: true,
        publicProcessingPermitted: true,
      };
      try {
        const response = await POST(postJson(
          JSON.stringify({ candidateText: NO_SIGNAL_TEXT }),
          { "x-vaylo-internal-runtime-secret": SECRET },
        ));
        const body = await readJson(response);
        assert.notEqual(response.status, 200);
        assert.equal(response.status, 500);
        assert.equal(body.code, "closed");
        assert.equal(body.redactionFindings, "unavailable");
        assertClosedPermissions(body, [NO_SIGNAL_TEXT]);
      } finally {
        testGlobals.__explainTextAssessmentOverride = undefined;
      }
    });

    await t.test("an unexpected code containing an identifier is replaced by generic closed", async () => {
      process.env.VAYLO_INTERNAL_RUNTIME_SECRET = SECRET;
      const marker = "QX-77-ZZ";
      testGlobals.__explainTextAssessmentOverride = {
        code: `needs_user_revision ${marker}`,
        redactionFindings: `present ${marker}`,
        modelCallPermitted: true,
        readyForModel: true,
        textTreatedAsAnonymous: true,
        paymentAuthorized: true,
        publicProcessingPermitted: true,
      };
      try {
        const response = await POST(postJson(
          JSON.stringify({ candidateText: EMAIL_TEXT }),
          { "x-vaylo-internal-runtime-secret": SECRET },
        ));
        const body = await readJson(response);
        assert.equal(response.status, 500);
        assert.equal(body.code, "closed");
        assert.equal(body.redactionFindings, "unavailable");
        assertClosedPermissions(body, [marker, SYNTHETIC_EMAIL, EMAIL_TEXT, "needs_user_revision QX"]);
      } finally {
        testGlobals.__explainTextAssessmentOverride = undefined;
      }
    });

    await t.test("an assessment exception closes without the exception text", async () => {
      process.env.VAYLO_INTERNAL_RUNTIME_SECRET = SECRET;
      testGlobals.__explainTextAssessmentThrows = true;
      try {
        const response = await POST(postJson(
          JSON.stringify({ candidateText: NO_SIGNAL_TEXT }),
          { "x-vaylo-internal-runtime-secret": SECRET },
        ));
        const body = await readJson(response);
        assert.equal(response.status, 500);
        assert.equal(body.code, "closed");
        assert.equal(body.redactionFindings, "unavailable");
        assertClosedPermissions(body, [NO_SIGNAL_TEXT, "synthetic-assessment-failure"]);
      } finally {
        testGlobals.__explainTextAssessmentThrows = false;
      }
    });

    assert.equal(fetchCalls, 0);
  } finally {
    globalThis.fetch = originalFetch;
    if (previousSecret === undefined) delete process.env.VAYLO_INTERNAL_RUNTIME_SECRET;
    else process.env.VAYLO_INTERNAL_RUNTIME_SECRET = previousSecret;
    testGlobals.__explainTextAssessmentThrows = false;
    testGlobals.__explainTextAssessmentOverride = undefined;
  }
});
