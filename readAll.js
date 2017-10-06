const log = require('./log.js');
const file = require('fs').createWriteStream('logfile.log');
const articles = require('./articles.json');

const normalOrder = 'asc';
const reverseOrder = 'desc';
const ErrorObject = { code: 400, message: 'Request Invalid' };
let sortArticles = articles;

module.exports.readAll = function readAll(req, res, payload, cb) {
    if (payload === undefined) payload = {sortField : 'date', sortOrder: 'desc'};
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
    log.log(file, '/api/articles/readall', payload);
    cb(null, sortArticles);
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