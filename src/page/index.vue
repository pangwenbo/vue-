<template>
	<div id="index">
		<div class="sidebar">
			<Mycard></Mycard>
		</div>
		<div class="main">
			<router-view></router-view>
		</div>
	</div>
</template>

<script>
	import Mycard from "./../components/mycard/mycard.vue";
	import websocket from "@/util/websocket.js";
	import { mapState, mapMutation, mapGetters, mapActions } from "vuex";
	export function getUrlKey(name) {
		return (
			decodeURIComponent(
				(new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(
					location.href
				) || [, ""])[1].replace(/\+/g, "%20")
			) || null
		);
	}
	export default {
		components: {
			Mycard
		},
		data() {
			return {
				emojis: [
					{
						file: "100.gif",
						code: "/::)",
						title: "微笑",
						reg: /\/::\)/g
					},
					{ file: "101.gif", code: "/::~", title: "伤心", reg: /\/::~/g },
					{ file: "102.gif", code: "/::B", title: "美女", reg: /\/::B/g },
					{
						file: "103.gif",
						code: "/::|",
						title: "发呆",
						reg: /\/::\|/g
					},
					{
						file: "104.gif",
						code: "/:8-)",
						title: "墨镜",
						reg: /\/:8-\)/g
					},
					{ file: "105.gif", code: "/::<", title: "哭", reg: /\/::</g },
					{ file: "106.gif", code: "/::$", title: "羞", reg: /\/::\$/g },
					{ file: "107.gif", code: "/::X", title: "哑", reg: /\/::X/g },
					{ file: "108.gif", code: "/::Z", title: "睡", reg: /\/::Z/g },
					{
						file: "109.gif",
						code: "/::'(",
						title: "哭",
						reg: /\/::'\(/g
					},
					{
						file: "110.gif",
						code: "/::-|",
						title: "囧",
						reg: /\/::-\|/g
					},
					{ file: "111.gif", code: "/::@", title: "怒", reg: /\/::@/g },
					{ file: "112.gif", code: "/::P", title: "调皮", reg: /\/::P/g },
					{ file: "113.gif", code: "/::D", title: "笑", reg: /\/::D/g },
					{ file: "114.gif", code: "/::O", title: "惊讶", reg: /\/::O/g },
					{
						file: "115.gif",
						code: "/::(",
						title: "难过",
						reg: /\/::\(/g
					},
					{ file: "116.gif", code: "/::+", title: "酷", reg: /\/::\+/g },
					{ file: "117.gif", code: "/:--b", title: "汗", reg: /\/:--b/g },
					{ file: "118.gif", code: "/::Q", title: "抓狂", reg: /\/::Q/g },
					{ file: "119.gif", code: "/::T", title: "吐", reg: /\/::T/g },
					{ file: "120.gif", code: "/:,@P", title: "笑", reg: /\/:,@P/g },
					{
						file: "121.gif",
						code: "/:,@-D",
						title: "快乐",
						reg: /\/:,@-D/g
					},
					{ file: "122.gif", code: "/::d", title: "奇", reg: /\/::d/g },
					{ file: "123.gif", code: "/:,@o", title: "傲", reg: /\/:,@o/g },
					{ file: "124.gif", code: "/::g", title: "饿", reg: /\/::g/g },
					{
						file: "125.gif",
						code: "/:|-)",
						title: "累",
						reg: /\/:\|-\)/g
					},
					{ file: "126.gif", code: "/::!", title: "吓", reg: /\/::!/g },
					{ file: "127.gif", code: "/::L", title: "汗", reg: /\/::L/g },
					{ file: "128.gif", code: "/::>", title: "高兴", reg: /\/::>/g },
					{ file: "129.gif", code: "/::,@", title: "闲", reg: /\/::,@/g },
					{
						file: "130.gif",
						code: "/:,@f",
						title: "努力",
						reg: /\/:,@f/g
					},
					{ file: "131.gif", code: "/::-S", title: "骂", reg: /\/::-S/g },
					{
						file: "133.gif",
						code: "/:,@x",
						title: "秘密",
						reg: /\/:,@x/g
					},
					{ file: "134.gif", code: "/:,@@", title: "乱", reg: /\/:,@@/g },
					{ file: "135.gif", code: "/::8", title: "疯", reg: /\/::8/g },
					{ file: "136.gif", code: "/:,@!", title: "哀", reg: /\/:,@!/g },
					{ file: "137.gif", code: "/:!!!", title: "鬼", reg: /\/:!!!/g },
					{ file: "138.gif", code: "/:xx", title: "打击", reg: /\/:xx/g },
					{
						file: "139.gif",
						code: "/:bye",
						title: "bye",
						reg: /\/:bye/g
					},
					{
						file: "142.gif",
						code: "/:handclap",
						title: "鼓掌",
						reg: /\/:handclap/g
					},
					{ file: "145.gif", code: "/:<@", title: "什么", reg: /\/:<@/g },
					{ file: "147.gif", code: "/::-O", title: "累", reg: /\/::-O/g },
					{ file: "153.gif", code: "/:@x", title: "吓", reg: /\/:@x/g },
					{ file: "155.gif", code: "/:pd", title: "刀", reg: /\/:pd/g },
					{
						file: "156.gif",
						code: "/:<W>",
						title: "水果",
						reg: /\/:<W>/g
					},
					{
						file: "157.gif",
						code: "/:beer",
						title: "酒",
						reg: /\/:beer/g
					},
					{
						file: "158.gif",
						code: "/:basketb",
						title: "篮球",
						reg: /\/:basketb/g
					},
					{ file: "159.gif", code: "/:oo", title: "乒乓", reg: /\/:oo/g },
					{
						file: "195.gif",
						code: "/:circle",
						title: "跳舞",
						reg: /\/:circle/g
					},
					{
						file: "160.gif",
						code: "/:coffee",
						title: "咖啡",
						reg: /\/:coffee/g
					}
				]
			};
		},

		computed: {
			...mapGetters([
				"ws",
				"selectChatId",
				"message",
				"chatList",
				"unread",
				"iframeState",
				"iframeState",
				"friendList",
				"user",
				"friendList",
				"info"
			])
		},
		watch: {
			chatList() {
				localStorage.setItem(
					"wechat" + this.user.userNum,
					JSON.stringify({
						id: this.user.userNum,
						chat: this.chatList
					})
				);
				this.setUnread(0);
				let unread = 0;
				for (let i in this.chatList) {
					unread = unread + this.chatList[i].unRead;
				}
				this.setUnread(unread);
			}
		},
		methods: {
			...mapActions([
				"setWs",
				"setUser",
				"setFriendList",
				"setChatList",
				"setIframeState",
				"setEmojis",
				"setMessage",
				"setInfo",
				"setUnread"
			]),
			async getUser() {
				//获取好友列表信息
				let res = await this.$axios.get("./../json/friend.json");
				if (res.head.code != "000") return;
				this.setFriendList(res.body.data);

				//获取登录用户数据
				let userNum = getUrlKey("userNum");
				for (let i in this.friendList) {
					if (this.friendList[i].userNum == userNum) {
						this.setUser(this.friendList[i]);
					}
				}

				//初始化websocket
				let socket = new websocket({
					url: `ws://172.16.42.57:3000/${userNum}`
				});
				this.setWs(socket);
				this.ws.onmessage(data => {
					this.onMessage(data);
				});
				//判断是否在本地存储了聊天信息

				if (localStorage.getItem("wechat" + userNum)) {
					//获取聊天本地缓存数据
					let localStorageId = JSON.parse(
						localStorage.getItem("wechat" + userNum)
					).chat;
					// //提交聊天本地缓存数据
					// for (let i in this.friendList) {
					// 	for (let j in localStorageId) {
					// 		if (
					// 			(this.friendList[i].groupNum ||
					// 				this.friendList[i].userNum) !=
					// 			(localStorageId[j].groupNum ||
					// 				localStorageId.userNum)
					// 		) {
					// 			localStorageId.splice(j, 1);
					// 		}
					// 	}
					// }
					this.setChatList(localStorageId);
				} else {
					localStorage.setItem(
						"wechat" + userNum,
						JSON.stringify({
							id: userNum,
							chat: []
						})
					);
				}

				this.setEmojis(this.emojis);
			},

			postMessage() {
				if (this.iframeState == "full" || this.iframeState == "restore") {
					parent.postMessage("2", "http://192.168.1.31:9005/");
				} else {
					parent.postMessage("1", "http://192.168.1.31:9005/");
				}
			},
			onMessage(data) {
				console.log(data);
				
				data = JSON.parse(data);
				let message = {};
				let messages = [];
				let chatList = this.chatList;
				let friendList = this.friendList;
				let flag = false;
				message = {
					date: data.sendTime,
					content: data.message.messageContent,
					name: data.from.fromName
				};
				if (data.messageClassify == "stf") {
					this.getFriendList();
				}
				if (data.messageClassify == "otc") {
					this.postMessage();
					//单聊
					for (let i in chatList) {
						if (chatList[i].userNum == data.from.fromId) {
							messages = chatList[i];
							data.from.fromId == this.selectChatId
								? (messages.unRead = 0)
								: (messages.unRead += 1);
							if (messages.messages.length >= 200) {
								message.splice(0, 1);
							}
							messages.messages.push(message);
							chatList.splice(i, 1);
							chatList = [messages, ...chatList];
							flag = true;
							break;
						}
					}
					if (!flag) {
						messages = {
							userNum: data.from.fromId,
							userName: data.from.fromName,
							realName: data.from.fromName,
							nickName: data.from.fromName,
							unRead: 1,
							messages: [message],
							type: data.messageClassify
						};
						chatList = [messages, ...chatList];
					}
					this.setChatList(chatList);
				}
				if (data.messageClassify == "oto") {
					this.postMessage();
					//单聊
					for (let i in chatList) {
						if (chatList[i].userNum == data.from.fromId) {
							messages = chatList[i];
							data.from.fromId == this.selectChatId
								? (messages.unRead = 0)
								: (messages.unRead += 1);
							if (messages.messages.length >= 200) {
								message.splice(0, 1);
							}
							messages.messages.push(message);
							chatList.splice(i, 1);
							chatList = [messages, ...chatList];
							flag = true;
							break;
						}
					}
					if (!flag) {
						for (let i in friendList) {
							//如果有
							if (friendList[i].userNum == data.from.fromId) {
								messages = friendList[i];
								messages.messages = [message];
								messages.unRead = 1;
								chatList = [messages, ...chatList];
								break;
							}
						}
					}
					this.setChatList(chatList);
				}
				if (data.messageClassify == "otm") {
					this.postMessage();
					//群聊踩坑:
					//群聊的id应为target
					for (let i in chatList) {
						if (chatList[i].groupNum == data.target.targetId) {
							messages = chatList[i];
							data.target.targetId == this.selectChatId
								? (messages.unRead = 0)
								: (messages.unRead += 1);
							if (messages.messages.length >= 200) {
								message.splice(0, 1);
							}
							messages.messages.push(message);
							chatList.splice(i, 1);
							chatList = [messages, ...chatList];
							flag = true;
							break;
						}
					}
					if (!flag) {
						for (let i in friendList) {
							//如果有
							if (friendList[i].groupNum == data.target.targetId) {
								messages = friendList[i];
								messages.messages = [message];
								messages.unRead = 1;
								chatList = [messages, ...chatList];
								break;
							}
						}
					}
					this.setChatList(chatList);
				}
			}
		},
		mounted() {
			// window.addEventListener(
			// 	"message",
			// 	e => {
			// 		if (
			// 			e.data != "full" &&
			// 			e.data != "min" &&
			// 			e.data != "restore"
			// 		) {
			// 			this.setIframeState("full");
			// 		} else {
			// 			this.setIframeState(e.data);
			// 		}

			// 		console.log(this.iframeState);
			// 	},
			// 	false
			// );
			this.getUser();
		}
	};
</script>

<style scoped>
	#index {
		display: flex;
		width: 100%;
		height: 100%;
		background-color: #fff;
	}
	.sidebar {
		width: 60px;
		height: 100%;
		background: #2b2c2f;
	}
	.main {
		flex: 1;
		height: 100%;
		background: #f2f2f2;
	}
</style>
<style>
	.tox .tox-toolbar {
		background: rgb(255, 255, 255, 0.5) !important;
	}
	.tox .tox-edit-area__iframe {
		background: rgb(255, 255, 255, 0.5) !important;
	}
</style>
