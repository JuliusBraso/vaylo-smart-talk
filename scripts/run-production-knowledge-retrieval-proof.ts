import {
  productionRetrievalOptionsFromEnvironment,
  runProductionRetrievalProof,
  type ProductionRetrievalMode,
} from "../lib/vaylo/smart-talk/knowledge/packs/de/anmeldung-ummeldung-abmeldung/production-rpc-retrieval-proof";

function mode(argumentsList: readonly string[]): ProductionRetrievalMode {
  if (argumentsList.length !== 1 || !/^--mode=(validate|read-only)$/.test(argumentsList[0])) {
    throw new Error("Specify exactly one mode; no URLs, SQL, paths, or arbitrary proof input are accepted");
  }
  return argumentsList[0].slice("--mode=".length) as ProductionRetrievalMode;
}

void (async () => {
  const configured = productionRetrievalOptionsFromEnvironment();
  const report = await runProductionRetrievalProof({ ...configured, mode: mode(process.argv.slice(2)) });
  process.stdout.write(`${JSON.stringify(report)}\n`);
})().catch((error: unknown) => {
  process.stderr.write(`${JSON.stringify({
    result: "FAILED",
    message: error instanceof Error ? error.message.replace(/(?:postgres(?:ql)?:\/\/)[^\s]+/gi, "[redacted database URL]") : "Production retrieval proof failed",
  })}\n`);
  process.exitCode = 1;
});
