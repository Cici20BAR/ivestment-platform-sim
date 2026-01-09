#!/usr/bin/env node
import { simulateInvestment, printTextChart, exportCsv, compareRates, economicScenarios, monteCarlo } from "./functions.js"
import type { InvestmentParams } from "./interface"

const args = process.argv.slice(2)
function getArgs(argname: string): string | undefined {
    const idx = args.indexOf(argname)
    if (idx != -1 && idx < args.length) {
        return args[idx + 1]
    } else {
        return undefined
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

if (getArgs("--annual")) {
    (params as any).annualContribution = Number(getArgs("--annual"))
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
    if (params.inflation > 0) {
        console.log(` Inflatie anuala: ${(params.inflation * 100).toFixed(1)}%`)
    }
    if (params.taxRate !== undefined) {
        console.log(` Taxe pe profit: ${(params.taxRate * 100).toFixed(1)}%`)
    }
    if ((params as any).annualContribution) {
        console.log(` Contributie anuala: ${(params as any).annualContribution} RON`)
    }
    if (showChart) {
        console.log(` Grafic: ${chartNet ? "profit net" : "profit brut"}`)
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

    const rates = rateStr.split(",").map(r => Number(r.trim()))
    const results = compareRates(rates, { ...params })

    console.log(`\nComparatie rate de dobanda (${params.years} ani, ${params.initial.toLocaleString()} RON initial):`)

    const maxFinal = Math.max(...results.map(r => r.finalValue))

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
    const res = monteCarlo(runs, min, max, { ...params })
    console.log(`\nMonte Carlo (${runs} simulari, rate ${min}-${max}):`)
    console.log(` Min: ${res.min.toLocaleString()} RON`)
    console.log(` Max: ${res.max.toLocaleString()} RON`)
    console.log(` Avg: ${res.avg.toLocaleString()} RON`)
}
