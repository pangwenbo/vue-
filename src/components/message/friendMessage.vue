<!-- 消息框 -->
<template>
	<div class="message">
		<header class="header" v-if="message.userNum != undefined">
			<div class="friendname">{{message.nickName}}</div>
		</header>

		<div class="message-wrapper" ref="list">
			<div v-if="message.userNum != undefined">
				<div v-for="(item,index) in data" :key="index" class="message-item">
					<div class="time">
						<span v-if="item.gstime!=undefined">{{item.gstime}}</span>
					</div>
					<div class="main" :class="{ self: item.self }">
						<div class="avatar">{{item.self?user.realName.substr(0,1):message.realName.substr(0,1)}}</div>
						<div class="content" v-if="item.content.type=='text'">
							<div class="text" v-html="replaceFace(item.content.text)"></div>
						</div>
						<div class="content" v-if="item.content.type=='img'">
							<div class="text">
								<viewer>
									<img
										:src="item.content.url+'&token='+token"
										style="max-width:200px;height:100px;max-height:200px"
									/>
								</viewer>
							</div>
						</div>
						<div class="content" v-if="item.content.type=='file'">
							<div class="text">
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
		</div>
	</div>
</template>

<script>
	import time from "../../time.js";
	import { mapState, mapMutation, mapGetters, mapActions } from "vuex";
	export default {
		data() {
			return {
				token: "",
				data: []
			};
		},
		computed: {
			...mapGetters(["message", "user", "chatList", "emojis"])
		},
		watch: {
			chatList() {
				this.scollBottom();
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
			scollBottom() {
				//滚动到底部
				this.$nextTick(() => {
					this.$refs.list.scrollTop = this.$refs.list.scrollHeight;
				});
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

	.friendname {
		font-size: 18px;
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
	}

	.main {
	}

	.main .avatar {
		float: left;
		margin-left: 15px;
		border-radius: 3px;
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
		margin-left: 10px;
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
	.self.content :before {
		content: " ";
		position: absolute;
		top: 12px;
		right: 100%;
		border: 6px solid transparent;
		border-right-color: #fafafa;
	}
	.self .content:after {
		left: auto;
		right: -15px;
		border-color: transparent transparent transparent #fafafa;
	}
	.self {
		text-align: right;
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
	.ellipsis {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>
