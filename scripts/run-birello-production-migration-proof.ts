import {
  configurationFromBirelloMigrationProofEnvironment,
  runBirelloMigrationReadOnlyProof,
  type BirelloMigrationProof,
  type BirelloMigrationProofMode,
} from "../lib/vaylo/smart-talk/knowledge/source-registry/birello-production-migration-proof";

function argumentsContract(argumentsList: readonly string[]): Readonly<{
  proof: BirelloMigrationProof;
  mode: BirelloMigrationProofMode;
}> {
  if (argumentsList.length !== 2
    || !/^--migration=04[23]$/u.test(argumentsList[0]!)
    || !/^--mode=(validate|execute-read-only)$/u.test(argumentsList[1]!)) {
    throw new Error(
      "Specify only --migration=042 or --migration=043 "
      + "and --mode=validate or --mode=execute-read-only",
    );
  }
  return Object.freeze({
    proof: argumentsList[0]!.slice("--migration=".length) as BirelloMigrationProof,
    mode: argumentsList[1]!.slice("--mode=".length) as BirelloMigrationProofMode,
  });
}

void (async () => {
  const { proof, mode } = argumentsContract(process.argv.slice(2));
  const report = await runBirelloMigrationReadOnlyProof(
    configurationFromBirelloMigrationProofEnvironment(),
    proof,
    mode,
  );
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (report.result !== "PASS") process.exitCode = 1;
})().catch(() => {
  process.stderr.write(
    '{"result":"REJECTED","failureCode":"EXECUTION_FAILED",'
    + '"productionWritesPerformed":false,"secretsPrinted":false}\n',
  );
  process.exitCode = 1;
});
