import {
  BIRELLO_FIT_VISIBILITY_OPERATION,
  BIRELLO_MAINTENANCE_OPERATION,
  configurationFromBirelloMaintenanceEnvironment,
  runBirelloFitVisibilityMaintenance,
  runBirelloProductionMaintenance,
  type BirelloMaintenanceMode,
  type BirelloMaintenanceOperation,
} from "../lib/vaylo/smart-talk/knowledge/source-registry/birello-production-maintenance-executor";

type ArgumentsContract = Readonly<{
  mode: BirelloMaintenanceMode;
  operation: BirelloMaintenanceOperation;
}>;

function argumentsContract(argumentsList: readonly string[]): ArgumentsContract {
  const operation = argumentsList[0] === "--operation=preflight-reader-privileges"
    ? BIRELLO_MAINTENANCE_OPERATION
    : argumentsList[0] === "--operation=preflight-reader-fit-visibility"
      ? BIRELLO_FIT_VISIBILITY_OPERATION
      : null;
  if (
    argumentsList.length !== 2
    || operation === null
    || !["--mode=validate", "--mode=apply"].includes(argumentsList[1]!)
  ) {
    throw new Error(
      "Specify --operation=preflight-reader-privileges or "
      + "--operation=preflight-reader-fit-visibility and --mode=validate or --mode=apply",
    );
  }
  return Object.freeze({
    operation,
    mode: argumentsList[1]!.slice("--mode=".length) as BirelloMaintenanceMode,
  });
}

async function main(): Promise<void> {
  const { mode, operation } = argumentsContract(process.argv.slice(2));
  const configuration = configurationFromBirelloMaintenanceEnvironment(
    process.env,
    operation,
  );
  const report = operation === BIRELLO_FIT_VISIBILITY_OPERATION
    ? await runBirelloFitVisibilityMaintenance(configuration, mode)
    : await runBirelloProductionMaintenance(configuration, mode);
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
