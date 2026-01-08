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
