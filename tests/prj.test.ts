import { simulateInvestment } from "../functions";
import { InvestmentParams } from "../interface";

import { describe, test, expect } from "@jest/globals";
describe('Testare Logica Financiara', () => {
    test('Calcul corect valoare nominala (fara inflatie/taxe)', () => {
        const params: InvestmentParams = {
            initial: 1000,
            annualRate: 0.10, // 10%
            years: 1,
            monthlyContribution: 0,
            inflation: 0,
            taxRate: 0
        };

        const rezultat = simulateInvestment(params);

        // La 1000 RON cu 10% ar trebui sa avem 1100 RON
        expect(rezultat.finalValue).toBeCloseTo(1100, 0);
    });

    test('ROI ar trebui sa fie pozitiv la profit', () => {
        const params: InvestmentParams = {
            initial: 1000,
            annualRate: 0.05,
            years: 5,
            monthlyContribution: 100,
            inflation: 0
        };
        const rezultat = simulateInvestment(params);
        expect(rezultat.roi).toBeGreaterThan(0);
    });
});