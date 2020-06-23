<!-- 文本输入框 -->
<template>
	<div class="text" v-if="selectChatId">
		<input
			type="file"
			ref="uploadimg"
			accept="image/png, image/jpg, image/jpeg, image/gif"
			@change="uploadImg()"
			v-show="false"
		/>
		<input type="file" ref="uploadfile" @change="uploadFile()" v-show="false" />
		<transition name="showbox">
			<div class="emojiBox" v-show="showEmoji">
				<div style="display:inline-block;cursor:pointer">
					<img
						v-for="(item, index) in emojis"
						:key="index"
						:src="require('../../assets/emoji/'+item.file)"
						:data="item.code"
						@click="content +=item.code"
					/>
				</div>
			</div>
		</transition>
		<div class="emoji">
			<i class="icon iconfont icon-biaoqing" style="padding:0 10px" @click="showEmoji=!showEmoji"></i>
			<i class="icon iconfont icon-tupian" style="padding:0 10px" @click="$refs.uploadimg.click();"></i>
			<i class="icon iconfont icon-wenjian" style="padding:0 10px" @click="$refs.uploadfile.click();"></i>
			<i class="icon iconfont icon-liaotianjilu" style="padding:0 10px" @click="dialogVisible = true;"></i>
		</div>
		<textarea ref="text" v-model="content" @keyup="onKeyup" @click="showEmoji=false"></textarea>
		<!-- <form>
		<tinymce height="250" @setContent="getContent" ref="tinymce"></tinymce>-->
		<el-button
			type="primary"
			class="send"
			size="mini"
			@click="sendText()"
			:disabled="disabled"
		>发送(Enter)</el-button>
		<transition name="appear">
			<div class="warn" v-show="warn">
				<div class="description">不能发送空白信息</div>
			</div>
		</transition>
		<chatrecordVue :dialogVisible="dialogVisible" @close="dialogClose"></chatrecordVue>
		<!-- </form> -->
	</div>
</template>

