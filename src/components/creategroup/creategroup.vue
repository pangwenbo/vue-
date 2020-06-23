<template>
	<div>
		<el-dialog
			:visible.sync="dialogVisible"
			width="600px"
			:destroy-on-close="true"
			:modal="false"
			top="5vh"
			:before-close="handleClose"
		>
			<div>
				<div style="float:left;width:50%;padding:5px; box-sizing:border-box;overflow-x:hidden">
					<el-input placeholder="搜索" v-model="search" clearable>
						<template slot="prepend">
							<i class="icon iconfont icon-sousuo4" style="cursor: pointer;font-size:20px"></i>
						</template>
					</el-input>
				</div>
				<div style="float:right;width:50%;padding:5px; box-sizing:border-box;overflow-x:hidden">
					<el-input placeholder="群名称" v-model="groupName">
						<template slot="prepend">
							<i class="el-icon-edit" style="cursor: pointer;font-size:20px"></i>
						</template>
					</el-input>
				</div>
			</div>

			<br />
			<br />
			<div style="width:550px;height:400px;padding:0 5px">
				<div
					style="float:left;border:1px solid #f2f2f2;width:250px;height:400px;overflow-y:auto;overflow-x:hidden;padding:0 10px"
				>
					<el-checkbox-group v-model="friend">
						<div v-for="(item,index) in list" :key="index">
							<el-checkbox
								:label="item"
								v-if="item.type=='oto'&&user.userNum!=(item.userNum||item.groupNum)"
							>
								<div
									style="display:inline-block;line-height:36px;text-align:center;width:36px;height:36px;background-color:#409EFF;color:#fff;font-size:14px;margin:5px"
								>{{item.realName.substr(0,1)}}</div>
								<span style="padding:0 80px 0 0">{{item.nickName}}</span>
							</el-checkbox>
						</div>
					</el-checkbox-group>
				</div>
				<div
					style="float:right;border:1px solid #f2f2f2;width:250px;height:400px;overflow:auto;padding:0 10px"
				>
					<div
						v-for="(item,index) in friend"
						:key="index+'friend'"
						style="width:250px;cursor:pointer;line-height:36px;"
						@click="delIndex(index)"
					>
						<div
							style="display:inline-block;line-height:36px;text-align:center;width:36px;height:36px;background-color:#409EFF;color:#fff;margin:5px"
						>{{item.realName.substr(0,1)}}</div>
						<span>{{item.nickName}}</span>
						<img
							style="float:right;padding:5px 0 0 0"
							width="30"
							height="30"
							:src="require('../search/delete.png')"
						/>
					</div>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="handleClose()">取 消</el-button>
				<el-button type="primary" @click="submit()">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
	import { mapState, mapMutation, mapGetters, mapActions } from "vuex";
	import friendlistVue from "../friendlist/friendlist.vue";
	export default {
		name: "creategroup",
		props: {
			dialogVisible: Boolean
		},
		data() {
			return {
				search: "",
				friend: [],
				list: [],
				groupName: "",
				userArr: []
			};
		},
		computed: {
			...mapGetters(["message", "user", "friendList"])
		},
		watch: {
			dialogVisible(newValue, oldValue) {
				this.friend = [];
				this.userArr = [];
				this.list = this.friendList;
				this.search = "";
				this.groupName = "";
			},
			search() {
				this.searchData();
			}
		},
		methods: {
			searchData() {
				if (this.search == "") {
					this.list = this.friendList;
				} else {
					let data = this.friendList.filter(
						friends =>
							(friends.userName || friends.groupName).indexOf(
								this.search
							) != -1 ||
							(friends.nickName || friends.groupName).indexOf(
								this.search
							) != -1
					);

					this.list = data;
				}
			},
			async submit() {
				if (this.groupName == "") {
					this.$message.error("请输入群名称");
					return;
				}
				//创建群
				let addGroupRes = await this.$axios.post(
					"/api/friends/addGroup",
					this.$qs.stringify({
						userNum: this.user.userNum,
						groupName: this.groupName
					})
				);
				//添加群成员
				if (addGroupRes.head.code != "000") {
					this.$message.error(addGroupRes.head.message);
					return;
				}
				if (this.friend.length != 0) {
					for (let i in this.friend) {
						this.userArr.push(this.friend[i].userNum);
					}
					let addGroupMembersRes = await this.$axios.post(
						"/api/friends/addGroupMembers",
						this.$qs.stringify({
							userNum: this.user.userNum,
							groupNum: addGroupRes.body.data.groupNum,
							memberList: this.userArr.join(",")
						})
					);
					//通知相关用户
					if (addGroupMembersRes.head.code != "000") {
						this.$message.error(addGroupMembersRes.head.message);
						return;
					}
				}
				this.userArr.push(this.user.userNum);
				let RefreshMessageRes = await this.$axios.post(
					"/api/message/RefreshMessage",
					this.$qs.stringify({
						memberList: this.userArr.join(","),
						groupNum: addGroupRes.body.data.groupNum
					})
				);
				this.$notify({
					title: "群消息提示",
					type: "success",
					message: "创建成功",
					position: "top-right"
				});
				this.handleClose();
			},
			handleClose() {
				this.$emit("close");
			},
			toggle(index) {
				this.$refs.checkboxes[index].toggle();
			},
			delIndex(index) {
				this.friend.splice(index, 1);
			},
			filterData() {
				let friends = this.friendList.filter(
					friends => friends.remark.indexOf(this.search) != -1
				);
				if (this.search == "") {
					friends = [];
				}
				this.$store.dispatch("setFriendListFilter", friends);
			}
		}
	};
</script>
<style scoped>
	.avatar {
		width: 36px;
		height: 36px;
		margin: 20px 12px 0 12px;
		border-radius: 2px;
	}
</style>
<style>
	.el-checkbox__inner {
	}

	.el-dialog__body {
		padding: 10px 20px;
		margin: 0 auto;
	}
</style>
