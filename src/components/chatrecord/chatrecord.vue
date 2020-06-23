<template>
	<div>
		<!--visible.sync打开关闭-->
		<el-dialog
			:fullscreen="true"
			:lock-scroll="true"
			:visible.sync="dialogVisible"
			width="600px"
			height="600px"
			:destroy-on-close="true"
			:modal="false"
			top="5vh"
			:before-close="handleClose"
			:show-close="false"
		>
			<i slot="title" style="cursor: pointer;" class="el-icon-arrow-left" @click="handleClose()">
				<span>聊天记录</span>
			</i>

			<div style="overflow-y:auto">
				<div style="position: -webkit-sticky;position: sticky;top: 0;z-index: 10;height:100px">
					<el-tabs v-model="infoData.type" @tab-click="handleClick">
						<el-tab-pane label="全部" name></el-tab-pane>
						<el-tab-pane label="文本" name="text"></el-tab-pane>
						<el-tab-pane label="图片" name="img"></el-tab-pane>
						<el-tab-pane label="文件" name="file"></el-tab-pane>
					</el-tabs>
					<div style="width:100%">
						<div style="float:left">
							<el-input placeholder="搜索" v-model="infoData.messageContent"></el-input>
						</div>
						<div style="float:left">
							<el-date-picker v-model="infoData.time" align="right" type="date" placeholder="选择日期"></el-date-picker>
						</div>
						<el-button style="float:left" type="primary" icon="el-icon-search" @click="getData">搜索</el-button>
					</div>
				</div>
				<div style="height:400px;overflow-y:auto;margin:10px 0">
					<div v-for="(item,index) in data" :key="index" class="message-item">
						<div class="time">
							<span v-if="item.gstime!=undefined">{{item.gstime}}</span>
						</div>
						<div class="main" :class="{ self: item.self }">
							<div class="avatar">{{item.self ?user.realName.substr(0,1):item.fromName.substr(0,1)}}</div>
							<div class="msgname" v-if="message.type=='otm'">{{item.fromName}}</div>
							<div class="content" v-if="item.messageContent.type=='text'">
								<div class="text" v-html="replaceFace(item.messageContent.text)"></div>
							</div>
							<div class="content" v-if="item.messageContent.type=='img'">
								<div class="text">
									<viewer>
										<img
											:src="item.messageContent.url+'&token='+token"
											style="max-width:200px;height:100px;max-height:200px"
										/>
									</viewer>
								</div>
							</div>
							<div class="content" v-if="item.messageContent.type=='file'">
								<div class="text">
									<div style="width:200px;height:100px;text-align:center">
										<a
											style="height:30px;line-height:30px;color:blue"
											:href="item.messageContent.url+'&token='+token"
											target="_blank"
										>
											<div
												class="ellipsis"
												style="height:70px;line-height:70px;border-bottom:1px solid #f2f2f2"
											>{{item.messageContent.text}}</div>
											<span>下载({{item.messageContent.size}})</span>
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<el-pagination
				@size-change="f_sizeChange"
				@current-change="f_currentChange"
				:current-page="paginations.pageNum"
				:page-sizes="[10,20,30,50,100]"
				:page-size="paginations.pageSize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="paginations.totalRowNum"
			></el-pagination>
		</el-dialog>
	</div>
</template>
<script>
	import moment from "moment";
	import time from "../../time.js";
	import { mapState, mapMutation, mapGetters, mapActions } from "vuex";
	export default {
		name: "chatrecord",
		props: {
			dialogVisible: Boolean
		},
		data() {
			return {
				infoData: {
					type: "",
					messageClassify: "",
					userNum: "",
					targetNum: "",
					messageContent: "",
					sendTime: "",
					messageType: "",
					token: "",
					time: ""
				},

				paginations: {
					pageNum: 1, // 当前页
					totalRowNum: 0, // 总数
					pageSize: 10 // 1页显示多少条
				},
				data: []
			};
		},
		computed: {
			...mapGetters(["message", "user", "chatList", "emojis"])
		},
		watch: {
			dialogVisible(newValue, oldValue) {
				this.token = localStorage.getItem("token");
				this.infoData = {
					messageClassify: this.message.type,
					userNum: this.user.userNum,
					targetNum: this.message.userNum || this.message.groupNum,
					messageContent: "",
					sendTime: "",
					messageType: ""
				};
				this.paginations = {
					pageNum: 1, // 当前页
					totalRowNum: 0, // 总数
					pageSize: 10 // 1页显示多少条
				};
				this.getData();
			}
		},
		methods: {
			handleClose() {
				this.$emit("close");
			},
			async getData() {
				this.infoData.messageType = this.infoData.type;
				if (this.infoData.time != null) {
					this.infoData.sendTime = moment(this.infoData.time).format(
						"YYYY-MM-DD"
					);
				} else {
					this.infoData.sendTime = "";
				}

				console.log(this.infoData.sendTime);
				if (this.infoData.type == 0) {
					this.infoData.messageType = "";
				}
				let res = await this.$axios.post(
					"/api/message/searchMessageRecord",
					this.$qs.stringify({
						...this.infoData,
						...this.paginations
					})
				);
				this.data = res.body.data;
				for (let i in this.data) {
					this.data[i].messageContent = JSON.parse(
						this.data[i].messageContent
					);
					this.data[i].gstime = time.gettime.getChatTime(
						this.data[i].sendTime,
						i > 0 ? this.data[i - 1].sendTime : 0
					);
				}
				this.paginations = res.body.pageInfo;
			},
			f_sizeChange(val) {
				this.paginations.pageSize = val;
				this.getData();
			},
			f_currentChange(val) {
				this.paginations.pageNum = val;
				this.getData();
			},
			handleClick() {
				this.paginations = {
					pageNum: 1, // 当前页
					totalRowNum: 0, // 总数
					pageSize: 10 // 1页显示多少条
				};
				this.getData();
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
			// 将日期过滤为 hour:minutes
			time(date) {
				return moment(date).format("YYYY-MM-DD HH:mm:ss");
			}
		}
	};
</script>
<style scoped>
	.message {
		width: 100%;
		min-width: 600px;
		height: calc(100% - 265px);
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

	.main .avatar {
		float: left;
		margin-left: 15px;
		border-radius: 3px;
		display: inline-block;
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
	.main.content :before {
		content: " ";
		position: absolute;
		top: 12px;
		right: 100%;
		border: 6px solid transparent;
		border-right-color: #fafafa;
	}
	.main .msgname {
		margin: 0 0 5px 60px;
		font-size: 10px;
		color: #7f7e7d;
	}
	.self .content:after {
		left: auto;
		right: -15px;
		border-color: transparent transparent transparent #fafafa;
	}
	.self .msgname {
		margin: 0 60px 5px 0;
		font-size: 10px;
		color: #7f7e7d;
	}
	.self {
		text-align: right;
	}

	.self .avatar {
		float: right;
		margin: 0 15px;
		display: inline-block;
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
		/* background-color: #b2e281; */
		max-width: 500px;
	}

	.self > .content:before {
		right: -12px;
		vertical-align: middle;
		border-right-color: transparent;
		/* border-left-color: #b2e281; */
	}
	.ellipsis {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>