const stackURL = "https://stackoverflow.com/";
let itens = [];

function fetchData(user) {
    itens.push(user);
    //console.log(user);
    getTags(user);
    if(user.tags !== undefined){
        getChartGeral(user);
        for (let i = 0; i < user.tags.length; i++) {
            const t = user.tags[i];
            getChartTag(t);
        }
    }
    
}

function getTags(u) {
    u.tags = [];
    //u.loading = true;
    //$http.get(stackAPI + "/users/" + u.user_id + "/tags?pagesize=100&" + site).then(function (res) {
    //rate_limit(res);
    u.tags = u._tags/* res.data.items */;
    u.tags.sort((a, b) => b.count - a.count);
    //console.log(u.tags);
    //so.tabela = true;
    /* }, function (err) {
        console.log(err.data);
    }).finally(function () {
        u.loading = false;
    }); */
    for (let i = 0; i < u.tags.length; i++) {
        getAnswers(u.tags[i]);
        getQuestions(u.tags[i]);
    }
}

function getAnswers(t) {
    //t.loadingA = true;
    //$http.get(stackAPI + "/users/" + t.user_id + "/tags/" + t.name + "/top-answers?" + site).then(function (res) {
    //rate_limit(res);
    //console.log(res.data.items);
    t.answers = t._answers/* res.data.items */;
    t.answers.sort((a, b) => ((a.creation_date < b.creation_date) ? -1 : ((a.creation_date > b.creation_date) ? 1 : 0)));
    /* }, function (err) {
        console.log(err);
    }).finally(function () {
        t.loadingA = false;
    }); */
    //console.log(t.answers);
}

function getQuestions(t) {
    //t.loadingQ = true;
    //$http.get(stackAPI + "/users/" + t.user_id + "/tags/" + t.name + "/top-questions?" + site).then(function (res) {
    //rate_limit(res);
    //console.log(res.data.items);
    t.questions = t._questions/* res.data.items */;
    t.questions.sort((a, b) => ((a.creation_date < b.creation_date) ? -1 : ((a.creation_date > b.creation_date) ? 1 : 0)));
    /* }, function (err) {
        console.log(err);
    }).finally(function () {
        t.loadingQ = false;
    }); */
    //console.log(t.questions);
}

const format = (d, i) => {
    const { link, answer_id, title, score, is_accepted, is_answered } = d[i];
    const status = is_accepted !== undefined ?
        (is_accepted ? "Answer accepted" : "") :
        is_answered !== undefined ? (is_answered ? "Question answered" : "") : "";
    const name = (title ? (title.length > 20 ? title.substring(0, 20) + "..." : title) : ("Answer" + (i + 1)));
    const html_url = link === undefined ? stackURL + "a/" + answer_id : link;
    const n = { name, html_url, score, status };
    return n;
}
function getChartTag(t){
    //console.log(t);
    const refacData = (d) => {
        let arr = [];
        if (d !== undefined) {
            for (let i = 0; i < d.length; i++) {
                const { answer_id, question_id, creation_date, last_activity_date } = d[i];
                let n = format(d, i);
                const id = answer_id || question_id;
                arr.push({ id, name: n.name, dateTime: [] });
                arr[i].dateTime.push({ id, datea: new Date(1000 * creation_date), typeDate: "Creation date", ...n });
                arr[i].dateTime.push({ id, datea: new Date(1000 * last_activity_date), typeDate: "Last activity date", ...n });
            }
        }
        return arr;
    };
    const dataAnswers = refacData(t.answers);
    const dataQuestions = refacData(t.questions);
    //console.log(dataAnswers);
    //console.log(dataQuestions);
    /* modale("scatterAnswer", "scatterQuestion");
    scatterChart("#scatterAnswer", dataAnswers, "Tag: " + t.name, "Answer", mouseover);
    scatterChart("#scatterQuestion", dataQuestions, "Tag: " + t.name, "Question", mouseover); */
}
function getChartGeral(u){
    //console.log(u);
    const refacData = (d, type) => {
        let arr = [];
        if (d !== undefined) {
            for (let i = 0; i < d.length; i++) {
                const { name: tagName, [type]: c } = d[i];
                if (c !== undefined && c.length > 0) {
                    arr.push({ id: tagName, name: tagName, dateTime: [] });
                    for (let j = 0; j < c.length; j++) {
                        const { creation_date } = c[j];
                        const n = format(c, j);
                        arr[arr.length - 1].dateTime.push({ id: tagName, datea: new Date(1000 * creation_date), typeDate: "Creation date", ...n });
                    }
                }
            }
        }
        return arr;
    }
    const dataAnswers = refacData(u.tags, "answers");
    const dataQuestions = refacData(u.tags, "questions");
    //console.log(dataAnswers);
    //console.log(dataQuestions);
    /* modale("scatterAnswer", "scatterQuestion");
    scatterChart("#scatterAnswer", dataAnswers, "Answers", "Tag name", mouseover);
    scatterChart("#scatterQuestion", dataQuestions, "Questions", "Tag name", mouseover); */
}

const usersSO = require("../data/BIG_StackOverflow_Users.json");
for (let i = 0; i < usersSO.length; i++) {
    fetchData(usersSO[i]);
}
//console.log("StackOverflow tags: " + itens.map(u => "(" + u.display_name + ": "+ u.tags.length +")"));