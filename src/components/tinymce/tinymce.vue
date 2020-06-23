<template>
	<div>
		<!--
  给editor加key是因为给tinymce keep-alive以后组件切换时tinymce编辑器会显示异常，
  在activated钩子里改变key的值可以让编辑器重新创建
		-->
		<input
			type="file"
			ref="uploadimg"
			accept="image/png, image/jpg, image/jpeg, image/gif"
			@change="uploadImg()"
			v-show="false"
		/>
		<input type="file" ref="uploadfile" @change="uploadFile()" v-show="false" />
		<div class="text">
			<div class="emoji">
				<i class="icon iconfont icon-look" @click="showEmoji=!showEmoji"></i>
				<transition name="showbox">
					<div class="emojiBox" v-show="showEmoji">
						<li v-for="(item, index) in emojis" :key="index">
							<img :src="'static/emoji/'+item.file" :data="item.code" @click="content +=item.code" />
						</li>
					</div>
				</transition>
			</div>
			<textarea ref="text" v-model="content" @keyup="onKeyup" @click="showEmoji=false"></textarea>
			<div class="send" @click="send">
				<span>发送(ent)</span>
			</div>
			<transition name="appear">
				<div class="warn" v-show="warn">
					<div class="description">不能发送空白信息</div>
				</div>
			</transition>
		</div>
		<chatrecordVue :dialogVisible="dialogVisible" @close="dialogClose"></chatrecordVue>
	</div>
