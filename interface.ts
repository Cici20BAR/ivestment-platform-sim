export interface  InvestmentParams{
    initial: number;//`initial investment amount
    annualRate: number;//`expected annual rate of return (as a decimal, e.g., 0.07 for 7%)
    years: number;//`investment duration in years
    monthlyContribution: number; 
    inflation: number;
    taxRate?:number;//optional tax rate on profits (as a decimal, e.g., 0.15 for 15%)

}
export interface SimulationResult{
    history: number[]
    invested: number    // total amount invested over the period
    finalValue: number // final value of the investment
    grossProfit : number
    netProfit:number
    tax: number
    profitNet: number
    roi: number
    breakEvenMonth: number | null
    yearlySnapshots?: YearSnapshot[]

}
export interface YearSnapshot {// Represents a snapshot of the investment at the end of a year
    year: number
    value: number
    invested: number
    grossProfit: number
    tax: number
    netProfit: number
}
export interface MonteCarloResult {     // Represents the result of a Monte Carlo simulation
    min: number;
    max: number;
    avg: number;
    stdDev: number;
    percentiles: Record<number, number>;
    probabilityLoss: number;
    confidence95: [number, number];
    expectedAnnualReturn: number;

}