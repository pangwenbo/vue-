<!-- 消息框 -->
<template>
	<div class="message">
		<header class="header" v-if="message.groupNum != undefined">
			<div class="friendname">
				{{message.groupName}}
				<transition name="showbox">
					<i class="icon iconfont" :class="show?'icon-jiantou2':'icon-jiantou4' " @click="showMember()"></i>
				</transition>
			</div>
			<div class="icon iconfont icon-shenglvehao headerbox"></div>
		</header>
		<transition name="showbox">
			<div v-if="!show" class="memberbox">
				<div
					class="memberboxbtn"
					@click="dissolveGroupChat()"
					v-if="this.message.groupOwner==this.user.userNum"
				>
					<div class="memberboxborder">
						<i class="icon iconfont icon-jia memberboxbottonicon"></i>
					</div>
					<div class="membertext">解散群聊</div>
				</div>
				<div
					class="memberboxbtn"
					@click="quitGroupChat()"
					v-if="this.message.groupOwner!=this.user.userNum"
				>
					<div class="memberboxborder">
						<i class="icon iconfont icon-jia memberboxbottonicon"></i>
					</div>
					<div class="membertext">退出群聊</div>
				</div>
				<div
					class="memberboxbtn"
					@click="openAddOrDel('add')"
					v-if="this.message.groupOwner==this.user.userNum"
				>
					<div class="memberboxborder">
						<i class="icon iconfont icon-jia memberboxbottonicon"></i>
					</div>
					<div class="membertext">添加</div>
				</div>

				<div
					class="memberboxbtn"
					@click="openAddOrDel('del')"
					v-if="this.message.groupOwner==this.user.userNum"
				>
					<div class="memberboxborder">
						<i class="icon iconfont icon-jian1 memberboxbottonicon"></i>
					</div>
					<div class="membertext">移除</div>
				</div>
				<div class="memberboxbtn" v-for="(item,index) in groupMembersRes" :key="index+'groupName'">
					<div class="memberavatar">{{item.realName.substr(0,1)}}</div>
					<div class="membertext ellipsis">{{item.nickName}}</div>
				</div>
			</div>
		</transition>
		<div class="message-wrapper" ref="list">
			<div>
				<div v-for="(item,index) in data" :key="index" class="message-item">
					<div class="time">
						<span v-if="item.gstime!=undefined">{{item.gstime}}</span>
					</div>
					<div class="main" :class="{ self: item.self }">
						<div class="avatar">{{item.self?user.realName.substr(0,1):item.name.substr(0,1)}}</div>
						<div class="msgname">{{item.self?user.nickName:item.name}}</div>
						<div class="content" v-if="item.content.type=='text'">
							<div class="text" v-html="replaceFace(item.content.text)"></div>
						</div>
						<div class="content" v-if="item.content.type=='img'">
							<viewer>
								<img
									:src="item.content.url+'&token='+token"
									style="max-width:200px;height:100px;max-height:200px"
								/>
							</viewer>
						</div>
						<div class="content" v-if="item.content.type=='file'">
							<div style="width:200px;height:100px;text-align:center">
								<a
									style="height:30px;line-height:30px;color:blue"
									:href="item.content.url+'&token='+token"
									target="_blank"
								>
									<div
										class="ellipsis"
										style="height:70px;line-height:70px;border-bottom:1px solid #f2f2f2"
									>{{item.content.text}}</div>
									<span>下载({{item.content.size}})</span>
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<addmembersVue :dialogVisible="dialogVisible" @close="dialogClose" :type="type"></addmembersVue>
	</div>
</template>

