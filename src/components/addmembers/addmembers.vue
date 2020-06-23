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
			<el-input placeholder="搜索" v-model="search" clearable>
				<template slot="prepend">
					<i class="icon iconfont icon-sousuo4" style="cursor: pointer;font-size:20px"></i>
				</template>
			</el-input>
			<br />
			<br />
			<div style="width:550px;height:400px;padding:0 5px">
				<div
					style="float:left;border:1px solid #f2f2f2;width:250px;height:400px;overflow-y:auto;overflow-x:hidden;padding:0 10px;overflow-x:hidden"
				>
					<el-checkbox-group v-model="friend" v-if="membersArr.length>0">
						<div v-for="(item,index) in membersArr" :key="index">
							<el-checkbox :label="item" v-if="user.userNum!=item.userNum">
								<div
									style="display:inline-block;line-height:36px;text-align:center;width:36px;height:36px;background-color:#409EFF;color:#fff;font-size:14px;margin:5px"
								>{{item.realName.substr(0,1)}}</div>
								<span style="padding:0 80px 0 0">{{item.nickName}}</span>
							</el-checkbox>
						</div>
					</el-checkbox-group>
				</div>
				<div
					style="float:right;border:1px solid #f2f2f2;width:250px;height:400px;overflow-y:auto;padding:0 10px;overflow-x:hidden"
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
	export default {
		name: "creategroup",
		props: {
			dialogVisible: Boolean,
			type: String
		},
		data() {
			return {
				search: "",
				friend: [],
				list: [],
				userArr: [],
				membersArr: [],
				arrList: []
			};
		},
		computed: {
			...mapGetters(["message", "user", "friendList"])
		},
		watch: {
			dialogVisible: {
				immediate: true,
				handler() {
					if (this.type == "add") {
						this.getAddMember();
					} else {
						this.getDelMember();
					}
					this.friend = [];
					this.userArr = [];
					this.search = "";
				}
			},
			search() {
				this.searchMember();
			}
		},
		methods: {
			searchMember() {
				if (this.search == "") {
					this.membersArr = this.arrList;
				} else {
					let data = this.arrList.filter(
						friends =>
							(friends.userName || friends.groupName).indexOf(
								this.search
							) != -1 ||
							(friends.nickName || friends.groupName).indexOf(
								this.search
							) != -1
					);

					this.membersArr = data;
				}
			},
			async getDelMember() {
				let res = await this.$axios.post(
					"/api/friends/getGroupMembers",
					this.$qs.stringify({
						userNum: this.user.userNum,
						groupNum: this.message.groupNum
					})
				);
				if (res.head.code != "000") return;
				this.membersArr = res.body.data;
				this.arrList = this.membersArr;
			},
			async getAddMember() {
				let res = await this.$axios.post(
					"/api/friends/getGroupMembers",
					this.$qs.stringify({
						userNum: this.user.userNum,
						groupNum: this.message.groupNum
					})
				);
				if (res.head.code != "000") return;
				let membersRes = res.body.data;
				//获取用户数据
				res = await this.$axios.post(
					"/api/friends/getFriendsList",
					this.$qs.stringify({
						userNum: this.user.userNum
					})
				);
				if (res.head.code != "000") return;
				let friendsRes = res.body.data;
				let friendsArr = [];
				for (let k in friendsRes) {
					if (friendsRes[k].type == "oto") {
						friendsArr.push(friendsRes[k]);
					}
				}
				for (let i in friendsArr) {
					for (let j in membersRes) {
						if (friendsArr[i].userNum == membersRes[j].userNum) {
							friendsArr.splice(i, 1);
						}
					}
				}
				this.membersArr = friendsArr;
				this.arrList = this.membersArr;
			},
			async submit() {
				for (let i in this.friend) {
					this.userArr.push(this.friend[i].userNum);
				}
				let groupMembersRes = await this.$axios.post(
					this.type == "add"
						? "/api/friends/addGroupMembers"
						: "/api/friends/deleteGroupMembers",
					this.$qs.stringify({
						userNum: this.user.userNum,
						groupNum: this.message.groupNum,
						memberList: this.userArr.join(",")
					})
				);
				//通知相关用户
				if (groupMembersRes.head.code != "000") return;
				this.userArr.push(this.user.userNum);
				let RefreshMessageRes = await this.$axios.post(
					"/api/message/RefreshMessage",
					this.$qs.stringify({
						groupNum: this.message.groupNum,
						memberList: this.userArr.join(",")
					})
				);
				this.$notify({
					title: "群消息提示",
					type: "success",
					message: this.type == "add" ? "添加成功" : "删除成功",
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
