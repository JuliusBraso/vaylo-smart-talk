import {
  configurationFromWeiltingenIngestionEnvironment,
  runWeiltingenProductionIngestion,
  type WeiltingenIngestionMode,
} from "../lib/vaylo/smart-talk/knowledge/packs/de/anmeldung-ummeldung-abmeldung/production-weiltingen-ingestion";

function argumentsContract(argumentsList: readonly string[]): WeiltingenIngestionMode {
  if (
    argumentsList.length !== 2
    || argumentsList[0] !== "--operation=weiltingen-locality-pack"
    || !["--mode=validate", "--mode=dry-run", "--mode=apply"].includes(argumentsList[1]!)
  ) {
    throw new Error(
      "Specify --operation=weiltingen-locality-pack and --mode=validate, dry-run, or apply",
    );
  }
  return argumentsList[1]!.slice("--mode=".length) as WeiltingenIngestionMode;
}

async function main(): Promise<void> {
  const mode = argumentsContract(process.argv.slice(2));
  const report = await runWeiltingenProductionIngestion(
    configurationFromWeiltingenIngestionEnvironment(),
    mode,
  );
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (report.result !== "PASS") process.exitCode = 1;
}

void main().catch(() => {
  process.stderr.write(
    '{"result":"REJECTED","failureCode":"EXECUTION_FAILED",'
    + '"stage":"configuration","sqlState":null,"connectionAttempted":false,'
    + '"rpcInvoked":false,"transactionBegan":false,"transactionCommitted":false,'
    + '"transactionRolledBack":false,"mutationCount":0,"state":null,'
    + '"secretsPrinted":false}\n',
  );
  process.exitCode = 1;
});
