const fs = require('fs');
const dataGH = require("./GitHub_Users.json");
const dataSO = require("./StackOverflow_Users.json");
const dataTC = require("./TopCoder_Users.json");

//Number of times the data is replicated:
const m = 10;
const replicQtdGH = 10 * m;
const replicQtdSO = 100 * m;
const replicQtdTC = 60 * m;
//--------------------- 

console.log("Size GH:" + dataGH.length);
let dataBigGH = [];
for (let i = 0; i < replicQtdGH; i++) {
    for (let j = 0; j < dataGH.length; j++) {
        dataBigGH.push(dataGH[j]);
    }
}
console.log("Size GH BIG: " + dataBigGH.length);
fs.writeFileSync('data/BIG_GitHub_Users.json', JSON.stringify(dataBigGH));

//--------------------

console.log("Size SO:" + dataSO.length);
let dataBigSO = [];
for (let i = 0; i < replicQtdSO; i++) {
    for (let j = 0; j < dataSO.length; j++) {
        dataBigSO.push(dataSO[j]);
    }
}
console.log("Size SO BIG: " + dataBigSO.length);
fs.writeFileSync('data/BIG_StackOverflow_Users.json', JSON.stringify(dataBigSO));

//--------------------

console.log("Size TC:" + dataTC.length);
let dataBigTC = [];
for (let i = 0; i < replicQtdTC; i++) {
    for (let j = 0; j < dataTC.length; j++) {
        dataBigTC.push(dataTC[j]);
    }
}
console.log("Size TC BIG: " + dataBigTC.length);
fs.writeFileSync('data/BIG_TopCoder_Users.json', JSON.stringify(dataBigTC));
