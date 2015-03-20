var idGen = 0;

// 初始化messages数列
var messages = messages || [{
	'id': idGen++,
	'username': '',
	'message': '',
	'origin': ''
}];

/*
 * Ajax请求部分
 */
exports.list = function(req, res) {

	// CORS
	var origin = req.header('origin');
	if (origin !== undefined) {
		res.header('Access-Control-Allow-Origin', '*');

		// Preflight
		if (req.method == 'OPTIONS') {
			res.header('Access-Control-Allow-Methods', 'GET');
			res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, X-Requested-With');
			res.send(200);
			return;
		}
	}

	var lastMsgId = req.query.lastMsgId;

	// 当用户上线时，返回早前的消息
	if (lastMsgId == -1) {
		res.json(messages[messages.length - 1]);
		return;
	}

	var filtered = messages.filter(function (msg) {
		return msg.id > lastMsgId;
	});

	res.json(filtered);
};

exports.send = function(req, res) {

	// CORS
	var origin = req.header('origin');
	if (origin !== undefined) {
		res.header('Access-Control-Allow-Origin', '*');

		// Preflight(凭证)
		if (req.method == 'OPTIONS') {
			res.header('Access-Control-Allow-Methods', 'POST');
			res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, X-Requested-With');
			res.send(200);
			return;
		}
	}

	origin = origin || '';

	var username = req.body.username;
	var message = req.body.message;

	// 将消息以先进先出队列方式插入messages数组末端
	messages.push({
		'id': idGen++,
		'username': username,
		'message': message,
		'origin': origin.indexOf(req.header('host')) !== -1 ? '' : origin
	});

	res.json(200);

};
