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
    (params as any).anualContribution=Number(getArgs("--annual"));

}// New feature implemented without modifying the interfaces
//could not decide if chart should be with or without taxes so i did both
const showChart = args.includes("--chart")
const chartNet = args.includes("--net")

if (!args.includes("--compare") && !args.includes("--scenarios") && !args.includes("--montecarlo")) {
    const sim=simulateInvestment(params);
    console.log(`Simulare Investiție - ${params.years} ani`)
    console.log("Parametri:")
    console.log(` Suma inițială: ${params.initial.toLocaleString()} RON`)
    console.log(` Rată dobândă anuală: ${(params.annualRate*100).toFixed(1)}%`)
    console.log(` Contribuție lunară: ${params.monthlyContribution} RON`)
    if ((params as any).annualContribution) console.log(` Contribuție anuală: ${(params as any).annualContribution} RON`)
    console.log(` Perioadă: ${params.years} ani (${params.years*12} luni)`)

    console.log("Rezultate:")
    console.log(` Suma totală investită: ${sim.invested.toLocaleString()} RON`)
    console.log(` Valoare finală: ${sim.finalValue.toLocaleString()} RON`)
    console.log(` Profit total: ${sim.grossProfit.toLocaleString()} RON`)
    console.log(` ROI: ${(sim.roi*100).toFixed(1)}%`)
    console.log(` Dobândă câștigată: ${sim.netProfit.toLocaleString()} RON`)
    if(showChart) printTextChart(sim,chartNet);

    const exportFile=getArgs("--export");
    if(exportFile){
        exportCsv(exportFile,sim);
        console.log(` Export ${exportFile}`);

    }


}