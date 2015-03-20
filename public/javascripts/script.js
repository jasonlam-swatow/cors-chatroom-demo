/*
 * Ajax表單提交
 */
$('#chatForm').submit(function (event) {
	event.preventDefault();

	var postPath = $(this).attr( 'action' );	// 获取表单的action属性值即post地址
	var postData = $(this).serialize();			// 获取序列化后的表单内容

	// 传送数据
	$.post(postPath, postData);

	$('input').val('');

});

// 从服务器撷取的最后一条消息
var lastMsgId = -1;

/*
 * 消息轮询（间隔1秒）
 */
function polling() {
	$.getJSON('/messages', { 'lastMsgId': lastMsgId }, function (data) {

		if (!data) {
			return;
		}

		if (lastMsgId == -1) {
			lastMsgId = data.id;
			return;
		}

		/*
		 * 格式化消息
		 */
		var newMsg = '';

		for (var i=0; i<data.length; i++) {
			
			var origin = '';

			if (data[i].origin !== '') {
				origin = ' (' + data[i].origin + ')';
			}

			newMsg += data[i].username + origin + ': ' + data[i].message + '\n';
			lastMsgId = data[i].id;
		}

		/*
		 * 并入聊天框
		 */
		var chat = $('textarea').get(0);
		chat.value += newMsg;

		// 自动滚动到底
		chat.scrollTop = chat.scrollHeight;
	})
	.always(function() {
		// 轮询
		setTimeout(function() {
			polling();
		}, 1000);


	});
};

polling();