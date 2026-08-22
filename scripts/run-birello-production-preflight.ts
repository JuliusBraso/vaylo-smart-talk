import {
  configurationFromBirelloPreflightEnvironment,
  runBirelloProductionPreflight,
} from "../lib/vaylo/smart-talk/knowledge/source-registry/birello-production-preflight-executor";

function mode(argumentsList: readonly string[]): "validate" | "execute-read-only" {
  if (argumentsList.length !== 1 || !["--mode=validate", "--mode=execute-read-only"].includes(argumentsList[0]!)) {
    throw new Error("Specify --mode=validate or --mode=execute-read-only");
  }
  return argumentsList[0]!.slice("--mode=".length) as "validate" | "execute-read-only";
}

async function main(): Promise<void> {
  const selectedMode = mode(process.argv.slice(2));
  const configuration = configurationFromBirelloPreflightEnvironment();
  if (selectedMode === "validate") {
    const report = "result" in configuration
      ? configuration
      : {
          result: "PASS",
          configured: true,
          target: {
            host: configuration.host,
            port: configuration.port,
            database: configuration.database,
            role: configuration.user,
            verifiedTls: configuration.verifiedTls,
            caMechanism: configuration.caMechanism,
          },
          connectionAttempted: false,
          secretsPrinted: false,
        };
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    if (report.result !== "PASS") process.exitCode = 1;
    return;
  }
  const report = await runBirelloProductionPreflight(configuration);
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (report.result !== "PASS") process.exitCode = 1;
}

void main().catch(() => {
  process.stderr.write(
    '{"result":"REJECTED","failureCode":"EXECUTION_FAILED_UNKNOWN","failureStage":"cli",'
    + '"sqlState":null,"driverCode":null,"failedQueryId":null,"completedQueryIds":[],'
    + '"connectionAttempted":false,"secretsPrinted":false}\n',
  );
  process.exitCode = 1;
});
