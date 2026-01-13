import  { simulateInvestment, economicScenarios, monteCarlo } from "../functions.js";
import { InvestmentParams } from "../interface.js";

import { describe, test, expect } from "@jest/globals";
describe('Suita de Teste - Simulator Investitii', () => {

    test('Calcul corect valoare nominala fara inflatie/taxe (10% an)', () => {
        const params: InvestmentParams = {
            initial: 1000,
            annualRate: 0.10,
            years: 1,
            monthlyContribution: 0,
            inflation: 0,
            taxRate: 0
        };

        const result = simulateInvestment(params);

        // Formula: 1000 * (1.10) = 1100
        expect(result.finalValue).toBeCloseTo(1100, 0);
        expect(result.grossProfit).toBeCloseTo(100, 0);
        expect(result.invested).toBe(1000);
    });

    test('Calcul corect cu contributii lunare', () => {
        const params: InvestmentParams = {
            initial: 0,
            annualRate: 0.12, // 1% pe luna
            years: 1,
            monthlyContribution: 100,
            inflation: 0,
            taxRate: 0
        };

        const result = simulateInvestment(params);

        // inv total: 100 * 12 = 1200
        // final  val should be > 1200
        expect(result.invested).toBe(1200);
        expect(result.finalValue).toBeGreaterThan(1200);
    });

    // 3. Test pentru Inflatie (Putere de cumparare)
    test('Inflatia trebuie sa scada valoarea finala reala', () => {
        const baseParams: InvestmentParams = {
            initial: 1000,
            annualRate: 0.05,
            years: 10,
            monthlyContribution: 0,
            inflation: 0
        };

        const resNoInflation = simulateInvestment(baseParams);
        const resWithInflation = simulateInvestment({ ...baseParams, inflation: 0.03 });

        expect(resWithInflation.finalValue).toBeLessThan(resNoInflation.finalValue);
    });

    test('Taxele trebuie sa se aplice doar asupra profitului', () => {
        const params: InvestmentParams = {
            initial: 1000,
            annualRate: 0.10,
            years: 1,
            monthlyContribution: 0,
            inflation: 0,
            taxRate: 0.10 // 10% taxe pe profit
        };

        const result = simulateInvestment(params);

        // Profit brut = 100. Taxa 10% din 100 = 10.
        expect(result.tax).toBeCloseTo(10, 0);
        expect(result.finalValue).toBeCloseTo(1090, 0);
    });

    // 5. Test pentru Scenarii Economice
    test('Scenariul optimist trebuie sa fie mai mare decat cel pesimist', () => {
        const params: InvestmentParams = {
            initial: 5000,
            annualRate: 0.07,
            years: 5,
            monthlyContribution: 200,
            inflation: 0.02
        };

        const scenarios = economicScenarios(params);

        expect(scenarios.optimist.finalValue).toBeGreaterThan(scenarios.realist.finalValue);
        expect(scenarios.realist.finalValue).toBeGreaterThan(scenarios.pessimist.finalValue);
    });

    test('Simularea Monte Carlo returneaza valori intre limitele date', () => {
        const base = {
            initial: 1000,
            years: 2,
            monthlyContribution: 0,
            inflation: 0
        };

        const res = monteCarlo(50, 0.05, 0.15, base);

        expect(res.min).toBeLessThan(res.max);
        expect(res.avg).toBeGreaterThan(res.min);
        expect(res.avg).toBeLessThan(res.max);
        expect(res.percentiles[5]).toBeLessThanOrEqual(res.percentiles[95]);
    });

    test('Break-even month nu trebuie sa fie null daca rata e pozitiva', () => {
        const params: InvestmentParams = {
            initial: 1000,
            annualRate: 0.05,
            years: 5,
            monthlyContribution: 100,
            inflation: 0
        };

        const result = simulateInvestment(params);
        expect(result.breakEvenMonth).not.toBeNull();
        if (result.breakEvenMonth) {
            expect(result.breakEvenMonth).toBeGreaterThan(0);
        }
    });

});