<script>
	import chatrecordVue from "../chatrecord/chatrecord.vue";
	import webSocket from "../../socket.js";
	import moment from "moment";
	import { mapState, mapMutation, mapGetters, mapActions } from "vuex";
	export default {
		components: {
			chatrecordVue
		},
		data() {
			return {
				content: "",
				reply: "未找到",
				frequency: 0,
				warn: false,
				disabled: false,
				showEmoji: false,
				dialogVisible: false,
				date: ""
			};
		},
		computed: {
			...mapGetters([
				"selectChatId",
				"user",
				"chatList",
				"message",
				"emojis",
				"ws"
			])
		},
		watch: {
			// 当输入框中的值为空时 弹出提示  并在一秒后消失
			content() {
				if (this.content === "") {
					if (this.frequency === 0) {
						this.warn = true;
						this.frequency++;
						setTimeout(() => {
							this.warn = false;
						}, 1000);
					}
				}
			}
		},
		mounted() {},
		methods: {
			...mapActions(["setMessage", "setChatList"]),
			// 按回车发送信息
			onKeyup(e) {
				if (e.keyCode === 13) {
					this.sendText();
				}
				this.showEmoji = false;
			},
			//关闭聊天记录
			dialogClose() {
				this.dialogVisible = !this.dialogVisible;
			},
			//上传图片
			uploadImg() {
				const loading = this.$loading({
					lock: true,
					text: "图片发送中...",
					spinner: "el-icon-loading",
					background: "rgba(0, 0, 0, 0.7)"
				});
				var file = this.$refs.uploadimg.files;
				var formData = new FormData();
				formData.append("messageClassify", this.message.type);
				formData.append("fromNum", this.user.userNum);
				formData.append(
					"targetNum",
					this.message.userNum || this.message.groupNum
				);
				formData.append("file", file[0]);
				let fileNmae = file[0].name;
				if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(fileNmae)) {
					return this.$message.error(
						"图片类型必须是.gif,jpeg,jpg,png中的一种"
					);
				}
				this.$axios
					.post("/api/message/uploadFile", formData)
					.then(res => {
						this.sendMessage({
							messageType: "img",
							messageContent: {
								type: "img",
								text: fileNmae,
								url: res.body.data.fileUrl
							}
						});
						loading.close();
					})
					.catch(err => {
						loading.close();
					});

				this.$refs.uploadimg.value = "";
			},
			//上传文件
			uploadFile() {
				const loading = this.$loading({
					lock: true,
					text: "文件上传中...",
					spinner: "el-icon-loading",
					background: "rgba(0, 0, 0, 0.7)"
				});
				var file = this.$refs.uploadfile.files;
				var formData = new FormData();
				formData.append("messageClassify", this.message.type);
				formData.append("fromNum", this.user.userNum);
				formData.append(
					"targetNum",
					this.message.userNum || this.message.groupNum
				);
				formData.append("file", file[0]);
				console.log(file[0]);
				let fileNmae = file[0].name;
				let fileSize = this.change(file[0].size);
				this.$axios
					.post("/api/message/uploadFile", formData)
					.then(res => {
						this.sendMessage({
							messageType: "file",
							messageContent: {
								type: "file",
								text: fileNmae,
								url: res.body.data.fileUrl,
								size: fileSize
							}
						});
						loading.close();
					})
					.catch(err => {
						loading.close();
					});

				this.$refs.uploadfile.value = "";
			},
			// 点击发送按钮发送信息
			async sendText() {
				this.showEmoji = false;
				this.disabled = true;
				if (this.content.length < 1) {
					this.warn = true;
					this.content = "";
					setTimeout(() => {
						this.warn = false;
					}, 1000);
				} else {
					// if (this.message.type == "otm") {
					// 	let flag = false;
					// 	let res = await this.$axios.post(
					// 		"/api/friends/getGroupMembers",
					// 		this.$qs.stringify({
					// 			userNum: this.user.userNum,
					// 			groupNum: this.message.groupNum
					// 		})
					// 	);
					// 	let groupMembersRes = res.body.data;
					// 	for (let i in groupMembersRes) {
					// 		if (groupMembersRes[i].userNum == this.user.userNum) {
					// 			this.sendMessage({
					// 				messageType: "text",
					// 				messageContent: {
					// 					type: "text",
					// 					text: this.content
					// 				}
					// 			});
					// 			flag = true;
					// 		}
					// 	}
					// 	if (!flag) {
					// 		this.$message.error("您已经不在本群");
					// 	}
					// } else {
					this.sendMessage({
						messageType: "text",
						messageContent: {
							type: "text",
							text: this.content
						}
					});
					// }
				}
				this.disabled = false;
			},
			sendMessage(contentData) {
				this.date = Date.parse(new Date());
				this.content = "";
				let message = this.message;
				if (message.length >= 200) {
					message.splice(0, 1);
				}
				message.messages.push({
					self: true, //自己的消息用self区分
					date: this.date,
					content: contentData.messageContent,
					name: this.user.nickName
				});
				this.setMessage(Object.assign({}, message));

				let chatList = this.chatList;
				for (let i in chatList) {
					if (
						(chatList[i].userNum || chatList[i].groupNum) ==
						(message.userNum || message.groupNum)
					) {
						chatList.splice(i, 1);
						message.unRead = 0;
						chatList = [message, ...chatList];
						break;
					}
				}
				this.setChatList(chatList);
				//发送消息
				this.ws.send({
					messageClassify: this.message.type,
					from: {
						fromId: this.user.userNum,
						fromName: this.user.nickName
					},
					target: {
						targetId: this.message.userNum || this.message.groupNum,
						targetName: this.message.nickName || this.message.groupName
					},
					message: contentData,
					sendTime: this.date
				});
			},
			change(limit) {
				var size = "";
				if (limit < 0.1 * 1024) {
					//小于0.1KB，则转化成B
					size = limit.toFixed(2) + "B";
				} else if (limit < 0.1 * 1024 * 1024) {
					//小于0.1MB，则转化成KB
					size = (limit / 1024).toFixed(2) + "KB";
				} else if (limit < 0.1 * 1024 * 1024 * 1024) {
					//小于0.1GB，则转化成MB
					size = (limit / (1024 * 1024)).toFixed(2) + "MB";
				} else {
					//其他转化成GB
					size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
				}

				var sizeStr = size + ""; //转成字符串
				var index = sizeStr.indexOf("."); //获取小数点处的索引
				var dou = sizeStr.substr(index + 1, 2); //获取小数点后两位的值
				if (dou == "00") {
					//判断后两位是否为00，如果是则删除00
					return (
						sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
					);
				}
				return size;
			}
		}
	};
</script>

<style  scoped>
	.text {
		position: relative;
		height: 150px;
		background: rgb(230, 230, 230, 0);
	}

	.emoji {
		position: relative;
		width: 100%;
		height: 40px;
		line-height: 40px;
		font-size: 15px;
		padding: 0 20px;
		box-sizing: border-box;
		color: #7c7c7c;
		cursor: pointer;
	}

	.icon {
		cursor: pointer;
	}

	.icon:hover {
		color: #409eff;
	}

	textarea {
		box-sizing: border-box;
		padding: 10px 30px;
		height: 110px;
		width: 100%;
		border: none;
		outline: none;
		font-family: "Micrsofot Yahei";
		resize: none;
	}

	.send {
		position: absolute;
		bottom: 10px;
		right: 30px;
	}

	.warn {
		position: absolute;
		bottom: 60px;
		right: 10px;
		width: 110px;
		height: 30px;
		line-height: 30px;
		font-size: 12px;
		text-align: center;
		border: 1px solid #bdbdbd;
		border-radius: 4px;
		box-shadow: 0 1px 5px 1px #bdbdbd;
	}

	.appear-enter-active,
	.appear-leave-active {
		transition: all 1s;
	}

	.appear-enter,
	.appear-leave-active {
		opacity: 0;
	}

	.warn:before {
		content: " ";
		position: absolute;
		top: 100%;
		right: 20px;
		border: 7px solid transparent;
		border-top-color: #fff;
		filter: drop-shadow(1px 3px 2px #bdbdbd);
	}
	.emojiBox {
		position: absolute;
		display: flex;
		flex-wrap: wrap;
		top: -210px;
		left: -100px;
		width: 300px;
		height: 200px;
		padding: 5px;
		background-color: #fff;
		border: 1px solid #d1d1d1;
		border-radius: 2px;
		box-shadow: 0 1px 2px 1px #d1d1d1;
	}
</style>
