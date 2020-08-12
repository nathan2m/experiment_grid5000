#!/bin/bash
clear
echo "checking if node is installed..."
if which node > /dev/null
    then
        echo "node is installed..."
    else
        echo "installing nodejs..."
        curl -sL https://rpm.nodesource.com/setup_10.x | sudo bash -
        sudo yum install nodejs -y
        #sudo apt install nodejs -y
fi

echo "Replicar dados:"
node data/data_replicate.js
echo ""
echo "Leitura dos dados:"
echo ""
echo "GitHub:"
(time node code/github.js) |& tee results_github.txt
echo ""
echo "StackOverflow:"
(time node code/stackoverflow.js) |& tee results_stackoverflow.txt
echo ""
echo "TopCoder:"
(time node code/topcoder.js) |& tee results_topcoder.txt