<script>
	import time from "../../time.js";
	import addmembersVue from "./../addmembers/addmembers.vue";
	import { mapState, mapMutation, mapGetters, mapActions } from "vuex";
	import chatlistVue from "../chatlist/chatlist.vue";
	export default {
		components: {
			addmembersVue
		},
		data() {
			return {
				show: true,
				dialogVisible: false,
				groupMembersRes: [],
				type: "",
				token: "",
				userArr: [],
				data: []
			};
		},
		computed: {
			...mapGetters([
				"message",
				"user",
				"chatList",
				"friendList",
				"emojis",
				"selectChatId",
				"inGroup"
			])
		},
		watch: {
			chatList() {
				this.scollBottom();
			},
			selectChatId() {
				this.show = true;
			},
			message() {
				this.token = localStorage.getItem("token");
				this.formatdata();
			}
		},
		mounted() {
			this.token = localStorage.getItem("token");
			this.scollBottom();
			this.formatdata();
		},
		methods: {
			...mapActions(["setMessage", "setChatList", "setInfo"]),
			async dissolveGroupChat() {
				this.show = !this.show;
				let dissolveGroupChatRes = await this.$axios.post(
					"/api//friends/disbandedGroup",
					this.$qs.stringify({
						userNum: this.user.userNum,
						groupNum: this.message.groupNum
					})
				);
				//通知相关用户
				if (dissolveGroupChatRes.head.code != "000") return;
				this.showMember();
				for (let i in this.groupMembersRes) {
					this.userArr.push(this.groupMembersRes[i].userNum);
				}
				await this.$axios.post(
					"/api/message/RefreshMessage",
					this.$qs.stringify({
						memberList: this.userArr.join(","),
						groupNum: this.message.groupNum
					})
				);
				this.$notify({
					title: "群消息提示",
					type: "success",
					message: "解散成功",
					position: "top-right"
				});
				var chatList = this.chatList;
				for (let i in chatList) {
					if (
						(chatList[i].groupNum || chatList[i].userNum) ==
						this.message.groupNum
					) {
						chatList.splice(i, 1);
					}
				}
				this.setChatList(chatList);

				this.setMessage({});
				this.setInfo({});
				this.userArr = [];
			},
			formatdata() {
				this.data = this.message.messages;
				for (let i in this.data) {
					this.data = this.message.messages;
					this.data[i].gstime = time.gettime.getChatTime(
						this.data[i].date,
						i > 0 ? this.data[i - 1].date : 0
					);
				}
			},
			async quitGroupChat() {
				this.show = !this.show;
				let quitGroupChatRes = await this.$axios.post(
					"/api//friends/exitGroup",
					this.$qs.stringify({
						userNum: this.user.userNum,
						groupNum: this.message.groupNum
					})
				);
				//通知相关用户
				if (quitGroupChatRes.head.code != "000") return;
				await this.$axios.post(
					"/api/message/RefreshMessage",
					this.$qs.stringify({
						memberList: this.user.userNum,
						groupNum: this.message.groupNum
					})
				);
				this.$notify({
					title: "群消息提示",
					type: "success",
					message: "退出成功",
					position: "top-right"
				});
				var chatList = this.chatList;
				for (let i in chatList) {
					if (
						(chatList[i].groupNum || chatList[i].userNum) ==
						this.message.groupNum
					) {
						chatList.splice(i, 1);
					}
				}
				this.setChatList(chatList);
				this.setMessage({});
				this.setInfo({});
				this.userArr = [];
			},
			scollBottom() {
				this.$nextTick(() => {
					this.$refs.list.scrollTop = this.$refs.list.scrollHeight;
				});
			},
			dialogClose() {
				this.dialogVisible = !this.dialogVisible;
			},
			async showMember() {
				this.show = !this.show;
				if (!this.show) {
					let res = await this.$axios.get("./../../../json/member.json");
					this.groupMembersRes = res.body.data;
				}
			},
			openAddOrDel(val) {
				this.dialogVisible = true;
				this.show = !this.show;
				this.type = val;
			},
			replaceFace(con) {
				if (con.includes("/:")) {
					var emojis = this.emojis;
					for (var i = 0; i < emojis.length; i++) {
						let src = require("./../../assets/emoji/" + emojis[i].file);
						con = con.replace(
							emojis[i].reg,
							'<img src="' +
								src +
								'"  alt="" style="vertical-align: middle; width: 18px; height: 18px" />'
						);
					}
					return con;
				}
				return con;
			}
		}
	};
