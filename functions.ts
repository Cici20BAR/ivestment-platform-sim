import { InvestmentParams, SimulationResult } from "./interface"

// =====================
// SIMULARE INVESTIȚIE
// =====================
export function simulateInvestment(p: InvestmentParams): SimulationResult {
    const months = p.years * 12
    const monthlyRate = p.annualRate / 12
    const monthlyInflation = p.inflation / 12

    let portfolioValue = p.initial           // total value of the investment
    let totalInvested = p.initial            // total invested (principal + contributions)
    let breakEvenMonth: number | null = null
    const history: number[] = []

    for (let m = 1; m <= months; m++) {
        portfolioValue *= 1 + monthlyRate       // apply monthly interest
        portfolioValue += p.monthlyContribution // add monthly contribution
        totalInvested += p.monthlyContribution

        portfolioValue /= 1 + monthlyInflation  // adjust for inflation

        if (breakEvenMonth === null && portfolioValue >= totalInvested) {
            breakEvenMonth = m
        }

        history.push(portfolioValue)
    }

    // Profit calculations
    const grossProfit = portfolioValue - totalInvested    // before taxes
    let tax = 0
    let netProfit = grossProfit
    if (p.taxRate && grossProfit > 0) {
        tax = grossProfit * p.taxRate
        netProfit = grossProfit - tax
        portfolioValue = totalInvested + netProfit       // final value after tax
    }

    return {
        history,
        invested: totalInvested,
        finalValue: portfolioValue,
        grossProfit,
        netProfit,
        tax,
        profitNet: netProfit,
        roi: netProfit / totalInvested,
        breakEvenMonth
    }
}

// =====================
// SCENARII ECONOMICE
// =====================
export function economicScenarios(s: InvestmentParams) {
    return {
        // pessimistic: lower rate a bit, copy s to avoid mutation
        pessimist: simulateInvestment({ ...s, annualRate: s.annualRate - 0.03 }),
        // realistic: base parameters
        realist: simulateInvestment(s),
        // optimistic: increase rate a bit
        optimist: simulateInvestment({ ...s, annualRate: s.annualRate + 0.03 })
    }
}

// =====================
// MONTE CARLO
// =====================
export function monteCarlo(
    runs: number,
    rateMin: number,
    rateMax: number,
    base: Omit<InvestmentParams, "annualRate"> // rate will be random
) {
    const results: number[] = []

    for (let i = 0; i < runs; i++) {
        const rate = rateMin + Math.random() * (rateMax - rateMin)
        const sim_res = simulateInvestment({ ...base, annualRate: rate })
        results.push(sim_res.finalValue)
    }

    return {
        min: Math.min(...results),
        max: Math.max(...results),
        avg: results.reduce((a, b) => a + b, 0) / runs
    }
}

export function compareRates(
    rates:number[],
    base: Omit<InvestmentParams, "annualRate">

){
    return rates.map(rate=>{
        const simulate=simulateInvestment({ ...base, annualRate: rate })
        return{
            rate,
            finalValue: simulate.finalValue,
            profit: simulate.netProfit,
            roi: simulate.roi
        }
    })
}