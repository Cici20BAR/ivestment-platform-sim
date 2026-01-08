#!/usr/bin/env node
import { simulateInvestment, printTextChart, exportCsv, compareRates, economicScenarios, monteCarlo } from "./functions"
import { InvestmentParams } from "./interface"


const args=process.argv.slice(2);
function  getArgs(argname:string):string|undefined{
    const idx=args.indexOf(argname);
    if (idx !=-1 &&idx <args.length){
        return args[idx+1];
    }else{
        return undefined;
    }


}


const  params:InvestmentParams={
    initial:Number(getArgs("--initial")||0),
    annualRate:Number(getArgs("--rate")||0),
    years:Number(getArgs("--years")||0),
    monthlyContribution:Number(getArgs("--monthly")||0),
    inflation:Number(getArgs("--inflation")||0),
    taxRate:getArgs("--taxes")?Number(getArgs("--taxes")):undefined//optional
}
if (getArgs("--annual")){
    (params as any).anualContribution = Number(getArgs("--annual"));

}// New feature implemented without modifying the interfaces
//could not decide if chart should be with or without taxes so i did both
const showChart = args.includes("--chart")
const chartNet = args.includes("--net")

if (!args.includes("--compare") && !args.includes("--scenarios") && !args.includes("--montecarlo")) {
    const sim = simulateInvestment(params);
    console.log(`Simulare Investiție - ${params.years} ani`)
    console.log("Parametri:")
    console.log(` Suma inițială: ${params.initial.toLocaleString()} RON`)
    console.log(` Rată dobândă anuală: ${(params.annualRate * 100).toFixed(1)}%`)
    console.log(` Contribuție lunară: ${params.monthlyContribution} RON`)
    if ((params as any).annualContribution) console.log(` Contribuție anuală: ${(params as any).annualContribution} RON`)
    console.log(` Perioadă: ${params.years} ani (${params.years * 12} luni)`)

    console.log("Rezultate:")
    console.log(` Suma totală investită: ${sim.invested.toLocaleString()} RON`)
    console.log(` Valoare finală: ${sim.finalValue.toLocaleString()} RON`)
    console.log(` Profit total: ${sim.grossProfit.toLocaleString()} RON`)
    console.log(` ROI: ${(sim.roi * 100).toFixed(1)}%`)
    console.log(` Dobândă câștigată: ${sim.netProfit.toLocaleString()} RON`)
    if (showChart) printTextChart(sim, chartNet);

    const exportFile = getArgs("--export");
    if (exportFile) {
        exportCsv(exportFile, sim);
        console.log(` Export ${exportFile}`);

    }

}
// comp rates
    if (args.includes("--compare")) {
        const rateStr = getArgs("--rates") || getArgs("--compare")
        if (!rateStr) {
            console.error("Trebuie să specifici rate separate prin virgula")
            process.exit(1)
        }

        const rates = rateStr.split(",").map(r => Number(r.trim()))
        const results = compareRates(rates, { ...params })

        console.log(`\nComparatie rate de dobanda (${params.years} ani, ${params.initial.toLocaleString()} RON initial):`)

        const maxFinal = Math.max(...results.map(r => r.finalValue))

        results.forEach(r => {
            const recommended = r.finalValue === maxFinal ? " ← recomandat" : ""
            console.log(
                `${(r.rate*100).toFixed(1)}%: ${r.finalValue.toLocaleString()} RON (profit: ${r.profit.toLocaleString()})${recommended}`
            )

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

//  Monte Carlo
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

