import {
  configurationFromAnmeldungContextProofEnvironment,
  runAnmeldungContextProductionProof,
  type AnmeldungContextProofMode,
} from "../lib/vaylo/smart-talk/knowledge/packs/de/anmeldung-ummeldung-abmeldung/production-anmeldung-context-proof";

function argumentsContract(argumentsList: readonly string[]): AnmeldungContextProofMode {
  if (
    argumentsList.length !== 2
    || argumentsList[0] !== "--operation=anmeldung-context-rpc-040"
    || !["--mode=validate", "--mode=execute-read-only"].includes(argumentsList[1]!)
  ) {
    throw new Error(
      "Specify --operation=anmeldung-context-rpc-040 and --mode=validate or execute-read-only",
    );
  }
  return argumentsList[1]!.slice("--mode=".length) as AnmeldungContextProofMode;
}

async function main(): Promise<void> {
  const mode = argumentsContract(process.argv.slice(2));
  const report = await runAnmeldungContextProductionProof(
    configurationFromAnmeldungContextProofEnvironment(),
    mode,
  );
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (report.result !== "PASS") process.exitCode = 1;
}

void main().catch(() => {
  process.stderr.write(
    '{"result":"REJECTED","failureCode":"EXECUTION_FAILED","stage":"configuration",'
    + '"sqlState":null,"connectionAttempted":false,"transactionBegan":false,'
    + '"transactionRolledBack":false,"rpcInvocationCount":0,"state":null,'
    + '"secretsPrinted":false}\n',
  );
  process.exitCode = 1;
});
