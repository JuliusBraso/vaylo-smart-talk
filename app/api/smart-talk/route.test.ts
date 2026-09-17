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

registerHooks({
  resolve(specifier: string, context: ResolveContext, nextResolve: NextResolve) {
    if (specifier === "server-only") {
      return { url: "data:text/javascript,export%20{};", shortCircuit: true };
    }
    if (specifier === "next/server") {
      return nextResolve("next/server.js", context);
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

type PostHandler = (request: Request) => Promise<Response>;

const VALID_MODEL_RESULT = {
  summary: "Synthetic summary.",
  meaning: "Synthetic meaning.",
  urgency: "low",
  nextSteps: [],
  warnings: [],
  stabilizers: [],
  confidenceLevel: "medium",
  consequencePhase: "none",
  documentQuality: "clear",
  documentKind: "unknown",
  domain: "municipal",
  documentTypeLabel: "",
  paymentChannel: "not_applicable",
  proceduralState: "informational",
  legalSeverity: "none",
  deadlines: [],
  rights: [],
  obligations: [],
  consequences: [],
};

let requestSequence = 0;

function jsonRequest(body: unknown, headers: Record<string, string> = {}): Request {
  requestSequence += 1;
  return new Request("http://localhost/api/smart-talk", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": `192.0.2.${requestSequence}`,
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

function rawJsonRequest(body: string): Request {
  requestSequence += 1;
  return new Request("http://localhost/api/smart-talk", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": `192.0.2.${requestSequence}`,
    },
    body,
  });
}

function multipartRequest(form: FormData): Request {
  requestSequence += 1;
  return new Request("http://localhost/api/smart-talk", {
    method: "POST",
    headers: { "x-forwarded-for": `192.0.2.${requestSequence}` },
    body: form,
  });
}

async function responseBody(response: Response): Promise<Record<string, unknown>> {
  return await response.json() as Record<string, unknown>;
}

test("Smart Talk dispatch is explicit and controlled modes are contained", async (t) => {
  const { POST: smartTalkPost } = await import("./route") as { POST: PostHandler };
  const { POST: photoPost } = await import("../smart-talk-photo/route") as { POST: PostHandler };
  const originalFetch = globalThis.fetch;
  const environmentKeys = [
    "OPENAI_API_KEY",
    "SMART_TALK_FREE_QA_PUBLIC_ENABLED",
    "SMART_TALK_PRODUCTION_KNOWLEDGE_CONTROLLED_ENABLED",
    "SMART_TALK_ANMELDUNG_LOCAL_CONTEXT_CONTROLLED_ENABLED",
    "SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED",
    "SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED",
    "SMART_TALK_REAL_OCR_EXTRACTION_ENABLED",
    "SMART_TALK_OCR_TO_SMART_TALK_HANDOFF_ENABLED",
    "SMART_TALK_OCR_CONTROLLED_REASONING_ENABLED",
    "SMART_TALK_FIRST_CONTACT_MODE_ENABLED",
    "VAYLO_INTERNAL_RUNTIME_SECRET",
    "VAYLO_ENABLE_INTERNAL_SMART_TALK_RUNTIME",
    "VAYLO_ENABLE_CONTROLLED_TEXT_PILOT",
    "VAYLO_CONTROLLED_TEXT_PILOT_KILL_SWITCH",
    "VAYLO_CONTROLLED_TEXT_PILOT_ALLOWLIST",
    "VAYLO_CONTROLLED_TEXT_PILOT_SCENARIO_ALLOWLIST",
  ] as const;
  let fetchCalls = 0;
  let mockOpenAiMessageContent: string | null = null;
  let lastProviderRequestBody: {
    messages?: Array<{ role: string; content: string }>;
  } | null = null;

  globalThis.fetch = async (_input, init) => {
    fetchCalls += 1;
    if (typeof init?.body === "string") {
      lastProviderRequestBody = JSON.parse(init.body) as {
        messages?: Array<{ role: string; content: string }>;
      };
    }
    const content = mockOpenAiMessageContent ?? JSON.stringify(VALID_MODEL_RESULT);
    return new Response(JSON.stringify({
      choices: [{ message: { content } }],
    }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };

  for (const key of environmentKeys) delete process.env[key];
  process.env.OPENAI_API_KEY = "synthetic-test-key";
  process.env.SMART_TALK_PRODUCTION_KNOWLEDGE_CONTROLLED_ENABLED = "false";
  process.env.SMART_TALK_ANMELDUNG_LOCAL_CONTEXT_CONTROLLED_ENABLED = "false";

  const expectNoFetch = async (
    request: Request,
    expectedStatus: number,
    expectedCode?: string,
  ) => {
    fetchCalls = 0;
    const response = await smartTalkPost(request);
    const body = await responseBody(response);
    assert.equal(response.status, expectedStatus);
    if (expectedCode) assert.equal(body.code ?? body.error, expectedCode);
    assert.equal(fetchCalls, 0);
  };

  try {
    await t.test("legacy, malformed, and conflicting selectors fail before processing", async () => {
      for (const body of [
        { context: "anonymous", inputType: "question", text: "Ako funguje Anmeldung?" },
        { context: "anonymous", inputType: "text", text: "Synthetic document text." },
        { mode: null },
        { mode: "" },
        { mode: 7 },
        { mode: {} },
        { mode: "unknown_mode" },
      ]) {
        await expectNoFetch(jsonRequest(body), 400);
      }
      await expectNoFetch(rawJsonRequest("{"), 400, "invalid_json");
      await expectNoFetch(jsonRequest([]), 400, "invalid_body");
      await expectNoFetch(jsonRequest({
        mode: "free_qa_public_beta",
        internalRuntimeMode: "synthetic_e2e_guarded",
      }), 400, "conflicting_routing_selectors");
      await expectNoFetch(jsonRequest({
        mode: null,
        internalRuntimeMode: "synthetic_e2e_guarded",
      }), 400, "conflicting_routing_selectors");
      await expectNoFetch(jsonRequest({
        mode: "free_qa_public_beta",
        internalRuntimeGuard: "marker",
      }), 400, "public_internal_marker_conflict");
      await expectNoFetch(jsonRequest({
        mode: "free_qa_public_beta",
        internalFreeQaTestEnabled: true,
      }), 400, "public_internal_marker_conflict");
      await expectNoFetch(jsonRequest({
        internalRuntimeGuard: "marker",
      }), 400, "internal_runtime_mode_required");
      await expectNoFetch(jsonRequest({
        internalFreeQaTestEnabled: true,
      }), 400, "internal_runtime_mode_required");
      await expectNoFetch(jsonRequest({
        internalRuntimeMode: "unknown_internal",
        internalRuntimeGuard: "marker",
      }), 400, "unknown_internal_runtime_mode");
      await expectNoFetch(jsonRequest({
        internalRuntimeMode: null,
      }), 400, "invalid_internal_runtime_mode");
      await expectNoFetch(jsonRequest({
        internalRuntimeMode: "controlled_live_text_guarded",
        internalFreeQaTestEnabled: true,
      }), 400, "internal_marker_mode_mismatch");
    });

    await t.test("free-question PII screening blocks before external processing", async () => {
      process.env.SMART_TALK_FREE_QA_PUBLIC_ENABLED = "true";

      const { screenFreeQuestionInput } = await import(
        "@/lib/vaylo/smart-talk/pii/free-question-input-screening"
      );

      const cleanQuestions = [
        "Ako zmením meno po svadbe?",
        "Kde nájdem adresu Finanzamtu vo Viedni?",
        "Pracujem v Rakúsku a rodina býva na Slovensku. Ako požiadam o rodinné dávky?",
        "Ako funguje zdravotné poistenie pri práci v Nemecku?",
        "Som nezamestnaný v Bratislave, aké sú kroky pri registrácii?",
        "Aké dane platím pri príjme 2400 EUR mesačne v Rakúsku?",
        "Mám 42 rokov a chcem požiadať o Kindergeld v DE, ako postupovať?",
        "Potrebujem termín na 15.03.2026 na úrade v Košiciach.",
        "Ako zistím customer ID pre tento postup?",
        "Kde nájdem číslo pasu v pokynoch úradu?",
        "Mám otázku k trvalému pobytu. Kde je adresa magistrátu v Brne?",
        "Bývanie v nájomnom byte — aké sú povinnosti nájomcu?",
        "1999-01-01 a 15.09.1986 sú len dátumy v mojej otázke o lehote.",
      ];
      for (const text of cleanQuestions) {
        assert.equal(screenFreeQuestionInput(text).reasonCode, "no_supported_signal_detected");
      }

      assert.equal(screenFreeQuestionInput("990101/1234").reasonCode, "user_revision_required");
      assert.equal(screenFreeQuestionInput("995101/1234").reasonCode, "user_revision_required");

      assert.equal(screenFreeQuestionInput("Číslo pasu: AB1234567").reasonCode, "user_revision_required");
      assert.equal(screenFreeQuestionInput("Moja adresa je Lipová ulica 12.").reasonCode, "user_revision_required");
      assert.equal(screenFreeQuestionInput("Ich wohne in Hauptstraße 12.").reasonCode, "user_revision_required");
      assert.equal(
        screenFreeQuestionInput("My home address is Example Street 12.").reasonCode,
        "user_revision_required",
      );
      assert.equal(
        screenFreeQuestionInput("My home address is 12 Example Street.").reasonCode,
        "user_revision_required",
      );
      assert.equal(screenFreeQuestionInput("Ich wohne in Hauptstr. 12.").reasonCode, "user_revision_required");
      assert.equal(screenFreeQuestionInput("I live at 44 Cedar Rd.").reasonCode, "user_revision_required");
      assert.equal(
        screenFreeQuestionInput("My home address is Cedar Rd. 44.").reasonCode,
        "user_revision_required",
      );
      assert.equal(
        screenFreeQuestionInput("Delivery address is 9 Mill Ln.").reasonCode,
        "user_revision_required",
      );
      assert.equal(
        screenFreeQuestionInput("Ich wohne in Kirchgasse 5 und habe eine Frage.").reasonCode,
        "user_revision_required",
      );

      assert.equal(
        screenFreeQuestionInput("Ich wohne in Wien, das Amt ist in Hauptstraße 12.").reasonCode,
        "no_supported_signal_detected",
      );
      assert.equal(
        screenFreeQuestionInput("Ich wohne in Wien; das Amt ist in Hauptstraße 12.").reasonCode,
        "no_supported_signal_detected",
      );
      assert.equal(
        screenFreeQuestionInput("Ich wohne in Wien. Das Amt ist in Hauptstraße 12.").reasonCode,
        "no_supported_signal_detected",
      );
      assert.equal(
        screenFreeQuestionInput("Ich wohne in Wien\nDas Amt ist in Hauptstraße 12.").reasonCode,
        "no_supported_signal_detected",
      );
      assert.equal(
        screenFreeQuestionInput("Birkenweg 7, ich wohne in Graz.").reasonCode,
        "no_supported_signal_detected",
      );
      assert.equal(
        screenFreeQuestionInput("Delivery address is required on this Road form.").reasonCode,
        "no_supported_signal_detected",
      );

      assert.equal(
        screenFreeQuestionInput("My home address is unknown. Office is Cedar Road 44.").reasonCode,
        "no_supported_signal_detected",
      );
      assert.equal(
        screenFreeQuestionInput("My home address is unknown\nOffice is Cedar Road 44.").reasonCode,
        "no_supported_signal_detected",
      );
      assert.equal(
        screenFreeQuestionInput("My home address is unknown\r\nOffice is Cedar Road 44.").reasonCode,
        "no_supported_signal_detected",
      );
      assert.equal(
        screenFreeQuestionInput("My home address is unknown\u2028Office is Cedar Road 44.").reasonCode,
        "no_supported_signal_detected",
      );
      assert.equal(
        screenFreeQuestionInput("My home address is unknown\u2029Office is Cedar Road 44.").reasonCode,
        "no_supported_signal_detected",
      );
      assert.equal(
        screenFreeQuestionInput("Moja adresa je neznáma\nLipová ulica 12 je adresa úradu.").reasonCode,
        "no_supported_signal_detected",
      );
      assert.equal(
        screenFreeQuestionInput("Ich wohne in\nHauptstraße 12.").reasonCode,
        "no_supported_signal_detected",
      );
      assert.equal(
        screenFreeQuestionInput("My home address is pending. Branch is Willow Court 9.").reasonCode,
        "no_supported_signal_detected",
      );

      assert.equal(
        screenFreeQuestionInput("My home address is North Maple Ridge Street 12.").reasonCode,
        "user_revision_required",
      );
      assert.equal(
        screenFreeQuestionInput("I live at 44 Cedar\tRoad in a rental flat.").reasonCode,
        "user_revision_required",
      );

      assert.equal(
        screenFreeQuestionInput("Delivery address is 9 Mill Lane for parcel pickup.").reasonCode,
        "user_revision_required",
      );
      assert.equal(
        screenFreeQuestionInput("I live at 44 Cedar Road in a rental flat.").reasonCode,
        "user_revision_required",
      );
      assert.equal(
        screenFreeQuestionInput("Moja adresa je Lipová ulica 12.\nKde je úrad v Brne?").reasonCode,
        "user_revision_required",
      );
      assert.equal(
        screenFreeQuestionInput("Bývanie v byte. Ich wohne in Wien.\nAmt in Parkstraße 3.").reasonCode,
        "no_supported_signal_detected",
      );

      fetchCalls = 0;
      const addressRoute = await smartTalkPost(jsonRequest({
        mode: "free_qa_public_beta",
        context: "anonymous",
        inputType: "question",
        locale: "sk",
        text: "My home address is 12 Example Street, how do I register?",
        privacyAlreadyRedacted: true,
      }));
      const addressBody = await responseBody(addressRoute);
      assert.equal(addressRoute.status, 422);
      assert.equal(addressBody.code, "question_privacy_revision_required");
      assert.equal(fetchCalls, 0);
      assert.equal(JSON.stringify(addressBody).includes("Example"), false);

      fetchCalls = 0;
      const abbrevRoute = await smartTalkPost(jsonRequest({
        mode: "free_qa_public_beta",
        context: "anonymous",
        inputType: "question",
        locale: "sk",
        text: "Ich wohne in Hauptstr. 12 und brauche Hilfe bei der Anmeldung.",
        clientPrivacyPass: true,
      }));
      const abbrevBody = await responseBody(abbrevRoute);
      assert.equal(abbrevRoute.status, 422);
      assert.equal(abbrevBody.code, "question_privacy_revision_required");
      assert.equal(fetchCalls, 0);
      assert.equal(JSON.stringify(abbrevBody).includes("Hauptstr"), false);

      assert.equal(screenFreeQuestionInput("aaa\ud800").reasonCode, "invalid_input");
      assert.equal(screenFreeQuestionInput("\udc00aaa").reasonCode, "invalid_input");
      assert.equal(screenFreeQuestionInput("\ud800a").reasonCode, "invalid_input");
      assert.equal(
        screenFreeQuestionInput("Ako postupujem pri registrácii v Nemecku? 😀").reasonCode,
        "no_supported_signal_detected",
      );
      assert.equal(screenFreeQuestionInput("a".repeat(12_000)).reasonCode, "no_supported_signal_detected");
      assert.equal(screenFreeQuestionInput("a".repeat(12_001)).reasonCode, "invalid_input");
      const decomposedOverLimit = `${"e\u0301".repeat(6001)}?`;
      assert.equal(decomposedOverLimit.length, 12_003);
      assert.equal(screenFreeQuestionInput(decomposedOverLimit).reasonCode, "invalid_input");

      const piiSamples = [
        {
          text: "Volám sa Juraj Kováč, potrebujem radu k poisteniu.",
          needle: "Juraj",
        },
        {
          text: "Ich heiße Lena Vogt und habe eine Frage zur Anmeldung.",
          needle: "Lena",
        },
        {
          text: "My name is Oliver Reed — how do I register for health insurance?",
          needle: "Oliver",
        },
        {
          text: "Napíšte mi na zdravotne.otazky@example.org prosím postup.",
          needle: "zdravotne.otazky@example.org",
        },
        {
          text: "Kontakt telefón: +421 918 445 667, chcem vedieť o dávkach.",
          needle: "+421",
        },
        {
          text: "Platba na účet SK68 1100 0000 0029 8765 4321 za poplatok.",
          needle: "SK68",
        },
        {
          text: "V dokumente je uvedené 990101/1234, čo mám urobiť ďalej?",
          needle: "990101",
        },
        {
          text: "Číslo pasu: AB1234567 je v žiadosti, ako pokračovať?",
          needle: "AB1234567",
        },
        {
          text: "Moja adresa je Lipová ulica 12, potrebujem zmeniť trvalý pobyt.",
          needle: "Lipová",
        },
        {
          text: "Ich wohne in Hauptstraße 12 und brauche Hilfe bei der Anmeldung.",
          needle: "Hauptstraße",
        },
        {
          text: "My home address is Example Street 12, how do I register?",
          needle: "Example",
        },
      ];

      for (const sample of piiSamples) {
        assert.equal(screenFreeQuestionInput(sample.text).reasonCode, "user_revision_required");
        fetchCalls = 0;
        const response = await smartTalkPost(jsonRequest({
          mode: "free_qa_public_beta",
          context: "anonymous",
          inputType: "question",
          locale: "sk",
          text: sample.text,
          privacyAlreadyRedacted: true,
          clientPrivacyPass: true,
        }));
        const body = await responseBody(response);
        assert.equal(response.status, 422);
        assert.equal(body.code, "question_privacy_revision_required");
        assert.equal(body.ok, false);
        assert.equal(fetchCalls, 0);
        const serialized = JSON.stringify(body);
        assert.equal(serialized.includes(sample.needle), false);
        assert.equal(Object.keys(body).sort().join(","), "code,ok");
      }

      fetchCalls = 0;
      const cleanRoute = await smartTalkPost(jsonRequest({
        mode: "free_qa_public_beta",
        context: "anonymous",
        inputType: "question",
        locale: "sk",
        text: "Ako zmením meno po svadbe?",
      }));
      assert.equal(cleanRoute.status, 200);
      assert.equal(fetchCalls, 1);

      fetchCalls = 0;
      const cleanRoute2 = await smartTalkPost(jsonRequest({
        mode: "free_qa_public_beta",
        context: "anonymous",
        inputType: "question",
        locale: "sk",
        text: "Pracujem v Rakúsku a rodina býva na Slovensku. Ako požiadam o rodinné dávky?",
      }));
      assert.equal(cleanRoute2.status, 200);
      assert.equal(fetchCalls, 1);

      assert.equal(screenFreeQuestionInput(12).reasonCode, "invalid_input");
      assert.equal(screenFreeQuestionInput("x\ud800yaaaa").reasonCode, "invalid_input");
      const maxClean = `Ako postupujem pri registrácii v ${"Nemecku. ".repeat(900)}`;
      assert.equal(maxClean.length <= 12_000, true);
      assert.equal(screenFreeQuestionInput(maxClean).reasonCode, "no_supported_signal_detected");

      delete process.env.SMART_TALK_FREE_QA_PUBLIC_ENABLED;
    });

    await t.test("public Free Q&A retains flag and input/document guards", async () => {
      delete process.env.SMART_TALK_FREE_QA_PUBLIC_ENABLED;
      await expectNoFetch(jsonRequest({
        mode: "free_qa_public_beta",
        context: "anonymous",
        inputType: "question",
        locale: "sk",
        text: "Ako funguje Anmeldung?",
      }), 403, "free_qa_public_beta_disabled");

      process.env.SMART_TALK_FREE_QA_PUBLIC_ENABLED = "true";
      await expectNoFetch(jsonRequest({
        mode: "free_qa_public_beta",
        context: "anonymous",
        inputType: "text",
        locale: "sk",
        text: "Ako funguje Anmeldung?",
      }), 400, "free_qa_question_only");
      await expectNoFetch(jsonRequest({
        mode: "free_qa_public_beta",
        context: "anonymous",
        inputType: "question",
        locale: "sk",
        text: "Sehr geehrte Damen und Herren, Aktenzeichen 12345, mit freundlichen Grüßen.",
      }), 402, "document_mode_required");

      fetchCalls = 0;
      const response = await smartTalkPost(jsonRequest({
        mode: "free_qa_public_beta",
        context: "anonymous",
        inputType: "question",
        locale: "sk",
        text: "Ako funguje Anmeldung?",
      }));
      const body = await responseBody(response);
      assert.equal(response.status, 200);
      assert.equal(body.mode, "free_qa_public_beta");
      assert.equal(fetchCalls, 1);
    });

    await t.test("all flag-only public capabilities remain contained even when flags are true", async () => {
      process.env.SMART_TALK_TEXT_DOCUMENT_MODE_ENABLED = "true";
      process.env.SMART_TALK_PHOTO_OCR_CONTROLLED_RUNTIME_ENABLED = "true";
      process.env.SMART_TALK_REAL_OCR_EXTRACTION_ENABLED = "true";
      process.env.SMART_TALK_OCR_TO_SMART_TALK_HANDOFF_ENABLED = "true";
      process.env.SMART_TALK_OCR_CONTROLLED_REASONING_ENABLED = "true";
      process.env.SMART_TALK_FIRST_CONTACT_MODE_ENABLED = "true";

      for (const mode of [
        "text_document_controlled_runtime",
        "photo_ocr_controlled_runtime",
        "photo_ocr_real_extraction_controlled_runtime",
        "photo_ocr_real_extraction_to_smart_talk_controlled_handoff",
        "first_contact_controlled_runtime",
      ]) {
        await expectNoFetch(jsonRequest({ mode }), 503, "smart_talk_mode_unavailable");
      }
    });

    await t.test("multipart routing is singular, explicit, and contained", async () => {
      await expectNoFetch(multipartRequest(new FormData()), 400, "invalid_mode");

      const duplicate = new FormData();
      duplicate.append("mode", "photo_ocr_real_extraction_controlled_runtime");
      duplicate.append("mode", "photo_ocr_real_extraction_controlled_runtime");
      await expectNoFetch(multipartRequest(duplicate), 400, "invalid_mode");

      const fileValued = new FormData();
      fileValued.append("mode", new File(["synthetic"], "mode.txt", { type: "text/plain" }));
      await expectNoFetch(multipartRequest(fileValued), 400, "invalid_mode");

      const unknown = new FormData();
      unknown.append("mode", "unknown_mode");
      await expectNoFetch(multipartRequest(unknown), 400, "unknown_mode");

      const conflict = new FormData();
      conflict.append("mode", "photo_ocr_real_extraction_controlled_runtime");
      conflict.append("internalRuntimeMode", "synthetic_e2e_guarded");
      await expectNoFetch(multipartRequest(conflict), 400, "public_internal_marker_conflict");

      const extraction = new FormData();
      extraction.append("mode", "photo_ocr_real_extraction_controlled_runtime");
      extraction.append("image", new File(["synthetic"], "page.png", { type: "image/png" }));
      await expectNoFetch(multipartRequest(extraction), 503, "smart_talk_mode_unavailable");

      for (const operation of [null, "controlled_reasoning"]) {
        const handoff = new FormData();
        handoff.append("mode", "photo_ocr_real_extraction_to_smart_talk_controlled_handoff");
        handoff.append("image", new File(["synthetic"], "page.png", { type: "image/png" }));
        if (operation) handoff.append("operation", operation);
        await expectNoFetch(multipartRequest(handoff), 503, "smart_talk_mode_unavailable");
      }
    });

    await t.test("recognized internal modes keep their original controls", async () => {
      const freeQaBody = {
        internalRuntimeMode: "free_qa_internal_scoped_patch",
        internalRuntimeGuard: "I_UNDERSTAND_THIS_IS_INTERNAL_FREE_QA_SCOPED_PATCH_ONLY",
        internalFreeQaTestEnabled: true,
        context: "anonymous",
        inputType: "question",
        locale: "sk",
        text: "Ako funguje Anmeldung?",
      };
      await expectNoFetch(jsonRequest(freeQaBody), 403, "free_qa_patch_internal_auth_failed");

      process.env.VAYLO_INTERNAL_RUNTIME_SECRET = "synthetic-internal-secret";
      fetchCalls = 0;
      const freeQa = await smartTalkPost(jsonRequest(freeQaBody, {
        "x-vaylo-internal-runtime-secret": "synthetic-internal-secret",
      }));
      assert.equal(freeQa.status, 200);
      assert.equal(fetchCalls, 1);

      await expectNoFetch(jsonRequest({
        internalRuntimeMode: "controlled_text_pilot_guarded",
      }), 403);
      process.env.VAYLO_ENABLE_INTERNAL_SMART_TALK_RUNTIME = "true";
      process.env.VAYLO_ENABLE_CONTROLLED_TEXT_PILOT = "true";
      process.env.VAYLO_CONTROLLED_TEXT_PILOT_KILL_SWITCH = "false";
      process.env.VAYLO_CONTROLLED_TEXT_PILOT_ALLOWLIST = "reviewer-1";
      process.env.VAYLO_CONTROLLED_TEXT_PILOT_SCENARIO_ALLOWLIST = "scenario-1";
      fetchCalls = 0;
      const pilot = await smartTalkPost(jsonRequest({
        internalRuntimeMode: "controlled_text_pilot_guarded",
        internalRuntimeGuard: "I_UNDERSTAND_THIS_IS_CONTROLLED_TEXT_PILOT_INTERNAL_ONLY",
        pilotReviewerId: "reviewer-1",
        pilotScenarioId: "scenario-1",
        pilotInputMode: "real_question_guarded",
        pilotRunId: "synthetic-run",
        text: "Synthetic question.",
        requestedOcr: false,
        requestedFileUpload: false,
        requestedPayment: false,
        requestedPersistence: false,
        requestedDnaSave: false,
        requestedOfflineSave: false,
        requestedPublicRuntime: false,
        requestedLiveLLM: false,
        neverUserVisible: true,
      }, {
        "x-vaylo-internal-runtime-secret": "synthetic-internal-secret",
      }));
      assert.equal(pilot.status, 200);
      assert.equal(fetchCalls, 0);

      await expectNoFetch(jsonRequest({
        internalRuntimeMode: "controlled_live_text_guarded",
        internalRuntimeGuard: "wrong",
      }, {
        "x-vaylo-internal-runtime-secret": "synthetic-internal-secret",
      }), 403, "controlled_live_text_guard_not_satisfied");

      fetchCalls = 0;
      const controlledLive = await smartTalkPost(jsonRequest({
        internalRuntimeMode: "controlled_live_text_guarded",
        internalRuntimeGuard: "I_UNDERSTAND_THIS_IS_CONTROLLED_LIVE_TEXT_INTERNAL_ONLY",
      }, {
        "x-vaylo-internal-runtime-secret": "synthetic-internal-secret",
      }));
      assert.equal(controlledLive.status, 200);
      assert.equal(fetchCalls, 0);

      await expectNoFetch(jsonRequest({
        internalRuntimeMode: "synthetic_e2e_guarded",
        internalRuntimeGuard: "I_UNDERSTAND_THIS_IS_SYNTHETIC_INTERNAL_ONLY",
      }, {
        "x-vaylo-internal-runtime-secret": "invalid",
      }), 403);

      fetchCalls = 0;
      const synthetic = await smartTalkPost(jsonRequest({
        internalRuntimeMode: "synthetic_e2e_guarded",
        internalRuntimeGuard: "I_UNDERSTAND_THIS_IS_SYNTHETIC_INTERNAL_ONLY",
        fixtureMode: "mock_safe",
      }, {
        "x-vaylo-internal-runtime-secret": "synthetic-internal-secret",
      }));
      assert.equal(synthetic.status, 200);
      assert.equal(fetchCalls, 0);
    });

    await t.test("public Free Q&A strict output contract rejects malformed provider payloads", async (context) => {
      context.after(() => {
        mockOpenAiMessageContent = null;
      });
      process.env.SMART_TALK_FREE_QA_PUBLIC_ENABLED = "true";
      const publicQuestion = {
        mode: "free_qa_public_beta",
        context: "anonymous",
        inputType: "question",
        locale: "sk",
        text: "Ako postupujem pri registrácii na obecnom úrade v Nemecku?",
      };
      const questionNeedle = "registrácii";
      const validJson = JSON.stringify(VALID_MODEL_RESULT);

      const expectStrictReject = async (providerContent: string, providerNeedle: string) => {
        mockOpenAiMessageContent = providerContent;
        fetchCalls = 0;
        const response = await smartTalkPost(jsonRequest(publicQuestion));
        const body = await responseBody(response);
        assert.equal(fetchCalls, 1);
        assert.equal(response.status, 503);
        assert.deepEqual(body, { ok: false, error: "smart_talk_unavailable" });
        assert.equal(Object.keys(body).sort().join(","), "error,ok");
        const serialized = JSON.stringify(body);
        assert.equal(serialized.includes(questionNeedle), false);
        assert.equal(serialized.includes(providerNeedle), false);
      };

      const expectStrictRejectNoProviderNeedle = async (providerContent: string) => {
        mockOpenAiMessageContent = providerContent;
        fetchCalls = 0;
        const response = await smartTalkPost(jsonRequest(publicQuestion));
        const body = await responseBody(response);
        assert.equal(fetchCalls, 1);
        assert.equal(response.status, 503);
        assert.deepEqual(body, { ok: false, error: "smart_talk_unavailable" });
        assert.equal(Object.keys(body).sort().join(","), "error,ok");
        assert.equal(JSON.stringify(body).includes(questionNeedle), false);
      };

      await expectStrictRejectNoProviderNeedle("");
      await expectStrictRejectNoProviderNeedle("   \n\t  ");

      await expectStrictReject("{SYNTH_STRICT_BAD_JSON", "SYNTH_STRICT_BAD_JSON");
      await expectStrictReject(`${validJson} SYNTH_TRAILING_PROSE`, "SYNTH_TRAILING_PROSE");
      await expectStrictReject(
        `\`\`\`json\n${validJson}\n\`\`\``,
        "SYNTH_FENCE_MARKER",
      );
      await expectStrictReject("null", "null");
      await expectStrictReject("[]", "[]");
      await expectStrictReject(JSON.stringify("SYNTH_SCALAR_ONLY"), "SYNTH_SCALAR_ONLY");

      const withoutSummary = { ...VALID_MODEL_RESULT };
      delete (withoutSummary as { summary?: string }).summary;
      await expectStrictReject(JSON.stringify(withoutSummary), "Synthetic summary");

      const withoutRights = { ...VALID_MODEL_RESULT };
      delete (withoutRights as { rights?: string[] }).rights;
      await expectStrictReject(JSON.stringify(withoutRights), "Synthetic summary");

      await expectStrictReject(
        JSON.stringify({ ...VALID_MODEL_RESULT, summary: "   " }),
        "Synthetic meaning",
      );
      await expectStrictReject(
        JSON.stringify({ ...VALID_MODEL_RESULT, meaning: "   " }),
        "Synthetic summary",
      );
      await expectStrictReject(
        JSON.stringify({ ...VALID_MODEL_RESULT, summary: 42 }),
        "Synthetic summary",
      );
      await expectStrictReject(
        JSON.stringify({ ...VALID_MODEL_RESULT, urgency: "SYNTH_INVALID_ENUM" }),
        "SYNTH_INVALID_ENUM",
      );
      await expectStrictReject(
        JSON.stringify({ ...VALID_MODEL_RESULT, SYNTH_EXTRA_KEY: "x" }),
        "SYNTH_EXTRA_KEY",
      );
      await expectStrictReject(
        JSON.stringify({ ...VALID_MODEL_RESULT, nextSteps: [42] }),
        "42",
      );
      await expectStrictReject(
        JSON.stringify({ ...VALID_MODEL_RESULT, nextSteps: ["   "] }),
        "Synthetic summary",
      );
      await expectStrictReject(
        JSON.stringify({
          ...VALID_MODEL_RESULT,
          nextSteps: Array.from({ length: 17 }, (_, i) => `step-${i}`),
        }),
        "step-16",
      );
      await expectStrictReject(
        JSON.stringify({ ...VALID_MODEL_RESULT, summary: "x".repeat(8001) }),
        "xxxx",
      );

      mockOpenAiMessageContent = `  \n${validJson}\n  `;
      fetchCalls = 0;
      const paddedOk = await smartTalkPost(jsonRequest(publicQuestion));
      const paddedBody = await responseBody(paddedOk);
      assert.equal(fetchCalls, 1);
      assert.equal(paddedOk.status, 200);
      assert.equal(paddedBody.ok, true);

      mockOpenAiMessageContent = JSON.stringify({
        ...VALID_MODEL_RESULT,
        documentTypeLabel: "",
        nextSteps: [],
        warnings: [],
      });
      fetchCalls = 0;
      const emptyArraysOk = await smartTalkPost(jsonRequest(publicQuestion));
      assert.equal(emptyArraysOk.status, 200);
      assert.equal(fetchCalls, 1);

      const inventedDate = "15.03.2099";
      mockOpenAiMessageContent = JSON.stringify({
        ...VALID_MODEL_RESULT,
        meaning: `Lehota do ${inventedDate} je všeobecná orientácia.`,
      });
      fetchCalls = 0;
      const calendarResponse = await smartTalkPost(jsonRequest(publicQuestion));
      const calendarBody = await responseBody(calendarResponse);
      assert.equal(calendarResponse.status, 200);
      assert.equal(fetchCalls, 1);
      const meaning = (calendarBody.result as { meaning?: string }).meaning ?? "";
      assert.equal(meaning.includes(inventedDate), false);
      assert.equal(meaning.includes("kalendárny dátum"), true);
    });

    await t.test("public Free Q&A applies the DE/AT/SK cross-border jurisdiction contract", async (context) => {
      const {
        buildSmartTalkMessages,
        PUBLIC_JURISDICTION_SCOPE_MARKER,
        LOCALE_NOT_JURISDICTION_MARKER,
        GERMANY_ONLY_INSTITUTION_MARKER,
        PUBLIC_EDUCATIONAL_EXPLAINER_MARKER,
        PUBLIC_QUESTION_WARNINGS_PATTERN_MARKER,
        PUBLIC_EDUCATIONAL_JSON_MEANING_GUIDANCE_MARKER,
        PUBLIC_QUESTION_URGENCY_CALIBRATION_MARKER,
      } = await import("@/lib/vaylo/smart-talk/build-smart-talk-prompt");

      context.after(() => {
        mockOpenAiMessageContent = null;
        lastProviderRequestBody = null;
      });

      const legacyGermanyOnlyRedirect =
        "o nemeckej byrokracii. Skúste otázku preformulovať v tomto kontexte.";
      const scopedSkRedirect =
        "rakúskej byrokracii a cezhraničných situáciách so Slovenskom";
      const legacyEducationalSentence =
        "Educational explainer mode (Phase 8.0B): Explain German bureaucracy terms and contrasts clearly and pedagogically.";
      const legacyEducationalJsonGuidance =
        "pedagogical explanation with Slovak gloss + German term in parentheses where helpful";
      const legacyWarningsPattern =
        "warnings pattern examples when the topic matches (paraphrase in output language; Slovak tone):";
      const legacyTimingGuidance =
        "Combine Steuer-ID / Anmeldung / Kindergeld timing notes into warnings only when they directly answer the user's risk";
      const austriaEducationalQuestion =
        "Čo znamená Familienbeihilfe v Rakúsku?";
      const austriaEducationalNeedle = "Familienbeihilfe";
      const legacyUrgencyFamilienkasse =
        "Examples mapping (not automatic rules): HIGH — Familienkasse repayment with deadline";
      const legacyUrgencyKrankenkasseBuergeramt =
        "Krankenkasse asking for more proofs, Bürgeramt registration documents";
      const legacyUrgencyPrefix = "Urgency calibration (question mode): Reflect practical stakes";
      const assertScopedPublicUrgency = (system: string) => {
        assert.equal(system.includes(PUBLIC_QUESTION_URGENCY_CALIBRATION_MARKER), true);
        assert.equal(system.includes(legacyUrgencyFamilienkasse), false);
        assert.equal(system.includes(legacyUrgencyKrankenkasseBuergeramt), false);
        assert.equal(system.includes(legacyUrgencyPrefix), false);
      };

      const scopedSk = buildSmartTalkMessages({
        text: "Synthetic jurisdiction probe.",
        locale: "sk",
        inputType: "question",
        publicJurisdictionScope: "de_at_sk_cross_border",
      });
      assert.equal(scopedSk.system.includes(PUBLIC_JURISDICTION_SCOPE_MARKER), true);
      assert.equal(scopedSk.system.includes(LOCALE_NOT_JURISDICTION_MARKER), true);
      assert.equal(scopedSk.system.includes(GERMANY_ONLY_INSTITUTION_MARKER), true);
      assert.equal(scopedSk.system.includes(scopedSkRedirect), true);
      assert.equal(scopedSk.system.includes(legacyGermanyOnlyRedirect), false);
      assert.equal(
        scopedSk.system.includes(
          "If the question is clearly outside German bureaucracy, politely decline by centering summary and meaning on this exact Slovak sentence",
        ),
        false,
      );

      const compatibleSk = buildSmartTalkMessages({
        text: "Synthetic compatible probe.",
        locale: "sk",
        inputType: "question",
      });
      assert.equal(compatibleSk.system.includes(legacyGermanyOnlyRedirect), true);
      assert.equal(compatibleSk.system.includes(PUBLIC_JURISDICTION_SCOPE_MARKER), false);
      assert.equal(compatibleSk.system.includes(legacyUrgencyFamilienkasse), true);
      assert.equal(compatibleSk.system.includes(PUBLIC_QUESTION_URGENCY_CALIBRATION_MARKER), false);

      const scopedDe = buildSmartTalkMessages({
        text: "Synthetic.",
        locale: "de",
        inputType: "question",
        publicJurisdictionScope: "de_at_sk_cross_border",
      });
      assert.equal(
        scopedDe.system.includes(
          "grenzüberschreitenden Situationen mit der Slowakei",
        ),
        true,
      );

      const scopedEn = buildSmartTalkMessages({
        text: "Synthetic.",
        locale: "en",
        inputType: "question",
        publicJurisdictionScope: "de_at_sk_cross_border",
      });
      assert.equal(
        scopedEn.system.includes("cross-border situations involving Slovakia"),
        true,
      );

      const strictDocScoped = buildSmartTalkMessages({
        text: "Synthetic document paste.",
        locale: "sk",
        inputType: "text",
        publicJurisdictionScope: "de_at_sk_cross_border",
      });
      assert.equal(
        strictDocScoped.system.includes("You explain German bureaucracy documents"),
        true,
      );
      assert.equal(strictDocScoped.system.includes(PUBLIC_JURISDICTION_SCOPE_MARKER), false);

      const scopedEducational = buildSmartTalkMessages({
        text: austriaEducationalQuestion,
        locale: "sk",
        inputType: "question",
        publicJurisdictionScope: "de_at_sk_cross_border",
      });
      assert.equal(scopedEducational.system.includes(PUBLIC_EDUCATIONAL_EXPLAINER_MARKER), true);
      assert.equal(scopedEducational.system.includes(PUBLIC_JURISDICTION_SCOPE_MARKER), true);
      assert.equal(scopedEducational.system.includes(LOCALE_NOT_JURISDICTION_MARKER), true);
      assert.equal(scopedEducational.system.includes(GERMANY_ONLY_INSTITUTION_MARKER), true);
      assert.equal(scopedEducational.system.includes("DE/AT–Slovakia cross-border"), true);
      assert.equal(scopedEducational.system.includes("Austrian family-benefits"), true);
      assert.equal(scopedEducational.system.includes(legacyEducationalSentence), false);
      assert.equal(scopedEducational.system.includes(legacyWarningsPattern), false);
      assert.equal(scopedEducational.system.includes(PUBLIC_QUESTION_WARNINGS_PATTERN_MARKER), true);
      assert.equal(scopedEducational.system.includes(legacyTimingGuidance), false);
      assert.equal(
        scopedEducational.system.includes(PUBLIC_EDUCATIONAL_JSON_MEANING_GUIDANCE_MARKER),
        true,
      );
      assertScopedPublicUrgency(scopedEducational.system);

      const austriaSlovakiaFamilyBenefitsQuestion =
        "Pracujem v Rakúsku a rodina býva na Slovensku. Ako mám postupovať pri žiadosti o rodinné dávky?";
      const scopedFamilyBenefits = buildSmartTalkMessages({
        text: austriaSlovakiaFamilyBenefitsQuestion,
        locale: "sk",
        inputType: "question",
        publicJurisdictionScope: "de_at_sk_cross_border",
      });
      assertScopedPublicUrgency(scopedFamilyBenefits.system);

      const compatibleEducational = buildSmartTalkMessages({
        text: austriaEducationalQuestion,
        locale: "sk",
        inputType: "question",
      });
      assert.equal(compatibleEducational.system.includes(legacyEducationalSentence), true);
      assert.equal(compatibleEducational.system.includes(PUBLIC_JURISDICTION_SCOPE_MARKER), false);
      assert.equal(compatibleEducational.system.includes(legacyEducationalJsonGuidance), true);

      process.env.SMART_TALK_FREE_QA_PUBLIC_ENABLED = "true";
      const austriaSlovakiaQuestion = austriaSlovakiaFamilyBenefitsQuestion;
      const questionNeedle = "rodinné dávky";
      fetchCalls = 0;
      lastProviderRequestBody = null;
      const response = await smartTalkPost(jsonRequest({
        mode: "free_qa_public_beta",
        context: "anonymous",
        inputType: "question",
        locale: "sk",
        text: austriaSlovakiaQuestion,
      }));
      const body = await responseBody(response);
      assert.equal(response.status, 200);
      assert.equal(fetchCalls, 1);
      assert.equal(body.ok, true);
      assert.equal(body.mode, "free_qa_public_beta");
      assert.equal(body.context, "anonymous");

      assert.notEqual(lastProviderRequestBody, null);
      const messages = lastProviderRequestBody!.messages ?? [];
      const systemMessage = messages.find((m: { role: string; content: string }) => m.role === "system")?.content ?? "";
      const userMessage = messages.find((m: { role: string; content: string }) => m.role === "user")?.content ?? "";
      assert.equal(userMessage.includes(austriaSlovakiaQuestion), true);
      assert.equal(systemMessage.includes(PUBLIC_JURISDICTION_SCOPE_MARKER), true);
      assert.equal(systemMessage.includes(LOCALE_NOT_JURISDICTION_MARKER), true);
      assert.equal(systemMessage.includes(GERMANY_ONLY_INSTITUTION_MARKER), true);
      assert.equal(systemMessage.includes(scopedSkRedirect), true);
      assert.equal(systemMessage.includes(legacyGermanyOnlyRedirect), false);
      assertScopedPublicUrgency(systemMessage);
      assert.equal(JSON.stringify(body).includes(questionNeedle), false);

      fetchCalls = 0;
      lastProviderRequestBody = null;
      const educationalResponse = await smartTalkPost(jsonRequest({
        mode: "free_qa_public_beta",
        context: "anonymous",
        inputType: "question",
        locale: "sk",
        text: austriaEducationalQuestion,
      }));
      const educationalBody = await responseBody(educationalResponse);
      assert.equal(educationalResponse.status, 200);
      assert.equal(fetchCalls, 1);
      assert.equal(educationalBody.ok, true);
      assert.equal(educationalBody.mode, "free_qa_public_beta");
      assert.equal(educationalBody.context, "anonymous");
      assert.notEqual(lastProviderRequestBody, null);
      const educationalSystem =
        (lastProviderRequestBody!.messages ?? []).find(
          (m: { role: string; content: string }) => m.role === "system",
        )?.content ?? "";
      assert.equal(educationalSystem.includes(PUBLIC_EDUCATIONAL_EXPLAINER_MARKER), true);
      assert.equal(educationalSystem.includes(legacyEducationalSentence), false);
      assert.equal(educationalSystem.includes(legacyWarningsPattern), false);
      assert.equal(educationalSystem.includes(legacyTimingGuidance), false);
      assertScopedPublicUrgency(educationalSystem);
      assert.equal(JSON.stringify(educationalBody).includes(austriaEducationalNeedle), false);
    });

    await t.test("separate photo API remains quarantined", async () => {
      fetchCalls = 0;
      const response = await photoPost(new Request("http://localhost/api/smart-talk-photo", {
        method: "POST",
      }));
      const body = await responseBody(response);
      assert.equal(response.status, 503);
      assert.equal(body.code, "photo_ocr_runtime_quarantined");
      assert.equal(fetchCalls, 0);
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});
