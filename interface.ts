export interface  InvestmentParams{
    initial: number;
    anualRate: number;
    years: number;
    monthlyContribution: number;
    inflation: number;
    taxrate?:number;

}
export interface SimulationResult{
    history: number[]
    invested: number
    finalValue: number
    profit: number
    roi: number
    breakEvenMonth: number | null
}