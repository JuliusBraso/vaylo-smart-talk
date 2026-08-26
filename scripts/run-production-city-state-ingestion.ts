import {
  configurationFromCityStateIngestionEnvironment,
  runCityStateProductionIngestion,
  type CityState,
  type CityStateMode,
} from "../lib/vaylo/smart-talk/knowledge/packs/de/anmeldung-ummeldung-abmeldung/production-city-state-service-area-ingestion";

function args(values: readonly string[]): Readonly<{ city: CityState; mode: CityStateMode }> {
  if (values.length !== 2 || !/^--city=(berlin|bremen|hamburg)$/.test(values[0]!)
    || !/^--mode=(validate|dry-run|apply)$/.test(values[1]!)) {
    throw new Error("Specify only --city=berlin|bremen|hamburg and --mode=validate|dry-run|apply");
  }
  return Object.freeze({ city: values[0]!.slice(7) as CityState, mode: values[1]!.slice(7) as CityStateMode });
}
void (async () => {
  const { city, mode } = args(process.argv.slice(2));
  const output = await runCityStateProductionIngestion(configurationFromCityStateIngestionEnvironment(), city, mode);
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  if (output.result !== "PASS") process.exitCode = 1;
})().catch(() => { process.stderr.write('{"result":"REJECTED","failureCode":"EXECUTION_FAILED","secretsPrinted":false}\n'); process.exitCode = 1; });
