#!/bin/bash
# 1. Traduce main.ts -> dist/main.js
npx tsc

node dist/main.js "$@"