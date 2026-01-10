#!/usr/bin/env node
import { simulateInvestment, printTextChart, exportCsv, compareRates, economicScenarios, monteCarlo } from "./functions.js"
import type { InvestmentParams } from "./interface"


//test docker
import fs from 'fs';

const isDocker = fs.existsSync('/.dockerenv');

if (isDocker) {
    console.log(" Rulez in interiorul unui container Docker!");
} else {
    console.log(" Rulez local pe calculator.");
}
//end
const args = process.argv.slice(2)
//meniu
function help(flag: boolean = false) {
    console.log("-------------------------------------------------------");
    console.log("   SIMULATOR INVESTITII          ");
    console.log("-------------------------------------------------------");

    if (flag) return;

    // Daca a cerut help sau nu a pus argumente, afisam tot meniul
    console.log("UTILIZARE:");
    console.log("  node dist/main.js [optiuni]");
    console.log("");
    console.log("PARAMETRI FINANCIARI:");
    console.log("  --initial [nr]    Suma de start (ex: 1000)");
    console.log("  --rate [nr]       Rata profitului (ex: 0.07 pentru 7%)");
    console.log("  --years [nr]      Durata investitiei in ani");
    console.log("  --monthly [nr]    Depunere in fiecare luna");
    console.log("  --annual [nr]     Depunere o data pe an (bonus)");
    console.log("");
    console.log("ANALIZA SI FILTRE:");
    console.log("  --inflation [nr]  Scade puterea de cumparare (ex: 0.03)");
    console.log("  --taxes [nr]      Impozit pe profit (ex: 0.10)");
    console.log("  --net             Calculeaza totul dupa taxe si inflatie");
    console.log("");
    console.log("MODURI SPECIALE:");
    console.log("  --chart           Afiseaza graficul evolutiei in terminal");
    console.log("  --compare         Compara mai multe rate de profit");
    console.log("  --montecarlo      Ruleaza simulari de risc aleatorii");
    console.log("");
    console.log("EXPORT:");
    console.log("  --export [nume.csv] Salveaza datele pentru Excel");
    console.log("-------------------------------------------------------");
}


if (args.length > 0 && !args.includes("--help")) {
    help(true);
} else {
    help(false);
    if (args.length === 0 || args.includes("--help")) {
        process.exit(0);
    }
}///
const allowedFlags = [
    "--initial", "--rate", "--years", "--monthly", "--annual",
    "--inflation", "--taxes", "--chart", "--net", "--export",
    "--compare", "--rates", "--scenarios", "--montecarlo",
    "--runs", "--rate_range","--help"
];

args.forEach(arg => {
    if (arg.startsWith("--") && !allowedFlags.includes(arg)) {
        console.error(`Eroare: Comanda "${arg}" nu este recunoscuta.`);
        console.log(`Comenzi permise: ${allowedFlags.join(", ")}`);
        help(false)
        process.exit(1);
    }
});
help(true);
function getArgs(argname: string): string | undefined {
    const idx = args.indexOf(argname)
    if (idx != -1 && idx < args.length) {
        return args[idx + 1]
    } else {
        return undefined
    }
}
function assertNumber(name: string, value: number, allowZero = true) {
    if (Number.isNaN(value)) {
        console.error(`Eroare: ${name} trebuie sa fie un numar valid.`);
        process.exit(1);
    }
    if (!allowZero && value === 0) {
        console.error(`Eroare: ${name} trebuie sa fie mai mare decat 0.`);
        process.exit(1);
    }
    if (value < 0) {
        console.error(`Eroare: ${name} trebuie sa fie >= 0.`);
        process.exit(1);
    }
}
const params: InvestmentParams = {
    initial: Number(getArgs("--initial") || 0),
    annualRate: Number(getArgs("--rate") || 0),
    years: Number(getArgs("--years") || 0),
    monthlyContribution: Number(getArgs("--monthly") || 0),
    inflation: Number(getArgs("--inflation") || 0),
    taxRate: getArgs("--taxes") ? Number(getArgs("--taxes")) : undefined
}
assertNumber("Suma initiala (--initial)", params.initial);
assertNumber("Rata anuala (--rate)", params.annualRate);
assertNumber("Anii (--years)", params.years, false);
assertNumber("Contributia lunara (--monthly)", params.monthlyContribution);
assertNumber("Inflatia (--inflation)", params.inflation);
if (getArgs("--annual")) {
    const annualContrib = Number(getArgs("--annual"));
    assertNumber("Contributia anuala (--annual)", annualContrib);
    (params as any).annualContribution = annualContrib;
}

const showChart = args.includes("--chart")
const chartNet = args.includes("--net")


