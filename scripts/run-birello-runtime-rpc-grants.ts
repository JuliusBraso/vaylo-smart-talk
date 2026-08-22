import {
  BIRELLO_KNOWLEDGE_FACTORY_RPC_GRANT_OPERATION,
  BIRELLO_RUNTIME_RPC_GRANT_OPERATION,
  configurationFromBirelloRuntimeRpcGrantEnvironment,
  runBirelloRuntimeRpcGrantOperation,
  type BirelloRuntimeRpcGrantMode,
  type BirelloRuntimeRpcGrantOperation,
} from "../lib/vaylo/smart-talk/knowledge/source-registry/birello-runtime-rpc-grant-executor";

type ArgumentsContract = Readonly<{
  mode: BirelloRuntimeRpcGrantMode;
  operation: BirelloRuntimeRpcGrantOperation;
}>;

function argumentsContract(argumentsList: readonly string[]): ArgumentsContract {
  const operation = argumentsList[0] === "--operation=locality-runtime-rpc-grants"
    ? BIRELLO_RUNTIME_RPC_GRANT_OPERATION
    : argumentsList[0] === "--operation=knowledge-factory-rpc-grants"
      ? BIRELLO_KNOWLEDGE_FACTORY_RPC_GRANT_OPERATION
      : null;
  if (
    argumentsList.length !== 2
    || operation === null
    || !["--mode=validate", "--mode=apply"].includes(argumentsList[1]!)
  ) {
    throw new Error(
      "Specify --operation=locality-runtime-rpc-grants or "
      + "--operation=knowledge-factory-rpc-grants and --mode=validate or --mode=apply",
    );
  }
  return Object.freeze({
    operation,
    mode: argumentsList[1]!.slice("--mode=".length) as BirelloRuntimeRpcGrantMode,
  });
}

async function main(): Promise<void> {
  const { mode, operation } = argumentsContract(process.argv.slice(2));
  const report = await runBirelloRuntimeRpcGrantOperation(
    configurationFromBirelloRuntimeRpcGrantEnvironment(process.env, operation),
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
