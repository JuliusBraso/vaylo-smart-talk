import {
  configurationFromBirelloRuntimeRpcGrantEnvironment,
  runBirelloRuntimeRpcGrantOperation,
  type BirelloRuntimeRpcGrantMode,
} from "../lib/vaylo/smart-talk/knowledge/source-registry/birello-runtime-rpc-grant-executor";

function argumentsContract(argumentsList: readonly string[]): BirelloRuntimeRpcGrantMode {
  if (
    argumentsList.length !== 2
    || argumentsList[0] !== "--operation=locality-runtime-rpc-grants"
    || !["--mode=validate", "--mode=apply"].includes(argumentsList[1]!)
  ) {
    throw new Error(
      "Specify --operation=locality-runtime-rpc-grants and --mode=validate or --mode=apply",
    );
  }
  return argumentsList[1]!.slice("--mode=".length) as BirelloRuntimeRpcGrantMode;
}

async function main(): Promise<void> {
  const mode = argumentsContract(process.argv.slice(2));
  const report = await runBirelloRuntimeRpcGrantOperation(
    configurationFromBirelloRuntimeRpcGrantEnvironment(),
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