</template>
<script>
	import Editor from "@tinymce/tinymce-vue";
	import tinymce from "tinymce/tinymce";
	import chatrecordVue from "../chatrecord/chatrecord.vue";
	import { mapState, mapMutation, mapGetters, mapActions } from "vuex";
	import webSocket from "../../socket.js";
	import moment from "moment";
	export default {
		name: "TinymceEditor",
		components: {
			Editor,
			chatrecordVue
		},
		props: {
			id: {
				type: String,
				default: function() {
					return (
						"vue-tinymce-" +
						+new Date() +
						((Math.random() * 1000).toFixed(0) + "")
					);
				}
			},
			value: {
				type: String,
				default: ""
			},
			height: {
				type: [Number, String],
				required: false,
				default: 360
			},
			width: {
				type: [Number, String],
				required: false,
				default: "auto"
			}
		},
		data() {
			return {
				dialogVisible: false,
				tinymceFlag: 1,
				reply: "未找到",
				frequency: 0,
				warn: false,
				showEmoji: false,
				tinymceInit: {},
				content: "",
				imgUrl:
					"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iNTg2cHgiIGhlaWdodD0iMTk4cHgiIHZpZXdCb3g9IjAgMCA1ODYgMTk4IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA1MC4yICg1NTA0NykgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+R3JvdXA8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iR3JvdXAiIGZpbGw9IiMxOTc1RDEiPgogICAgICAgICAgICA8cGF0aCBkPSJNODcuOCw2MS4xOSBMMTMxLjcsNjEuMTkgTDEzMS43LDcxIEw4Ny44LDcxIEw4Ny44LDYxLjE5IFogTTg3LjgsMTE5LjgxIEwxMzEuNywxMTkuODEgTDEzMS43LDEyOS41OCBMODcuOCwxMjkuNTggTDg3LjgsMTE5LjgxIFogTTczLjE3LDEwMC4yNyBMMTQ2LjMzLDEwMC4yNyBMMTQ2LjMzLDExMCBMNzMuMTcsMTEwIEw3My4xNywxMDAuMjcgWiBNNzMuMTcsODAuNzMgTDE0Ni4zMyw4MC43MyBMMTQ2LjMzLDkwLjUgTDczLjE3LDkwLjUgTDczLjE3LDgwLjczIFogTTI5LjI3LDkzIEwxMDkuNzgsMTcxLjE1IEwxOTAuMjMsOTIuOTkgTDEwOS43OCwxNC43OSBMMjkuMjcsOTMgWiBNMTA5LjQyLDAuMTMgTDE5Ny41NSw4NSBMMjEwLjMyLDczLjA5IEwyMTkuNSw4MS40IEwxMDkuNzUsMTg4LjIgTDIwLjQ1LDEwMS41MSBMOC42MywxMTIuOTIgTDAsMTA0LjU1IEwxMDkuNDIsMC4xMyBaIiBpZD0iU2hhcGUiPjwvcGF0aD4KICAgICAgICAgICAgPHBhdGggZD0iTTUyMi40NiwxNTQuNDYgTDQ3Ni44LDQ2LjkyIEw0OTIuNjcsNDYuOTIgTDUzMCwxMzUuNTUgTDU2OS44Niw0Ni45MiBMNTg1LjcyLDQ2LjkyIEw1MTcuNzQsMTk3LjE1IEw1MDIuMDksMTk3LjE1IEw1MjIuNDYsMTU0LjQ2IFogTTM2NS43Miw0Ni45MiBMMzgwLjcyLDQ2LjkyIEwzODAuNzIsNjEuMTUgTDM4MS4xNSw2MS4xNSBDMzgyLjU2NzI5Nyw1OS4xOTQzMzMxIDM4NC4xNDI1NzUsNTcuMzU4MTgwMyAzODUuODYsNTUuNjYgQzM4OC4wOTA4MDEsNTMuNDU2MDMwMSAzOTAuNjE4NTY0LDUxLjU3NDUxMjkgMzkzLjM3LDUwLjA3IEMzOTYuNjU4ODA1LDQ4LjI1NDM1MTIgNDAwLjE0NDg5MSw0Ni44MjE2NjcgNDAzLjc2LDQ1LjggQzQwOC4xMjIwOSw0NC41OTExMTU4IDQxMi42MzM5MTMsNDQuMDA4NjE5MyA0MTcuMTYsNDQuMDcgQzQyMy45MjAwODQsNDQuMDExMTE3NyA0MzAuNjQ2ODA3LDQ1LjAyMzY3MDIgNDM3LjA5LDQ3LjA3IEM0NDMuNTI2NjI4LDQ5LjMwNTg4OTYgNDQ5LjM4MjU0LDUyLjk1MTMxNCA0NTQuMjMsNTcuNzQgQzQ1OC44ODk1MTEsNjIuMTQzMzE1IDQ2Mi41MTMzNTcsNjcuNTI2MTQ0IDQ2NC44NCw3My41IEM0NjcuNTA2NjY3LDc5LjkyNjY2NjcgNDY4Ljg0LDg3Ljc1MzMzMzMgNDY4Ljg0LDk2Ljk4IEw0NjguODQsMTU4LjE3IEw0NTMuODQsMTU4LjE3IEw0NTMuODQsOTYuOTMgQzQ1My44NCw4OS41OTY2NjY3IDQ1Mi44MDMzMzMsODMuNDMgNDUwLjczLDc4LjQzIEM0NDguOTg0NTY2LDczLjg4NzA4OTIgNDQ2LjI1MjEzNSw2OS43ODg0NDM0IDQ0Mi43Myw2Ni40MyBDNDM4Ljk0NDk3Miw2Mi44NDQxNDU3IDQzNC4zNDY5NjQsNjAuMjI5NDU3NCA0MjkuMzMsNTguODEgQzQyMS40NjUxMDQsNTYuMjM2OTE2NyA0MTIuOTg0ODk2LDU2LjIzNjkxNjcgNDA1LjEyLDU4LjgxIEMzOTUuMzk1Nzg3LDYxLjUzNzQxODcgMzg3LjUyOTgxOSw2OC42OTUzNzU2IDM4My45LDc4LjEyIEMzODEuNjk4MDEsODMuNzg2MjQ1NiAzODAuNjQwOTc1LDg5LjgzMjc1NjMgMzgwLjc5LDk1LjkxIEwzODAuNzksMTU4LjEyIEwzNjUuNzksMTU4LjEyIEwzNjUuNzIsNDYuOTIgWiBNMzIyLjg1LDQ2LjkyIEwzMzcuODUsNDYuOTIgTDMzNy44NSwxNTguMTIgTDMyMi44NSwxNTguMTIgTDMyMi44NSw0Ni45MiBaIE0zMjIuODUsNy42OSBMMzM3Ljg1LDcuNjkgTDMzNy44NSwzMy4zIEwzMjIuODUsMzMuMyBMMzIyLjg1LDcuNjkgWiBNMjYzLjkyLDU5LjY5IEwyMzkuMjcsNTkuNjkgTDIzOS4yNyw0Ni45MiBMMjYzLjkyLDQ2LjkyIEwyNjMuOTIsNy42OSBMMjc4LjkyLDcuNjkgTDI3OC45Miw0Ni45MiBMMzA3LDQ2LjkyIEwzMDcsNTkuNzMgTDI3OC45Miw1OS43MyBMMjc4LjkyLDE1OC4xMiBMMjYzLjkyLDE1OC4xMiBMMjYzLjkyLDU5LjY5IFoiIGlkPSJTaGFwZSI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"
			};
		},
		watch: {
			value(val) {
				this.content = this.value;
			}
		},

		computed: {
			...mapGetters([
				"selectChatId",
				"user",
				"chatList",
				"socll",
				"message",
				"emojis"
			]),
			containerWidth() {
				const width = this.width;
				if (/^[\d]+(\.[\d]+)?$/.test(width)) {
					// matches `100`, `'100'`
					return `${width}px`;
				}
				return width;
			}
		},
		mounted() {
			this.content = "";
		},
		methods: {
			...mapActions(["setMessage", "setChatList"]),
			dialogClose() {
				this.dialogVisible = !this.dialogVisible;
			},
			uploadImg() {
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
				this.$axios.post("/api/message/uploadFile", formData).then(res => {
					this.send({
						messageType: "img",
						messageContent: {
							type: "img",
							text: fileNmae,
							url: res.body.data.fileUrl
						}
					});
				});

				this.$refs.uploadimg.value = "";
			},
			uploadFile() {
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
				this.$axios.post("/api/message/uploadFile", formData).then(res => {
					this.send({
						messageType: "file",
						messageContent: {
							type: "file",
							text: fileNmae,
							url: res.body.data.fileUrl,
							size: fileSize
						}
					});
				});

				this.$refs.uploadfile.value = "";
			},
			send(contentData) {
				this.date = Date.parse(new Date());
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
				//踩坑:
				//浅拷贝Object.assign({}, message),指向新的内存地址.否则计算属性监听不到
				//深拷贝JSON.parse(JSON.stringify(message))
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

				webSocket.send({
					messageClassify: this.message.type,
					from: {
						fromId: this.user.userNum,
						fromName: this.user.nickName
					},
					target: {
						targetId: this.message.userNum || this.message.groupNum,
						targetName: this.message.userName || this.message.groupName
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
			},
			insertImg(val) {
				//上传完毕的回调方法
				tinymce.execCommand(
					"mceInsertContent",
					false,
					`<img style="max-width:200px!important;"src="${val}">`
				);
			},
			insertFile(val) {
				// //上传完毕的回调方法
				// tinymce.execCommand(
				// 	"mceInsertContent",
				// 	false,
				// 	`<img src="${val}">`
				// );
			},
			insertEmoji(val) {
				tinymce.execCommand(
					"mceInsertContent",
					false,
					`<img src="${val}">`
				);
				this.showEmoji = !this.showEmoji;
			}
		},
		created() {
			const that = this;
			that.content = that.value;
			this.tinymceInit = {
				skin_url: "/tinymce/skins/ui/oxide",
				language_url: "/tinymce/langs/zh_CN.js", //中文地址
				language: "zh_CN", //中文
				height: this.height, //高度
				auto_focus: true,
				browser_spellcheck: true, // 拼写检查
				branding: false, // 去水印
				// elementpath: false, //禁用编辑器底部的状态栏
				statusbar: false, // 隐藏编辑器底部的状态栏
				paste_data_images: true, // 允许粘贴图像
				menubar: false, // 隐藏最上方menu
				object_resizing: false,
				plugins: ["fullscreen"],
				toolbar: [
					"emoticons imageUpload files forecolor backcolor fullscreen comment"
				],

				setup: editor => {
					editor.ui.registry.addButton("imageUpload", {
						tooltip: "插入图片",
						icon: "image",
						onAction: () => {
							this.$refs.uploadimg.click();
						}
					});
					editor.ui.registry.addButton("emoticons", {
						tooltip: "插入表情",
						icon: "emoji",
						onAction: () => {
							this.showEmoji = !this.showEmoji;
						}
					});
					editor.ui.registry.addButton("files", {
						tooltip: "插入文件",
						icon: "document-properties",
						onAction: () => {
							this.$refs.uploadfile.click();
						}
					});
					editor.ui.registry.addButton("comment", {
						tooltip: "聊天记录",
						icon: "comment",
						onAction: () => {
							this.dialogVisible = true;
						}
					});
				},
				init_instance_callback: editor => {
					//监听富文本值改变事件
					editor.on("NodeChange Change KeyUp SetContent", () => {
						this.hasChange = true;
						this.content = editor.getContent();
						this.$emit("setContent", editor.getContent()); //给父组件传值
					});
				}
			};
		},
		activated() {
			this.tinymceFlag++;
		},
		mounted() {}
	};
</script>
<style scoped>
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

	.showbox-enter-active,
	.showbox-leave-active {
		transition: all 0.2s;
	}

	.showbox-enter,
	.showbox-leave-active {
		opacity: 0;
	}
</style>
