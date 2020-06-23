<!-- 聊天列表 -->
<template>
	<div class="msglist" v-if="this.chatList.length > 0 && search == ''">
		<div
			v-for="(item, index) in chatList"
			:key="index"
			class="sessionlist"
			:class="{ active: (item.userNum|| item.groupNum) == selectChatId }"
			@click="selectSession(item)"
		>
			<div class="list-left">
				<el-badge :value="item.unRead" :max="99" :hidden="item.unRead==0">
					<div v-if="item.type=='otm'" class="avatar">群</div>
					<div v-else class="avatar">{{item.realName.substr(0,1)}}</div>
				</el-badge>
			</div>
			<div class="list-right">
				<div>
					<p class="name">
						<span
							v-if="item.type=='otc'"
							style="display:inline-block;height:20px;width:30px;background:#ADADAD;border-radius:5px;font-size:10px;line-height:20px;text-align:center"
						>临时</span>
						{{ item.groupName||item.nickName }}
					</p>
					<span
						class="time"
						style="float:right"
						v-if="item.messages.length > 0"
					>{{ item.messages[item.messages.length - 1].date | time }}</span>
					<div class="time" v-else></div>
				</div>
				<div>
					<span class="lastmsg" v-if=" item.messages.length > 0">
						<span
							style="float:left;margin-right:10px"
							v-if="item.type =='otm'"
						>{{ item.messages[item.messages.length - 1].name + ":" }}</span>
						<span
							v-if="item.messages[item.messages.length - 1].content.type=='text'"
							v-html="replaceFace(item.messages[item.messages.length - 1].content.text)"
						></span>
						<span v-if="item.messages[item.messages.length - 1].content.type=='img'">[图片]</span>
						<span
							v-if="item.messages[item.messages.length - 1].content.type=='file'"
						>[文件]{{item.messages[item.messages.length - 1].content.text}}</span>
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	const now = new Date();
	import moment from "moment";
	import { mapState, mapMutation, mapGetters, mapActions } from "vuex";
	export default {
		data() {
			return { wechat: 0 };
		},
		computed: {
			...mapGetters([
				"chatList",
				"user",
				"selectChatId",
				"friendList",
				"unread",
				"search",
				"emojis"
			])
		},
		methods: {
			...mapActions([
				"setMessage",
				"setSelectChatId",
				"setChatList",
				"setInGroup"
			]),
			selectSession(value) {
				let chatList = this.chatList.map(item => {
					if (
						(item.userNum || item.groupNum) ==
						(value.userNum || value.groupNum)
					) {
						item.unRead = 0;
					}
					return item;
				});
				this.setMessage(value);
				this.setInGroup(false);
				this.setSelectChatId(value.userNum || value.groupNum);
				this.setChatList(chatList);
				if (value.type == "oto") {
					this.$router.push("/chat/friend");
				} else if (value.type == "otm") {
					this.$router.push("/chat/group");
				} else if (value.type == "otc") {
					this.$router.push("/chat/customer");
				}
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
		},
		filters: {
			time(date) {
				return moment(date).format("HH:mm");
			}
		}
	};
</script>

<style scoped>
	.msglist {
		height: 100%;
		overflow-y: auto;
	}

	.sessionlist {
		display: flex;
		padding: 12px;
		transition: background-color 0.1s;
		font-size: 0;
	}

	.sessionlist:hover {
		background-color: rgb(220, 220, 220);
		cursor: pointer;
	}
	.sessionlist:active {
		background-color: #c4c4c4;
	}
	.active {
		background-color: #c4c4c4;
	}

	.avatar {
		line-height: 36px;
		text-align: center;
		width: 36px;
		height: 36px;
		background-color: #409eff;
		color: #fff;
		font-size: 14px;
	}
	.list-left {
		width: 50px;
		height: 43px;
	}
	.list-right {
		position: relative;
		flex: 1;
		margin-top: 1px;
		margin-left: 5px;
	}
	.name {
		display: inline-block;
		vertical-align: top;
		font-size: 14px;
	}

	.time {
		float: right;
		color: #999;
		font-size: 10px;
		vertical-align: top;
	}
	.unread {
		display: inline-block;
		height: 18px;
		min-width: 16px;
		line-height: 16px;
		border-radius: 50%;
		color: #fff;
		margin: 10px 0 0 0;
		background-color: #ff3b30;
		font-size: 10px;
		text-align: center;
		position: relative;
		right: -30px;
		top: -55px;
	}
	.unread100 {
		display: inline-block;
		height: 17px;
		min-width: 22px;
		line-height: 16px;
		border-radius: 36%;
		color: #fff;
		margin: 10px 0 0 0;
		background-color: #ff3b30;
		font-size: 10px;
		text-align: center;
		position: relative;
		right: -25px;
		top: -55px;
	}
	.lastmsg {
		position: absolute;
		font-size: 12px;
		width: 100%;
		height: 25px;
		line-height: 25px;
		color: #999;
		bottom: 0px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>
