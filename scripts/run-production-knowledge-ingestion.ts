import {
  productionRpcOptionsFromEnvironment,
  runProductionRpcIngestion,
  type ProductionRpcMode,
} from "../lib/vaylo/smart-talk/knowledge/packs/de/anmeldung-ummeldung-abmeldung/production-rpc-ingestion";

function parseMode(argumentsList: readonly string[]): ProductionRpcMode {
  if (argumentsList.length !== 1 || !/^--mode=(validate|dry-run|apply)$/.test(argumentsList[0])) {
    throw new Error("Specify exactly one mode; no pack paths, URLs, SQL, or other input are accepted");
  }
  return argumentsList[0].slice("--mode=".length) as ProductionRpcMode;
}

void (async () => {
  const configured = productionRpcOptionsFromEnvironment();
  const report = await runProductionRpcIngestion({
    ...configured,
    mode: parseMode(process.argv.slice(2)),
  });
  process.stdout.write(`${JSON.stringify(report)}\n`);
})().catch((error: unknown) => {
  process.stderr.write(`${JSON.stringify({
    result: "FAILED",
    message: error instanceof Error ? error.message : "Curated ingestion failed",
  })}\n`);
  process.exitCode = 1;
});
