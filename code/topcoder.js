const formato = (d) => { // d = new Date(/*some date value*/);
    const f = (x) => (x < 10 ? "0" + x : x);
    const formatoData = () => { const n = d.getDate(), m = d.getMonth() + 1, y = d.getFullYear(); return f(n) + "/" + f(m) + "/" + f(y) };
    const formatoHora = () => { const h = d.getHours(), m = d.getMinutes(), s = d.getSeconds(); return f(h) + ":" + f(m) + ":" + f(s) };
    return { formatoData, formatoHora };
}

const topcoderURL = "https://www.topcoder.com";
let itens = [];

function fetchData(user) {
    let v2 = user.v2;
    let v3 = user.v3;
    if (v2 !== undefined && v3 !== undefined) {
        v2.photoLink = v2.photoLink.includes("https://") ? v2.photoLink : v2.photoLink ? topcoderURL + v2.photoLink : v2.photoLink;
        v2.ratingSummary.forEach(e => e.colorStyle = e.colorStyle.replace("color: ", ""));
        //console.log(v2);
        //console.log(v3);
        const u = { ...v2, ...v3, _chgs: user._chgs }
        const date = formato(new Date(v3.createdAt));
        u.dateCreatedAt = date.formatoData() + " " + date.formatoHora();
        u.linkUrl = topcoderURL + "/members/" + user.handle/* value */;
        //console.log(u);
        itens.push(u);
        getChallenges(u);
        if (u.tks !== undefined) {
            getChartGeral(u);
            for (let i = 0; i < u.tks.length; i++) {
                const tk = u.tks[i];
                getChartTrack(tk);
            }
        }
    }
}

function getChallenges(u) {
    //u.loading = true;
    u.tks = [];
    //$http.get(topcoderAPI + "/v4/members/" + u.handle + "/challenges").then(function (res) {
    const rs = u._chgs[0]/* res.data */;
    //console.log(rs);
    const { metadata, content } = rs.result;
    const { totalCount } = metadata;
    u.totalChs = totalCount;
    for (let i = 0; i < content.length; i++) {
        const { id, track, subTrack, status, name, registrationStartDate, registrationEndDate, submissionEndDate, technologies, platforms, userDetails } = content[i];
        let t = subTrack === null ? "OTHERS" : subTrack;
        let o = u.tks.length > 0 ? u.tks.findIndex(tk => tk.t === t) : -1;
        let challenge = {
            id,
            track,
            subTrack,
            status,
            html_url: topcoderURL + "/challenges/" + id,
            name,
            registrationStartDate,
            registrationEndDate,
            submissionEndDate,
            technologies,
            platforms,
            userDetails
        }
        //console.log(challenge);
        if (o !== -1) {
            u.tks[o].count++;
            u.tks[o].challenges.push(challenge);
        } else {
            u.tks.push({
                t,
                track,
                count: 1,
                challenges: [challenge]
            })
        }
        o = o === -1 ? 0 : o;
        u.tks[o].challenges.sort((a, b) => ((a.registrationStartDate < b.registrationStartDate) ? -1 : ((a.registrationStartDate > b.registrationStartDate) ? 1 : 0)));
    }
    u.tks.sort((a, b) => b.count - a.count);
    //tc.tabela = true;
    /* }, function (err) {
        console.log(err.data);
    }).finally(function () {
        u.loading = false;
    }); */
    //console.log(u.tks);
}

const format = (d, i) => {
    let { name, html_url, track, subTrack, status, technologies, platforms, userDetails } = d[i];
    name = (name.length > 20 ? name.substring(0, 20) + "..." : name);
    const n = { name, html_url, track, subTrack, status, technologies, platforms, userDetails };
    return n;
}
function getChartTrack(tk) {
    //console.log(tk);
    const refacData = (d) => {
        let arr = [];
        if (d !== undefined) {
            for (let i = 0; i < d.length; i++) {
                const { id, registrationStartDate, registrationEndDate, submissionEndDate } = d[i];
                let n = format(d, i);
                arr.push({ id, name: n.name, dateTime: [] });
                arr[i].dateTime.push({ id, datea: new Date(registrationStartDate), typeDate: "Registration Start", ...n });
                arr[i].dateTime.push({ id, datea: new Date(registrationEndDate), typeDate: "Registration End", ...n });
                arr[i].dateTime.push({ id, datea: new Date(submissionEndDate), typeDate: "Submission End", ...n });
            }
        }
        return arr;
    }
    const data = refacData(tk.challenges);
    //console.log(data);
    /* modale("scatterSubTrack");
    scatterChart("#scatterSubTrack", data, tk.t, "Challenge", mouseover); */
}
function getChartGeral(u) {
    //console.log(u);
    const refacData = (d) => {
        let arr = [];
        if (d !== undefined) {
            for (let i = 0; i < d.length; i++) {
                const { t: name, challenges: c } = d[i];
                arr.push({ id: name, name, dateTime: [] })
                for (let j = 0; j < c.length; j++) {
                    const { registrationStartDate } = c[j];
                    const n = format(c, j);
                    arr[i].dateTime.push({ id: name, ...n, datea: new Date(registrationStartDate), typeDate: "Registration Start" })
                }
            }
        }
        return arr;
    }
    const data = refacData(u.tks);
    //console.log(data);
    /* modale("scatter");
    scatterChart("#scatter", data, "Challenges", "SubTrack", mouseover); */
}

const usersTC = require("../data/TopCoder_Users.json");
for (let i = 0; i < usersTC.length; i++) {
    fetchData(usersTC[i]);
}
//console.log("TopCoder challenges: " + itens.map(u => "(" + u.handle + ": " + u.totalChs + ")"));