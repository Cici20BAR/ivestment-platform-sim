import { InvestmentParams, SimulationResult, YearSnapshot ,MonteCarloResult} from "./interface"
import fs from "fs"

export function simulateInvestment(p: InvestmentParams): SimulationResult {
    const {initial, annualRate, years, monthlyContribution = 0, inflation = 0, taxRate = 0} = p;
    const months = years * 12;

    // CORRECT: Monthly compound rate from annual rate
    const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;

    // 1. FUTURE VALUE OF INITIAL LUMP SUM
    // Using: FV = P * (1 + r)^n
    const fvInitial = initial * Math.pow(1 + monthlyRate, months);

    // 2. FUTURE VALUE OF MONTHLY CONTRIBUTIONS (ORDINARY ANNUITY)
    // Using: FV = C * [(1 + r)^n - 1] / r
    let fvMonthly = 0;
    if (monthlyRate > 0.000001) { // Avoid division by zero
        fvMonthly = monthlyContribution *
            ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    } else {
        // Edge case: zero or very small interest rate
        fvMonthly = monthlyContribution * months;
    }

    // 3. FUTURE VALUE OF ANNUAL CONTRIBUTIONS (if any)
    let fvAnnual = 0;
    if ((p as any).annualContribution) {
        const annualContribution = (p as any).annualContribution;
        // Future value of annual contributions (annuity with annual compounding)
        const annualRateEffective = annualRate; // Already annual
        fvAnnual = annualContribution *
            ((Math.pow(1 + annualRateEffective, years) - 1) / annualRateEffective);
    }

    // 4. TOTAL FUTURE VALUE (nominal, before inflation and taxes)
    let futureValue = fvInitial + fvMonthly + fvAnnual;

    // 5. ADJUST FOR INFLATION (real purchasing power)
    if (inflation > 0) {
        futureValue = futureValue / Math.pow(1 + inflation, years);
    }

    // 6. CALCULATE TOTAL INVESTED
    const totalInvested = initial +
        (monthlyContribution * months) +
        ((p as any).annualContribution ? (p as any).annualContribution * years : 0);

    // 7. CALCULATE PROFITS AND TAXES
    const grossProfit = futureValue - totalInvested;
    const tax = grossProfit > 0 ? grossProfit * taxRate : 0;
    const netProfit = grossProfit - tax;
    const finalValue = futureValue - tax;

    // 8. CALCULATE ROI
    const roi = totalInvested > 0 ? netProfit / totalInvested : 0;

    // 9. CALCULATE BREAK-EVEN MONTH (iterative approach)
    let breakEvenMonth: number | null = null;
    if (monthlyRate > 0.000001) {
        // Solve: initial*(1+r)^n + C*((1+r)^n-1)/r >= initial + C*n
        for (let n = 1; n <= months; n++) {
            const fvInitialN = initial * Math.pow(1 + monthlyRate, n);
            const fvMonthlyN = monthlyContribution *
                ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate);
            const totalValue = fvInitialN + fvMonthlyN;
            const totalInvestedN = initial + (monthlyContribution * n);

            if (totalValue >= totalInvestedN) {
                breakEvenMonth = n;
                break;
            }
        }
    } else if (initial > 0) {
        breakEvenMonth = 1;
    }

    // 10. GENERATE HISTORY (optional, for charting)
    const history: number[] = [];
    const yearlySnapshots: YearSnapshot[] = [];

    let runningValue = initial;
    for (let m = 1; m <= months; m++) {
        // Apply monthly growth
        runningValue *= (1 + monthlyRate);

        // Add monthly contribution
        runningValue += monthlyContribution;

        // Add annual contribution at end of year
        if ((p as any).annualContribution && m % 12 === 0) {
            runningValue += (p as any).annualContribution;
        }

        // Adjust for inflation (monthly)
        if (inflation > 0) {
            const monthlyInflationFactor = Math.pow(1 + inflation, 1 / 12);
            runningValue /= monthlyInflationFactor;
        }

        history.push(runningValue);

        // Yearly snapshot
        if (m % 12 === 0) {
            const year = m / 12;
            const yearInvested = initial +
                (monthlyContribution * m) +
                ((p as any).annualContribution ? (p as any).annualContribution * year : 0);
            const yearGrossProfit = runningValue - yearInvested;
            const yearTax = taxRate && yearGrossProfit > 0 ? yearGrossProfit * taxRate : 0;
            const yearNetProfit = yearGrossProfit - yearTax;

            yearlySnapshots.push({
                year,
                value: runningValue,
                invested: yearInvested,
                grossProfit: yearGrossProfit,
                tax: yearTax,
                netProfit: yearNetProfit
            });
        }
    }

    return {
        history,
        invested: totalInvested,
        finalValue,
        grossProfit,
        netProfit,
        tax,
        profitNet: netProfit,
        roi,
        breakEvenMonth,
        yearlySnapshots
    }


}


    export function economicScenarios(params: InvestmentParams) {
        const {annualRate} = params;

        return {
            pessimist: simulateInvestment({
                ...params,
                annualRate: Math.max(0.01, annualRate * 0.7), // -30%, min 1%
                inflation: (params.inflation || 0) + 0.02 // +2% inflation
            }),

            realist: simulateInvestment(params),

            optimist: simulateInvestment({
                ...params,
                annualRate: annualRate * 1.3, // +30%
                inflation: Math.max(0, (params.inflation || 0) - 0.01) // -1% inflation
            })
        };
    }

    export function monteCarlo(runs: number, rateMin: number, rateMax: number, base: Omit<InvestmentParams, "annualRate">): MonteCarloResult {
        const results: number[] = []

        for (let i = 0; i < runs; i++) {
            const rate = rateMin + Math.random() * (rateMax - rateMin)
            const sim_res = simulateInvestment({...base, annualRate: rate})
            results.push(sim_res.finalValue)
        }


        const min = Math.min(...results)
        const max = Math.max(...results)
        const avg = results.reduce((a, b) => a + b, 0) / runs
        results.sort((a, b) => a - b)
        //Standard Deviation ,formula:qrt( Σ(xᵢ - mean)² / n )
        const squaredDiffs = results.map(v => Math.pow(v - avg, 2))
        const variance = squaredDiffs.reduce((a, b) => a + b, 0) / results.length
        const stdDev = Math.sqrt(variance)
//Percentile (Value at Risk) formula
        const percentiles: Record<number, number> = {}
        const percentileLevels = [5, 25, 50, 75, 95]


        for (const p of percentileLevels) {
            const index = Math.floor((p / 100) * results.length)
            percentiles[p] = results[Math.min(index, results.length - 1)]
        }
        //Probability of loss

        const initialInvestment = base.initial
        const lossCount = results.filter(v => v < initialInvestment).length
        const probabilityLoss = lossCount / runs
        //Confidence Interval 95%

        const zScore95 = 1.96
        const marginOfError = zScore95 * (stdDev / Math.sqrt(results.length))
        const confidence95: [number, number] = [
            avg - marginOfError,
            avg + marginOfError
        ]
        //expectedAnnualReturn,(End/Start)^(1/years) - 1


        const years = base.years
        const expectedAnnualReturn = Math.pow(avg / initialInvestment, 1 / years) - 1

        return {
            min,
            max,
            avg,
            stdDev,
            percentiles,
            probabilityLoss,
            confidence95,
            expectedAnnualReturn,


        }
    }

    export function compareRates(rates: number[], base: Omit<InvestmentParams, "annualRate">) {
        return rates.map(rate => {
            const simulate = simulateInvestment({...base, annualRate: rate})

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
            if (!sim.yearlySnapshots || sim.yearlySnapshots.length === 0) {
                console.log("Nu exista date pentru grafic.");
                return;
            }

            const snapshots = sim.yearlySnapshots;
            const maxValue = Math.max(...snapshots.map(s => s.value));
            const barLength = 40;

            console.log("=".repeat(80));
            console.log("EVOLUTIE ANUALA - GRAFIC BARE");
            console.log("=".repeat(80));
            console.log("Legenda: | Valoare  + Profit  - Taxe  * Investit");
            console.log("-".repeat(80));

            snapshots.forEach(snapshot => {
                const profit = useNetProfit ? snapshot.netProfit : snapshot.grossProfit;

                //symbols/cat
                const valueSymbols = Math.round((snapshot.value / maxValue) * barLength);
                const profitSymbols = Math.round((Math.abs(profit) / maxValue) * barLength);
                const taxSymbols = Math.round((snapshot.tax / maxValue) * barLength);
                const investedSymbols = Math.round((snapshot.invested / maxValue) * barLength);

                let barLine = "";
                for (let i = 0; i < barLength; i++) {
                    if (i < valueSymbols) {
                        barLine += "|";
                    } else if (i < valueSymbols + profitSymbols && profit > 0) {
                        barLine += "+";
                    } else if (i < valueSymbols + profitSymbols + taxSymbols && snapshot.tax > 0) {
                        barLine += "-";
                    } else if (i < valueSymbols + profitSymbols + taxSymbols + investedSymbols) {
                        barLine += "*";
                    } else {
                        barLine += " ";
                    }
                }

                const profitType = useNetProfit ? "net" : "brut";
                console.log(`An ${snapshot.year}: ${barLine}  ${snapshot.value.toFixed(0).padStart(8)} RON (profit ${profitType}: ${profit.toFixed(0)} RON)`);
            });

            console.log("-".repeat(80));
            console.log(`Total: Valoare ${sim.finalValue.toFixed(0)} RON | Investit ${sim.invested.toFixed(0)} RON | Profit ${sim.netProfit.toFixed(0)} RON | ROI ${(sim.roi * 100).toFixed(1)}%`);
            console.log("=".repeat(80));

    }


