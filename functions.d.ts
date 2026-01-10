import { InvestmentParams, SimulationResult } from "./interface";
export declare function simulateInvestment(p: InvestmentParams): SimulationResult;
export declare function economicScenarios(s: InvestmentParams): {
    pessimist: SimulationResult;
    realist: SimulationResult;
    optimist: SimulationResult;
};
export declare function monteCarlo(runs: number, rateMin: number, rateMax: number, base: Omit<InvestmentParams, "annualRate">): {
    min: number;
    max: number;
    avg: number;
};
export declare function compareRates(rates: number[], base: Omit<InvestmentParams, "annualRate">): {
    rate: number;
    grossProfit: any;
    tax: any;
    finalValue: any;
    profit: any;
    roi: any;
}[];
export declare function exportCsv(file: string, sim: SimulationResult): void;
export declare function printTextChart(sim: SimulationResult, useNetProfit?: boolean): void;
//# sourceMappingURL=functions.d.ts.map