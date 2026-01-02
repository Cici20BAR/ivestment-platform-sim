import { InvestmentParams, SimulationResult } from "./interface"

export function simulateInvestment(p: InvestmentParams): SimulationResult {
    // Total number of months for the simulation
    const months = p.years * 12

    const monthlyRate = p.annualRate / 12
    const monthlyInflation = p.inflation / 12

    // Current portfolio value
    let value = p.initial

    // Total amount of money invested for that value
    let invested = p.initial

    // Month when the investment value becomes greater than invested amount
    let breakEven: number | null = null

    // Stores the investment value for each month
    const history: number[] = []

    // Monthly simulation loop
    for (let m = 1; m <= months; m++) {
        value *= 1 + monthlyRate

        value += p.monthlyContribution
        invested += p.monthlyContribution

        value /= 1 + monthlyInflation

        // Check break-even point (first time value >= invested)
        if (breakEven === null && value >= invested) {
            breakEven = m
        }

        history.push(value)
    }

    let profit = value - invested

    // Apply tax on profit if tax rate is provided
    if (p.taxRate && profit > 0) {
        profit *= 1 - p.taxRate
        value = invested + profit
    }

    return {
        history,
        invested,
        finalValue: value,
        profit,
        roi: profit / invested,
        breakEvenMonth: breakEven
    }
}
//for montecarlo
export function economicScenarios(s: InvestmentParams) {
    return {
        // pessimistic: lower rate a bit, use ... to copy s so we don't change the original
        pessimist: simulateInvestment({ ...s, annualRate: s.annualRate - 0.03 }),

        // realistic: just use the base values
        realist: simulateInvestment(s),

        // optimistic: bump the rate up a bit, copy s again for safety
        optimist: simulateInvestment({ ...s, annualRate: s.annualRate + 0.03 })
    }
}
export function monteCarlo(
    runs:number,
    rateMin: number,
    rateMax: number,
    mont:Omit<InvestmentParams, "annualRate">//we omit annual rate because we calculate it with a random func
){
    const results:number[] = [];
    for(let i=0; i<runs; i++) {
        const rate=rateMin+Math.random()*(rateMax - rateMin);
        const sim_res=simulateInvestment({...mont,annualRate:rate});

        results.push(sim_res.finalValue);

    }
    return {
        min:Math.min(...results),
        max:Math.max(...results),
        avg:results.reduce((a,b)=>a+b,0)/runs
    }

}
