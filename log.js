const file = 'logfile.json';
module.exports.log = log;
module.exports.logs = function logs(req, res, payload, cb) {
	const logfl = require('./' + file);
	log(file, '/api/logs', payload);
	cb(null, logfl);
}
function log(logfile, url, data) {
	const logfl = require('./' + logfile);
	const current = new Date();
	console.log(logfl);
	let info = {
		date: (current.getDay() + 1) + '.' + (current.getMonth() + 1) + '.' + current.getFullYear() + ' ' + current.getHours() + ':' + current.getMinutes() + ':' + current.getSeconds(),
		url: url,
		data: JSON.stringify(data)
	};
	logfl.push(info);
	require('fs').createWriteStream(logfile).write(JSON.stringify(logfl));
	/*logfile.write(new Buffer('\t'+ (current.getDay()+1) + '.' + (current.getMonth()+1) + '.' + current.getFullYear() + ' ' + current.getHours() + ':'+ current.getMinutes() + ':' + current.getSeconds()+'\n'+
                  'URL: ' + url + '\n'+
                  'Request:\n' + JSON.stringify(data) + '\n----------------------------------\n'));*/
}