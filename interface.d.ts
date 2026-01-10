export interface InvestmentParams {
    initial: number;
    annualRate: number;
    years: number;
    monthlyContribution: number;
    inflation: number;
    taxRate?: number;
}
export interface SimulationResult {
    history: number[];
    invested: number;
    finalValue: number;
    grossProfit: number;
    netProfit: number;
    tax: number;
    profitNet: number;
    roi: number;
    breakEvenMonth: number | null;
}
//# sourceMappingURL=interface.d.ts.map