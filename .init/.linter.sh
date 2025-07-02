#!/bin/bash
cd /home/kavia/workspace/code-generation/tictactoe-duo-17817-77d48af5/tic_tac_toe_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

