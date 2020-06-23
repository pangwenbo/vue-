const WebSocket = require('ws');

// 定义websocket服务器
const wsServer = new WebSocket.Server({
        port: 3000
}, () => {
        console.log("3000端口开启")
});

// 定义连接到的websocket集合
let socketSet = [];

// 连接
wsServer.on('connection', (websocket, req, res) => {
        const userid = req.url.split('/');
        console.log(userid)
        let isExist = false; // 标记当前用户是否在线
        socketSet.forEach(ws => {
                if (ws.currentId == userid[2]) {
                        isExist = true;
                }
        });
        if (!isExist) {
                socketSet.push({
                        websocket: websocket,
                        currentId: userid[1]
                });
        }

        websocket.on('message', function incoming(message) {
                // console.log('received: %s', message);
                // 收到消息之后推送给目标对象

                const msgObj = JSON.parse(message);
                console.log(msgObj)
                if (msgObj.type == "otm") {
                        let groupMember = ["1", "2", "3", "4"]
                        for (let i = 0; i < groupMember.length; i++) {
                                socketSet.forEach(ws => {
                                        // console.log(ws);
                                        if (ws.websocket.readyState == 1) {
                                                if (ws.currentId == groupMember[i] && groupMember[i] != msgObj.fromId) {
                                                        ws.websocket.send(
                                                                JSON.stringify(msgObj)
                                                        );
                                                }
                                        }
                                });
                        }
                } else {
                        socketSet.forEach(ws => {
                                // console.log(ws);
                                if (ws.websocket.readyState == 1) {
                                        if (ws.currentId == msgObj.targetId) {
                                                ws.websocket.send(
                                                        JSON.stringify(msgObj)
                                                );
                                        }
                                }
                        });
                }

        });

        // websocket.send(
        //   JSON.stringify({
        //     msg: 'websocket连接成功'
        //   })
        // );
});

/**
readyState属性返回实例对象的当前状态，共有四种。
CONNECTING：值为0，表示正在连接。
OPEN：值为1，表示连接成功，可以通信了。
CLOSING：值为2，表示连接正在关闭。
CLOSED：值为3，表示连接已经关闭，或者打开连接失败
 */