export default {
        // 保证整个项目只有一个socket实例
        ws: null, // Websocket实例
        userNum: "",
        lockReconnect: false, //是否真正建立连接
        timeout: 80000000,
        timeoutObj: null, //心跳心跳倒计时
        serverTimeoutObj: null, //心跳倒计时
        timeoutnum: null, //断开 重连倒计时,
        init(config, onMessage, onError) {
                if (!this.ws) {
                        this.userNum = config.user.userNum
                        // 实例化socket对象
                        //ws://localhost:8050/zxim2/zximserver/
                        //ws://192.168.1.134:3000/
                        this.ws = new WebSocket(`ws://192.168.1.31:8050/zxim2/zximserver/${this.userNum}`);
                }
                this.ws.onopen = () => {
                        console.log("socket连接成功");
                        //开启心跳
                        this.start();
                }
                // 客户端接收消息
                this.ws.onmessage = event => {
                        if (event.data == "连接成功") return
                        let message = JSON.parse(event.data);
                        onMessage && onMessage(message); // 接收到消息触发的回调
                };

                // 出错
                this.ws.onerror = error => {
                        console.log("连接错误" + error);
                        this.ws == null
                        this.reconnect();
                        onError && onError(error);
                };

                this.ws.onclose = () => {
                        //socket已经关闭
                        console.log("socket已经关闭");
                        this.reconnect();
                };
        },
        send(msgObj) {
                // 发送消息的时候触发
                this.ws.send(JSON.stringify(msgObj));
        },

        //重连
        reconnect() {
                console.log(this.lockReconnect)
                if (this.lockReconnect) {
                        return;
                }
                this.lockReconnect = true;
                //没连接上会一直重连，设置延迟避免请求过多
                this.timeoutnum && clearTimeout(this.timeoutnum);
                this.timeoutnum = setTimeout(() => {
                        //新连接
                        console.log("重新连接");
                        this.ws = new WebSocket(`ws://192.168.1.31:8050/zxim2/zximserver/${this.userNum}`);
                        this.lockReconnect = false;
                }, 80000000);
        },
        reset() {
                //重置心跳
                //清除时间
                clearTimeout(this.timeoutObj);
                clearTimeout(this.serverTimeoutObj);
                //重启心跳
                this.start();
        },
        start() {
                console.log("开启心跳")
                //开启心跳
                this.timeoutObj && clearTimeout(this.timeoutObj);
                this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
                this.timeoutObj = setTimeout(() => {
                        //这里发送一个心跳，后端收到后，返回一个心跳消息，
                        console.log("重连")
                        this.reconnect();
                        this.serverTimeoutObj = setTimeout(() => {
                                //超时关闭
                                this.ws.onclose = () => {
                                        this.ws = null;
                                        //socket已经关闭
                                        console.log("socket已经关闭");
                                        this.reconnect();
                                };
                        }, this.timeout);
                }, this.timeout);
        },
};