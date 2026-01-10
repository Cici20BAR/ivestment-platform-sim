# Investment Platform Simulator

A comprehensive TypeScript-based investment simulator designed to calculate financial growth through various economic lenses. The application supports local execution and containerized environments via Docker.



##  Motivation and Purpose
In today's complex economic landscape, financial literacy is more than a skill—it is a necessity. This project was born out of the need for a transparent, robust, and accessible tool that goes beyond simple interest calculators.

The goal of this simulator is to empower users to visualize the long-term impact of their financial decisions by accounting for real-world variables such as annual inflation, tax deductions, and market volatility (via Monte Carlo simulations). By providing a clear, data-driven perspective, this tool aims to bridge the gap between abstract financial concepts and tangible future outcomes.

## Prerequisites
* Node.js (v20+)
* npm
* Docker Desktop
1. **Clone:**
   
 *  https://github.com/Cici20BAR/ivestment-platform-sim 
## Core Logic and Functions
* **Calculation Engine**: Computes annual growth based on principal and interest.
* **Economic Adjustments**: Functions to calculate net value after inflation and tax deductions.
* **Data Visualization**: ASCII-based charting for growth trends.
* **Risk Analysis**: Monte Carlo simulations for market volatility.
* **Export Module**: Data persistence in CSV or JSON formats.

## Execution via Docker
1. **Build**: `docker build -t investment-sim .`
2. **Run**: `docker run --rm investment-sim [arguments]`

## Available Arguments
| Argument     | Description                     | Required Input   |
|:-------------|:--------------------------------|:-----------------|
| --initial    | Starting investment amount      | Number           |
| --rate       | Annual interest rate (decimal)  | Number (0.07)    |
| --years      | Duration of investment          | Number           |
| --monthly    | Monthly contribution            | Number           |
| --annual     | Yearly contribution             | Number           |
| --inflation  | Annual inflation rate           | Number           |
| --taxes      | Tax rate on profit              | Number           |
| --net        | Calculate real purchasing power | None             |
| --chart      | Display growth chart            | None             |
| --export     | Save results to file            | Filename         |
| --compare    | Enable comparison mode          | None             |
| --rates      | Rates for comparison            | List (0.05,0.08) |
| --scenarios  | Run preset market scenarios     | None             |
| --montecarlo | Enable probabilistic risk       | None             |
| --runs       | Number of Monte Carlo runs      | Number           |
| --rate_range | Min/Max volatility range        | Pair (0.02,0.12) |
| --help       | Display menu                    | None             |

## Local Installation
```bash
npm install
npm run build
node dist/main.js [arguments]



## Rapid Evaluation (Docker Hub)
For grading purposes, the project image is publicly available on Docker Hub. The evaluator can download and run the simulator without any local configuration:
`
# Direct download and execution from Docker Hub:
docker run --rm raresrobertc/investment-sim:latest and then args 