if (!args.includes("--compare") && !args.includes("--scenarios") && !args.includes("--montecarlo")) {
    const sim = simulateInvestment(params)
    console.log(`Simulare Investitie - ${params.years} ani`)
    console.log("Parametri:")
    console.log(` Suma initiala: ${params.initial.toLocaleString()} RON`)
    console.log(` Rata dobanda anuala: ${(params.annualRate * 100).toFixed(1)}%`)
    console.log(` Contributie lunara: ${params.monthlyContribution} RON`)
    if ((params as any).annualContribution) console.log(` Contributie anuala: ${(params as any).annualContribution} RON`)
    console.log(` Perioada: ${params.years} ani (${params.years * 12} luni)`)
    if (params.inflation > 0)
    {
        console.log( `Inflatie anuala: ${(params.inflation * 100).toFixed(1)}%`)

    }
    if (params.taxRate !== undefined) {
        console.log(` Taxe pe profit: ${(params.taxRate * 100).toFixed(1)}%`)
    }
    if ((params as any).annualContribution)
    {
        console.log( `Contributie anuala: ${(params as any).annualContribution} RON`)
    }
    if (showChart)
    {
        console.log( `Grafic: ${chartNet ? "profit net" : "profit brut"}`)
    }

    console.log("Rezultate:")
    console.log(` Suma totala investita: ${sim.invested.toLocaleString()} RON`)

    if (params.inflation > 0 || params.taxRate !== undefined) {
        console.log(` Profit brut (dupa dobanda si / sau inflatie): ${sim.grossProfit.toLocaleString()} RON`)
    }
    if (params.taxRate !== undefined && sim.tax > 0) {
        console.log(` Taxe aplicate (${(params.taxRate * 100).toFixed(1)}%): -${sim.tax.toLocaleString()} RON`)
    }
    console.log(` Valoare finala: ${sim.finalValue.toLocaleString()} RON`)
    console.log(` Profit total: ${sim.grossProfit.toLocaleString()} RON`)
    console.log(` ROI: ${(sim.roi * 100).toFixed(1)}%`)
    console.log(` Dobanda castigata: ${sim.netProfit.toLocaleString()} RON`)
    if (sim.breakEvenMonth !== null) {
        const breakEvenYear = Math.ceil(sim.breakEvenMonth / 12)
        console.log(` Punct break-even: anul ${breakEvenYear} (luna ${sim.breakEvenMonth})`)
    }
    if (showChart) printTextChart(sim, chartNet)

    const exportFile = getArgs("--export")
    if (exportFile) {
        exportCsv(exportFile, sim)
        console.log(` Export ${exportFile}`)
    }
}

if (args.includes("--compare")) {
    const rateStr = getArgs("--rates") || getArgs("--compare")
    if (!rateStr) {
        console.error("Trebuie sa specifici rate separate prin virgula")
        process.exit(1)
    }

    const rates = rateStr.split(",").map(r => {
        const val = Number(r.trim());
        assertNumber("Rata de comparatie", val);
        return val;
    })
    const results = compareRates(rates, { ...params })
    console.log(`\nComparatie rate de dobanda:`)
    const maxFinal = Math.max(...results.map(r => r.finalValue))

    console.log(`\nComparatie rate de dobanda (${params.years} ani, ${params.initial.toLocaleString()} RON initial):`)


    results.forEach(r => {
        const recommended = r.finalValue === maxFinal ? " <- recomandat" : ""
        console.log(`${(r.rate * 100).toFixed(1)}%: ${r.finalValue.toLocaleString()} RON (profit: ${r.netProfit.toLocaleString()})${recommended}`)
        if (showChart) {
            printTextChart(simulateInvestment({ ...params, annualRate: r.rate }), chartNet)
        }
    })
}

if (args.includes("--scenarios")) {
    const sims = economicScenarios(params)
    console.log("\nScenarii economice:")
    for (const [key, sim] of Object.entries(sims)) {
        console.log(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${sim.finalValue.toLocaleString()} RON`)
        if (showChart) printTextChart(sim, chartNet)
    }
}

if (args.includes("--montecarlo")) {
    const runs = Number(getArgs("--runs") || 1000)
    const range = getArgs("--rate_range")
    if (!range) {
        console.error("Trebuie sa specifici --rate_range MIN-MAX")
        process.exit(1)
    }
    const [min, max] = range.split("-").map(r => Number(r.trim()))
    assertNumber("Numarul de rulari (--runs)", runs, false);
    assertNumber("Rata minima range", min);
    assertNumber("Rata maxima range", max);
    const res = monteCarlo(runs, min, max, { ...params })
    console.log(`\nMonte Carlo (${runs} simulari, rate ${min}-${max}):`)
    console.log(` Min: ${res.min.toLocaleString()} RON`)
    console.log(` Max: ${res.max.toLocaleString()} RON`)
    console.log(` Avg: ${res.avg.toLocaleString()} RON`)
}
