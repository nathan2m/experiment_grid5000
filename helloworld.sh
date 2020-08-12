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
time node github.js
echo ""
echo "TopCoder:"
time node topcoder.js
echo ""
echo "StackOverflow:"
time node stackoverflow.js