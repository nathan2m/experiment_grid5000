const githubURL = "https://github.com/";
let itens = [];

function fetchData(user) {
    itens.push(user);
    //console.log(user);
    reposLanguages(user);
    if (user.lgs !== undefined) {
        getGraphGeral(user);
        getGraphGeralForgetting(user);
        for (let i = 0; i < user.lgs.length; i++) {
            const lg = user.lgs[i];
            getGraphLanguage(lg);
        }
    }
}

function reposLanguages(u) {
    if (u.public_repos > 0) {
        const now = new Date();
        const daysBefore = (stringDate) => ((now.getTime() - new Date(stringDate).getTime()) / (1000 * 86400));
        u.lgs = [];
        u.res = [];
        u.created_at = [];
        //u.loading = true;
        //const pages = Math.ceil(u.public_repos / 100);
        //let countPages = 0;
        //for (let i = 1; i <= pages; i++) {
        //$http.get(u.repos_url + "?page=" + i + "&per_page=100").then(function (res) {
        //rate_limit(res);
        const rs = u._repos/* res.data */;
        //console.log("Teste: ", rs);
        for (let i = 0; i < rs.length; i++) {
            u.res.push(rs[i]);
            const { id, language, fork, name, full_name, created_at, pushed_at, updated_at, forks_count, forks_url, stargazers_count, url, stargazers_url } = rs[i];
            let l = language === null ? "Others" : language;
            let o = u.lgs.length > 0 ? u.lgs.findIndex(lg => lg.l === l) : -1;
            let createdAt = {
                id,
                fork,
                time: daysBefore(created_at),
                name,
                html_url: githubURL + full_name,
                created_at,
                pushed_at,
                updated_at,
                forks_count,
                starcount: stargazers_count,
                apiUrl: url
            }
            if (o !== -1) {
                u.lgs[o].count++;
                u.lgs[o].stargazers_count += stargazers_count;
                u.lgs[o].stargazers_url.push({ id, name, url: stargazers_url, starcount: stargazers_count });
                u.lgs[o].forks_count += forks_count;
                u.lgs[o].forks_url.push({ id, name, url: forks_url, forks_count });
                u.lgs[o].created_at.push(createdAt);
            } else {
                u.lgs.push({
                    l,
                    count: 1,
                    stargazers_count,
                    stargazers_url: [{ id, name, url: stargazers_url, starcount: stargazers_count }],
                    forks_count,
                    forks_url: [{ id, name, url: forks_url, forks_count }],
                    created_at: [createdAt]
                });
            }
            u.created_at.push({ l, ...createdAt });
            o = o === -1 ? 0 : o;
            u.lgs[o].stargazers_url.sort((a, b) => b.starcount - a.starcount);
            u.lgs[o].forks_url.sort((a, b) => b.forks_count - a.forks_count);
            u.lgs[o].created_at.sort((a, b) => ((a.created_at < b.created_at) ? -1 : ((a.created_at > b.created_at) ? 1 : 0)));
        }
        u.created_at.sort((a, b) => ((a.created_at < b.created_at) ? -1 : ((a.created_at > b.created_at) ? 1 : 0)));
        u.lgs.sort((a, b) => b.stargazers_count - a.stargazers_count);
        u.lgs.sort((a, b) => b.count - a.count);
        //gh.tabela = true;
        /* }, function (err) {
            console.log(err);
        }).finally(function () {
            console.log("Page " + i + "/" + pages);
            countPages++;
            if (countPages === pages) { u.loading = false; countPages = 0; }
        }); */
        //}
        //console.log(u.lgs);
        //console.log(u.res);
        //console.log(u.created_at);
    }
}
const format = (d, i) => {
    const { name, html_url, forks_count, starcount } = d[i];
    const n = { name, html_url, forks_count, starcount };
    return n;
}
function getGraphLanguage(lg) {
    const refacData = (d) => {
        let arr = [];
        for (let i = 0; i < d.length; i++) {
            const { id, created_at, pushed_at, fork } = d[i];
            let n = format(d, i);
            arr.push({ name: n.name, id, dateTime: [], fork });
            arr[i].dateTime.push({ id, ...n, datea: new Date(created_at), typeDate: fork ? "Forked at" : "Created at" });
            if (!fork) arr[i].dateTime.push({ id, ...n, datea: new Date(pushed_at), typeDate: "Pushed at" });
            //arr[i].dateTime.push({ ...n, datea: new Date(d[i].updated_at), typeDate: "Updated at" });
        }
        return arr;
    };
    let data = refacData(lg.created_at);
    //data = data.sort((a, b) => ((a.name < b.name) ? -1 : ((a.name > b.name) ? 1 : 0))); // Ordena por nome do repositório
    data = data.sort((a, b) => ((a.fork && !b.fork) ? -1 : ((!a.fork && b.fork) ? 1 : 0)));
    //console.log(data);
    const forkTrue = data.filter(d => d.fork);
    const forkFalse = data.filter(d => !d.fork);
    //console.log(forkTrue);
    //console.log(forkFalse);
    /* modale("scatter", "scatterFork");
    scatterChart("#scatter", forkFalse, lg.l, "Repositories", mouseover);
    scatterChart("#scatterFork", forkTrue, lg.l + " (Forks)", "Repositories", mouseover); */
}
function getGraphGeral(u) {
    const refacData = (d, fork1 = false) => {
        let arr = [];
        for (let i = 0; i < d.length; i++) {
            const { l: name, created_at: c } = d[i];
            arr.push({ name, id: name, dateTime: [] });
            for (let j = 0; j < c.length; j++) {
                const { created_at, fork } = c[j];
                let n = format(c, j);
                n = { id: name, ...n, datea: new Date(created_at), typeDate: fork ? "Forked at" : "Created at" };
                if (fork === fork1) arr[arr.length - 1].dateTime.push(n);
            }
            if (arr[arr.length - 1].dateTime.length === 0) arr.pop();
        }
        return arr;
    };
    const data = refacData(u.lgs);
    const dataFork = refacData(u.lgs, true);
    //console.log(data);
    //console.log(dataFork);
    /* modale("scatter", "scatterFork");
    scatterChart("#scatter", data, "GitHub Repositories", "Languages", mouseover);
    scatterChart("#scatterFork", dataFork, "GitHub Repositories (Forks)", "Languages", mouseover); */
}

