import {
  configurationFromBirelloMigrationEnvironment,
  runBirelloMigration,
  type BirelloMigration,
  type BirelloMigrationMode,
} from "../lib/vaylo/smart-talk/knowledge/source-registry/birello-production-migration-executor";

function argumentsContract(args: readonly string[]): Readonly<{ migration: BirelloMigration; mode: BirelloMigrationMode }> {
  if (args.length !== 2 || !/^--migration=04[23]$/.test(args[0]!)
    || !/^--mode=(validate|apply)$/.test(args[1]!)) {
    throw new Error("Specify only --migration=042 or --migration=043 and --mode=validate or --mode=apply");
  }
  return Object.freeze({
    migration: args[0]!.slice("--migration=".length) as BirelloMigration,
    mode: args[1]!.slice("--mode=".length) as BirelloMigrationMode,
  });
}
void (async () => {
  const { migration, mode } = argumentsContract(process.argv.slice(2));
  const report = await runBirelloMigration(configurationFromBirelloMigrationEnvironment(), migration, mode);
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (report.result !== "PASS") process.exitCode = 1;
})().catch(() => { process.stderr.write('{"result":"REJECTED","failureCode":"EXECUTION_FAILED","secretsPrinted":false}\n'); process.exitCode = 1; });
