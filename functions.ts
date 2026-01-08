import { InvestmentParams, SimulationResult, YearSnapshot } from "./interface"
import fs from "fs"

export function simulateInvestment(p: InvestmentParams): SimulationResult {
    const months = p.years * 12
    const monthlyRate = p.annualRate / 12
    const monthlyInflation = p.inflation / 12

    let portfolioValue = p.initial
    let totalInvested = p.initial
    let breakEvenMonth: number | null = null

    const history: number[] = []
    const yearlySnapshots: YearSnapshot[] = []

    for (let m = 1; m <= months; m++) {
        portfolioValue *= 1 + monthlyRate
        portfolioValue += p.monthlyContribution
        totalInvested += p.monthlyContribution

        if ((p as any).annualContribution && m % 12 === 0) {
            portfolioValue += (p as any).annualContribution
            totalInvested += (p as any).annualContribution
        }

        portfolioValue /= 1 + monthlyInflation

        if (breakEvenMonth === null && portfolioValue >= totalInvested) {
            breakEvenMonth = m
        }

        history.push(portfolioValue)

        if (m % 12 === 0) {
            const year = m / 12
            const grossProfit = portfolioValue - totalInvested
            const tax = p.taxRate && grossProfit > 0 ? grossProfit * p.taxRate : 0
            const netProfit = grossProfit - tax

            yearlySnapshots.push({
                year,
                value: portfolioValue,
                invested: totalInvested,
                grossProfit,
                tax,
                netProfit
            })
        }
    }

    const grossProfit = portfolioValue - totalInvested
    let tax = 0
    let netProfit = grossProfit
    if (p.taxRate && grossProfit > 0) {
        tax = grossProfit * p.taxRate
        netProfit = grossProfit - tax
        portfolioValue = totalInvested + netProfit
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
        breakEvenMonth,
        yearlySnapshots
    }
}

export function economicScenarios(s: InvestmentParams) {
    return {
        pessimist: simulateInvestment({ ...s, annualRate: s.annualRate - 0.03 }),
        realist: simulateInvestment(s),
        optimist: simulateInvestment({ ...s, annualRate: s.annualRate + 0.03 })
    }
}

export function monteCarlo(runs: number, rateMin: number, rateMax: number, base: Omit<InvestmentParams, "annualRate">) {
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

export function compareRates(rates: number[], base: Omit<InvestmentParams, "annualRate">) {
    return rates.map(rate => {
        const simulate = simulateInvestment({ ...base, annualRate: rate })

        return {
            rate,
            finalValue: simulate.finalValue,
            grossProfit: simulate.grossProfit,
            tax: simulate.tax,
            netProfit: simulate.netProfit,
            roi: simulate.roi
        }
    })
}

export function exportCsv(file: string, sim: SimulationResult) {
    const rows: string[] = []
    rows.push("An,Valoare,Investitie,ProfitBrut,Taxe,ProfitNet")

    sim.yearlySnapshots?.forEach(snapshot => {
        rows.push(
            `${snapshot.year},${snapshot.value.toFixed(2)},${snapshot.invested.toFixed(2)},${snapshot.grossProfit.toFixed(2)},${snapshot.tax.toFixed(2)},${snapshot.netProfit.toFixed(2)}`
        )
    })

    fs.writeFileSync(file, rows.join("\n"))
}

export function printTextChart(sim: SimulationResult, useNetProfit: boolean = false) {
    console.log("Evolutie pe ani:")
    sim.yearlySnapshots?.forEach(snapshot => {
        const profit = useNetProfit ? snapshot.netProfit : snapshot.grossProfit
        console.log(`An ${snapshot.year}: ${snapshot.value.toFixed(0)} RON (+${profit.toFixed(0)} dobanda)`)
    })
}
