import {
  configurationFromAnmeldungContextProofEnvironment,
  runCityStateContextProductionProof,
  type CityStateContextProofCity,
} from "../lib/vaylo/smart-talk/knowledge/packs/de/anmeldung-ummeldung-abmeldung/production-city-state-context-proof";

const cityArgument = process.argv[2] ?? "";
const modeArgument = process.argv[3] ?? "";
const city = /^--city=(berlin|bremen|hamburg)$/u.test(cityArgument)
  ? cityArgument.slice("--city=".length) as CityStateContextProofCity : null;
const mode = modeArgument === "--mode=execute-read-only" ? "execute-read-only"
  : modeArgument === "--mode=validate" ? "validate" : null;
if (!city || !mode || process.argv.length !== 4) {
  throw new Error(
    "Specify exactly --city=berlin|bremen|hamburg "
    + "and --mode=validate|execute-read-only",
  );
}
void runCityStateContextProductionProof(
  configurationFromAnmeldungContextProofEnvironment(),
  city,
  mode,
).then((report) => {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (report.result !== "PASS") process.exitCode = 1;
});
