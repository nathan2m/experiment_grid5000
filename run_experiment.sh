#!/bin/bash
clear
echo "checking if node is installed..."
if which node > /dev/null
    then
        echo "node is installed..."
    else
        echo "installng nodejs..."
        sudo apt install nodejs -y
fi

echo "Leitura dos dados:"
echo ""
echo "GitHub:"
(time node code/github.js) |& tee results/github.txt
echo ""
echo "TopCoder:"
(time node code/topcoder.js) |& tee results/topcoder.txt
echo ""
echo "StackOverflow:"
(time node code/stackoverflow.js) |& tee results/stackoverflow.txt