const forgetting = () => {
    const r = (t, s) => Math.pow(Math.E, -(t / s)); // Ebbinghaus equation
    const diferenceDays = (newerDate, olderDate) => Math.ceil((newerDate.getTime() - olderDate.getTime()) / (1000 * 86400))
    const sumValues = (date, dateTime) => {
        const dTsBeforeDate = [];
        for (let i = 0; i < dateTime.length; i++) {
            const { datea } = dateTime[i];
            if (datea <= date) dTsBeforeDate.push(dateTime[i]);
        }
        const max = dTsBeforeDate.length;
        if (max > 0) {
            let sum = 0;
            for (let k = 0; k < max; k++) {
                const { datea } = dTsBeforeDate[k];
                const days = diferenceDays(date, datea);
                sum += r(days, 65 * max);
            }
            return (sum / max);
        } else {
            return 0;
        }
    }
    const decaimento = (data, diasFuturo = 0) => {
        let datanew = [];
        const now = new Date();
        for (let i = 0; i < data.length; i++) {
            const { dateTime } = data[i];
            let values = [];
            const olderDate = diasFuturo ? now : new Date(Math.min(...dateTime.map(d => d.datea)));
            const days = diasFuturo > 0 ? diasFuturo : diferenceDays(now, olderDate);
            for (let j = 0; j <= days; j++) {
                const datea = new Date(new Date(olderDate).setDate(olderDate.getDate() + j));
                values.push({ datea, value: dateTime.length > 0 ? sumValues(datea, dateTime) : 0 })
            }
            datanew.push({ ...data[i], values });
        }
        return datanew;
    }
    return { decaimento, r };
}

function getGraphGeralForgetting(u) {
    const refacData = (d) => {
        let arr = [];
        for (let i = 0; i < d.length; i++) {
            const { l: name, created_at: c } = d[i];
            arr.push({ id: name, name, dateTime: [] });
            for (let j = 0; j < c.length; j++) {
                const { created_at, fork } = c[j];
                const n = { datea: new Date(created_at) };
                if (!fork) arr[arr.length - 1].dateTime.push(n);
            }
            if (arr[arr.length - 1].dateTime.length === 0) arr.pop();
        }
        return arr;
    };
    const datas = refacData(u.lgs);
    const datasPassado = forgetting().decaimento(datas);
    const datasFuturo = forgetting().decaimento(datas, 365); // Projeção do decaimento em um ano de inatividade (365 dias)
    //console.log(datasPassado);
    //console.log(datasFuturo);
    /* modale("forgettingChart", "forgettingChartFuture");
    forgettingChart("#forgettingChart", datasPassado, "Forgetting Curve", "Value");
    forgettingChart("#forgettingChartFuture", datasFuturo, "Forgetting Curve (Future)", "Value", true); */
}

const usersGH = require("../data/BIG_GitHub_Users.json");
for (let i = 0; i < usersGH.length; i++) {
    fetchData(usersGH[i]);
}
//console.log("GitHub repositories: " + itens.map(u => "("+u.login + ": " + u.lgs.length + ")"));