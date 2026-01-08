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
