const log = require('./log.js');
const file = 'logfile.json';
const articles = require('./articles.json');

const normalOrder = 'asc';
const reverseOrder = 'desc';
const ErrorObject = { code: 400, message: 'Request Invalid' };
let sortArticles;

module.exports.readAll = function readAll(req, res, payloads, cb) {
    sortArticles = articles;
    let payload = SettingsOfPayload(payloads);
    switch (payload.sortField) {
        case 'id': sortInOrder(payload, (a, b) => {
            return a.id - b.id;
        }); break;
        case 'text': sortInOrder(payload, (a, b) => {
            return a.text.localeCompare(b.text);
        });
            break;
        case 'title': sortInOrder(payload, (a, b) => {
            return a.title.localeCompare(b.title);
        });
            break;
        case 'date': sortInOrder(payload, (a, b) => {
            return a.date.localeCompare(b.date);
        });
            break;
        case 'author': sortInOrder(payload, (a, b) => {
            return a.author.localeCompare(b.author);
        });
            break;
        default:
            {
                cb(ErrorObject);
                return;
            }
    }
    let page = payload.page;
    let limit = payload.limit;
    sortArticles = sortArticles.slice((page - 1) * limit, page * limit);
    if (!payload.includeDeps) sortArticles.forEach((element) => {
        delete element.comments;
    }, this);
    let answer = {};
    answer.items = sortArticles;
    answer.meta = {};
    answer.meta.page = page;
    let count = articles.length / limit;
    (count ^ 0) === count ? answer.meta.pages = count : answer.meta.pages = parseInt(count) + 1;
    answer.meta.limit = limit;
    answer.meta.count = articles.length;
    log.log(file, '/api/articles/readall', payloads);
    cb(null, answer);
}
function sortInOrder(payload, func) {
    if (payload.sortOrder === normalOrder) {
        sortArticles.sort(func);
    }
    else if (payload.sortOrder === reverseOrder) {
        sortArticles.sort(func);
        sortArticles.reverse();
    }
}
function SettingsOfPayload(payloads) {
    let payload = payloads;
    if (payload === undefined)
        payload = {
            sortField: 'date',
            sortOrder: 'desc',
            page: 1,
            limit: 10,
            includeDeps: false
        };
    else {
        if (payload.sortField === undefined)
            payload.sortField = 'date';
        if (payload.sortOrder === undefined)
            payload.sortOrder = 'desc';
        if (payload.page === undefined)
            payload.page = 1;
        if (payload.limit === undefined)
            payload.limit = 10;
        if (payload.includeDeps === undefined)
            payload.includeDeps = false;
    }
    return payload;
}