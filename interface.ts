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
    profit: number
    roi: number
    breakEvenMonth: number | null
}