</script>

<style scoped>
	.icon {
		cursor: pointer;
	}
	.message {
		width: 100%;
		min-width: 600px;
		height: calc(100% - 165px);
	}

	.header {
		height: 60px;
		padding: 28px 0 0 30px;
		box-sizing: border-box;
		border-bottom: 1px solid #e7e7e7;
	}
	.headerbox {
		display: inline-block;
		width: 4%;
		text-align: left;
		float: right;
	}
	.friendname {
		font-size: 18px;
		display: inline-block;
		width: 95%;
	}
	.memberbox {
		padding: 10px 20px;
		position: absolute;
		background: #fafafa;
		z-index: 10;
		width: calc(100% - 350px);
		min-width: 400px;
		max-height: 190px;
		overflow-y: auto;
	}
	.memberboxbtn {
		display: inline-block;
		padding: 5px;
		text-align: center;
	}
	.memberboxbottonicon {
		font-size: 20px;
	}
	.membertext {
		font-size: 10px;
		width: 50px;
	}
	.memberboxborder {
		border: 1px solid #f2f2f2;
		margin: 5px;
		width: 32px;
		height: 32px;
		line-height: 32px;
	}
	.memberavatar {
		line-height: 32px;
		width: 32px;
		height: 32px;
		background-color: #409eff;
		color: #fff;
		font-size: 12px;
		margin: 5px;
	}
	.message {
		margin-bottom: 15px;
	}

	.time {
		width: 100%;
		font-size: 12px;
		margin: 7px auto;
		text-align: center;
	}

	.time > span {
		display: inline-block;
		padding: 4px 6px;
		color: #fff;
		border-radius: 3px;
		background-color: #dcdcdc;
	}

	.message-wrapper {
		height: calc(100% - 45px);
		padding: 10px 15px;
		box-sizing: border-box;
		overflow-y: auto;
		border-bottom: 1px solid #e7e7e7;
	}

	.main {
	}

	.main .avatar {
		float: left;
		margin-left: 15px;
		line-height: 36px;
		text-align: center;
		width: 36px;
		height: 36px;
		background-color: #409eff;
		color: #fff;
		font-size: 14px;
		margin-right: 12px;
	}

	.main .content {
		display: inline-block;
		position: relative;
		padding: 6px 10px;
		max-width: 500px;
		min-height: 36px;
		line-height: 24px;
		box-sizing: border-box;
		font-size: 14px;
		text-align: left;
		word-break: break-all;
		background-color: #fafafa;
		border-radius: 4px;
	}

	.main.content :before {
		content: " ";
		position: absolute;
		top: 12px;
		right: 100%;
		border: 6px solid transparent;
		border-right-color: #fafafa;
	}
	.main .content:after {
		position: absolute;
		left: -15px;
		right: 0;
		top: 3px;
		content: "";
		width: 0;
		height: 0;
		border: 8px solid #fafafa;
		border-color: transparent#fafafa transparent transparent;
	}
	.self {
		text-align: right;
	}
	.self .content:after {
		left: auto;
		right: -15px;
		border-color: transparent transparent transparent #fafafa;
	}
	.self .avatar {
		float: right;
		margin: 0 15px;
		line-height: 36px;
		text-align: center;
		width: 36px;
		height: 36px;
		background-color: #409eff;
		color: #fff;
		font-size: 14px;
		margin-right: 12px;
	}

	.self > .content {
		max-width: 500px;
	}

	.self > .content:before {
		right: -12px;
		vertical-align: middle;
		border-right-color: transparent;
	}
	.self .msgname {
		margin: 0 60px 5px 0;
		font-size: 10px;
		color: #7f7e7d;
	}
	.main .msgname {
		margin: 0 0 5px 60px;
		font-size: 10px;
		color: #7f7e7d;
	}
	.showbox-enter-active,
	.showbox-leave-active {
		transition: all 0.2s;
	}

	.showbox-enter,
	.showbox-leave-active {
		opacity: 0;
	}
	.ellipsis {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>
