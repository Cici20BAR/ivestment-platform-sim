# Investment Platform Simulator

A comprehensive TypeScript-based investment simulator designed to calculate financial growth through various economic lenses. The application supports local execution and containerized environments via Docker.

## Table of Contents
- [Author](#author)
- [Motivation and Purpose](#motivation-and-purpose)
- [Technologies Used](#technologies-used)
- [Core Logic and Functions](#core-logic-and-functions)
- [Prerequisites](#prerequisites)
- [Execution via Docker](#execution-via-docker)
- [Available Arguments](#available-arguments)
- [Local Installation](#local-installation)
- [Rapid Evaluation (Docker Hub)](#rapid-evaluation-docker-hub)
- [Testing](#testing)
- [Samples](#samples)

## Author

- **Name:** Rares Robert C.
- **Group:** 1.2
- **Email:** rares.cinca@student.upt.ro
- **Academic Year:** 2025-2026

## Motivation and Purpose

In today's complex economic landscape, financial literacy is more than a skill—it is a necessity. This project was born out of the need for a transparent, robust, and accessible tool that goes beyond simple interest calculators.

The goal of this simulator is to empower users to visualize the long-term impact of their financial decisions by accounting for real-world variables such as annual inflation, tax deductions, and market volatility (via Monte Carlo simulations). By providing a clear, data-driven perspective, this tool aims to bridge the gap between abstract financial concepts and tangible future outcomes.

## Technologies Used

### Language
- **TypeScript 5.x** - chosen for static typing and enhanced code maintainability.

### Runtime
- **Node.js (v20+)** - used for executing the simulation logic.

### Testing Framework
- **Jest** - core framework for automated unit testing.
- **ts-jest** - transformer to allow Jest to process TypeScript files directly.

### Development Tools
- **ts-node** - allows running TypeScript files directly during development.
- **typescript** - the compiler used to transpile code into JavaScript.

### DevOps & Infrastructure
- **Git** - version control system.
- **GitHub Actions** - CI/CD pipeline for automated testing and deployment.
- **Docker** - containerization platform to ensure environment consistency.
- **Docker Hub** - registry for hosting the automated build images.

## Core Logic and Functions

* **Calculation Engine**: Computes annual growth based on principal and interest.
* **Economic Adjustments**: Functions to calculate net value after inflation and tax deductions.
* **Data Visualization**: ASCII-based charting for growth trends.
* **Risk Analysis**: Monte Carlo simulations for market volatility.
* **Export Module**: Data persistence in CSV or JSON formats.

## Prerequisites

* Node.js (v20+)
* npm
* Docker Desktop

## Execution via Docker

1. **Build**: `docker build -t investment-sim .`
2. **Run**: `docker run --rm raresrobertc/investment-sim:latest [arguments]`
3. **Run from Docker Hub**: Just run `docker run --rm raresrobertc/investment-sim:latest [arguments]` with Docker app on your PC and it will download from Docker Hub.

## Available Arguments

| Argument | Description | Required Input |
|:---------|:------------|:---------------|
| --initial | Starting investment amount | Number |
| --rate | Annual interest rate (decimal) | Number (0.07) |
| --years | Duration of investment | Number |
| --monthly | Monthly contribution | Number |
| --annual | Yearly contribution | Number |
| --inflation | Annual inflation rate | Number |
| --taxes | Tax rate on profit | Number |
| --net | Calculate real purchasing power | None |
| --chart | Display growth chart | None |
| --export | Save results to file | Filename |
| --compare | Enable comparison mode | None |
| --rates | Rates for comparison | List (0.05,0.08) |
| --scenarios | Run preset market scenarios | None |
| --montecarlo | Enable probabilistic risk | None |
| --runs | Number of Monte Carlo runs | Number |
| --rate_range | Min/Max volatility range | Pair (0.02,0.12) |
| --help | Display menu | None |

## Local Installation


npm install
npm run build
node dist/main.js [arguments]
# or
./run.bat ...

For grading purposes, the project image is publicly available on Docker Hub. The evaluator can download and run the simulator without any local configuration:


# Direct download and execution from Docker Hub:
docker run --rm raresrobertc/investment-sim:latest [arguments]


## Testing with cid/cd
npm test

## Samples


./run.bat --initial 10000 --rate 0.08 --years 10 --monthly 500 --inflation 0.03 --taxes 0.10 --chart


-------------------------------------------------------
Simulare Investitie - 10 ani
Parametri:
Suma initiala: 10,000 RON
Rata dobanda anuala: 8.0%
Contributie lunara: 500 RON
Perioada: 10 ani (120 luni)
Inflatie anuala: 3.0%
Taxe pe profit: 10.0%
Grafic: profit brut
Rezultate:
Suma totala investita: 70,000 RON
Profit brut (dupa dobanda si / sau inflatie): 13,079.117 RON
Taxe aplicate (10.0%): -1,307.912 RON
Valoare finala: 81,771.206 RON
Profit total: 13,079.117 RON
ROI: 16.8%
Dobanda castigata: 11,771.206 RON
Punct break-even: anul 1 (luna 1)
Evolutie pe ani:
An 1: 16603 RON (+542 dobanda)
An 2: 23526 RON (+1373 dobanda)
An 3: 30785 RON (+2507 dobanda)
An 4: 38397 RON (+3957 dobanda)
An 5: 46378 RON (+5740 dobanda)
An 6: 54747 RON (+7872 dobanda)
An 7: 63522 RON (+10369 dobanda)
An 8: 72722 RON (+13250 dobanda)
An 9: 82370 RON (+16533 dobanda)
An 10: 92486 RON (+20237 dobanda)
================================================================================
EVOLUTIE ANUALA - GRAFIC BARE
================================================================================
Legenda: | Valoare  + Profit  - Taxe  * Investit
--------------------------------------------------------------------------------
An 1: |||||||*******                               16603 RON (profit brut: 603 RON)
An 2: ||||||||||+**********                        23526 RON (profit brut: 1526 RON)
An 3: |||||||||||||+************                   30785 RON (profit brut: 2785 RON)
An 4: |||||||||||||||||++***************           38397 RON (profit brut: 4397 RON)
An 5: ||||||||||||||||||||+++*****************     46378 RON (profit brut: 6378 RON)
An 6: ||||||||||||||||||||||||++++************     54747 RON (profit brut: 8747 RON)
An 7: |||||||||||||||||||||||||||+++++********     63522 RON (profit brut: 11522 RON)
An 8: |||||||||||||||||||||||||||||||++++++-**     72722 RON (profit brut: 14722 RON)
An 9: ||||||||||||||||||||||||||||||||||||++++     82370 RON (profit brut: 18370 RON)
An 10: ||||||||||||||||||||||||||||||||||||||||     92486 RON (profit brut: 22486 RON)
--------------------------------------------------------------------------------
Total: Valoare 81771 RON | Investit 70000 RON | Profit 11771 RON | ROI 16.8%
================================================================================






./run.bat --initial 1000 --rate 0.07 --years 10 --monthly 100 --montecarlo --runs 1000 --rate_range "0.02-0.12"



Monte Carlo (1000 simulari, rate 0.02-0.12):

REZULTATE FINANCIARE:
Minim: 14,479.144 RON
Maxim: 25,269.904 RON
Medie: 19,172.069 RON
Deviatie standard: 3,171.501 RON

PROBABILITATI:
Probabilitate pierdere: 0.0%
Randament anual asteptat: 34.36%

PERCENTILE (Value at Risk):
5% (worst case): 14,900.759 RON
25%: 16,299.519 RON
50% (median): 18,642.101 RON
75%: 21,978.289 RON
95% (best case): 24,578.695 RON

INTERVAL DE INCREDERE 95%:
[18,975.498 RON, 19,368.641 RON]
Lungime interval: 393.143 RON

SCENARII:
Pesimist (5%): 14,900.759 RON
Realist (50%): 18,642.101 RON
Optimist (95%): 24,578.695 RON
