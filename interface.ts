export interface  InvestmentParams{
    initial: number;
    annualRate: number;
    years: number;
    monthlyContribution: number;
    inflation: number;
    taxRate?:number;

}
export interface SimulationResult{
    history: number[]
    invested: number
    finalValue: number
    grossProfit : number
    netProfit:number
    tax: number
    profitNet: number
    roi: number
    breakEvenMonth: number | null
    yearlySnapshots?: YearSnapshot[]

}
export interface YearSnapshot {
    year: number
    value: number
    invested: number
    grossProfit: number
    tax: number
    netProfit: number
}
export interface MonteCarloResult {
    min: number;
    max: number;
    avg: number;
    stdDev: number;
    percentiles: Record<number, number>;
    probabilityLoss: number;
    confidence95: [number, number];
    expectedAnnualReturn: number;

}