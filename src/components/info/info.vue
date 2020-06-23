<!-- 好友信息 -->
<template>
	<div class="Info-wrapper">
		<div class="friendInfo" v-if="(info.groupNum||info.userNum) != undefined">
			<div class="esInfo">
				<div class="left">
					<div class="people">
						<div class="nickName">{{info.nickName||info.groupName}}</div>
						<div v-if="info.type=='oto'" :class="[info.sex=='女'?'gender-male':'gender-female']"></div>
					</div>
					<div class="signature" v-if="info.type=='oto'">{{info.signature}}</div>
				</div>
				<div class="right">
					<div
						v-if="info.type=='otm'"
						style="line-height:46px;text-align:center;width:46px;height:46px;background-color:#409EFF;color:#fff;font-size:14px;margin-right: 12px;"
					>群</div>
					<div
						v-else
						style="line-height:46px;text-align:center;width:46px;height:46px;background-color:#409EFF;color:#fff;font-size:14px;margin-right: 12px;"
					>{{info.realName.substr(0,1)}}</div>
				</div>
			</div>
			<div class="detInfo">
				<div class="remark">
					<span>备注</span>
					{{info.remark}}
				</div>
				<div class="zh">
					<span>账号</span>
					{{info.userName}}
				</div>
				<div class="wxid">
					<span>手机号</span>
					{{info.mobile}}
				</div>

				<div class="area">
					<span>地区</span>
					{{info.area}}
				</div>
				<!-- <div class="area">
					<span></span>
					{{info.userNum}} {{info.nickName}}
				</div>-->
			</div>
			<el-button type="primary" class="send" @click="send()">发消息</el-button>
		</div>
	</div>
</template>

<script>
	import { mapState, mapMutation, mapGetters, mapActions } from "vuex";
	export default {
		data() {
			return {};
		},
		computed: {
			...mapGetters(["message", "user", "chatList", "friendList", "info"])
		},
		methods: {
			...mapActions(["setMessage", "setSelectChatId", "setChatList"]),
			send() {
				let chatList = this.chatList;
				let flag = false;
				let message = this.info;
				for (let i in chatList) {
					//如果有
					if (
						(chatList[i].userNum || chatList[i].groupNum) ==
						(this.info.userNum || this.info.groupNum)
					) {
						chatList[i].unRead = 0;
						flag = true;
						this.setMessage(chatList[i]);
						break;
					}
				}
				if (!flag) {
					message.messages = [];
					message.unRead = 0;
					chatList = [message, ...chatList];
					this.setMessage(message);
				}
				this.setSelectChatId(this.info.userNum || this.info.groupNum);
				this.setChatList(chatList);
				this.info.type == "oto"
					? this.$router.push("/chat/friend")
					: this.$router.push("/chat/group");
			}
		}
	};
</script>

<style scoped>
	.Info-wrapper {
		margin: 0 auto;
	}
	.newfriend {
		height: 60px;
		padding: 28px 0 0 30px;
		box-sizing: border-box;
		border-bottom: 1px solid #e7e7e7;
	}

	.nickName {
		font-size: 18px;
	}

	.friendInfo {
		padding: 0 90px;
	}

	.esInfo {
		display: flex;
		align-items: center;
		padding: 100px 0 45px 0;
	}

	.left {
		flex: 1;
	}

	.nickName {
		display: inline-block;
		font-size: 20px;
		margin-bottom: 16px;
	}

	.gender-male,
	.gender-female {
		display: inline-block;
		width: 18px;
		height: 18px;
		vertical-align: top;
		margin-top: 2px;
	}

	.gender-male {
		background-image: url("man.png");
		background-size: cover;
	}

	.gender-female {
		background-image: url("woman.png");
		background-size: cover;
	}

	.signature {
		font-size: 14px;
		color: rgba(153, 153, 153, 0.8);
	}

	.avatar {
		border-radius: 3px;
	}
	.detInfo {
		padding: 40px 0;
		border-top: 1px solid #e7e7e7;
		border-bottom: 1px solid #e7e7e7;
	}
	.zh,
	.remark,
	.area,
	.wxid {
		font-size: 14px;
		margin-top: 20px;
	}

	span {
		font-size: 14px;
		color: rgba(153, 153, 153, 0.8);
		margin-right: 40px;
	}

	.remark {
		margin-top: 0;
	}

	.send {
		position: relative;
		text-align: center;
		width: 140px;
		left: 115px;
		top: 50px;
		font-size: 14px;
	}
</style>

