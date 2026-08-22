import {
  configurationFromBirelloMaintenanceEnvironment,
  runBirelloProductionMaintenance,
  type BirelloMaintenanceMode,
} from "../lib/vaylo/smart-talk/knowledge/source-registry/birello-production-maintenance-executor";

function argumentsContract(argumentsList: readonly string[]): BirelloMaintenanceMode {
  if (
    argumentsList.length !== 2
    || argumentsList[0] !== "--operation=preflight-reader-privileges"
    || !["--mode=validate", "--mode=apply"].includes(argumentsList[1]!)
  ) {
    throw new Error(
      "Specify --operation=preflight-reader-privileges and --mode=validate or --mode=apply",
    );
  }
  return argumentsList[1]!.slice("--mode=".length) as BirelloMaintenanceMode;
}

async function main(): Promise<void> {
  const mode = argumentsContract(process.argv.slice(2));
  const report = await runBirelloProductionMaintenance(
    configurationFromBirelloMaintenanceEnvironment(),
    mode,
  );
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (report.result !== "PASS") process.exitCode = 1;
}

void main().catch(() => {
  process.stderr.write(
    '{"result":"REJECTED","failureCode":"EXECUTION_FAILED",'
    + '"failureStage":"configuration","sqlState":null,"connectionAttempted":false,'
    + '"transactionBegan":false,"transactionCommitted":false,'
    + '"transactionRolledBack":false,"mutationCount":0,"state":null,'
    + '"secretsPrinted":false}\n',
  );
  process.exitCode = 1;
});
