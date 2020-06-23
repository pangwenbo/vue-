<!-- 搜索框 -->
<template>
	<div>
		<div class="wrapper">
			<div class="search-wrapper">
				<input
					type="text"
					class="searchInput"
					v-model="searchValue"
					@keyup="filterData()"
					placeholder="搜索"
				/>
				<i class="icon iconfont icon-sousuo4" style="margin:5px;font-size:14px" v-show="noText"></i>
				<div class="searchInput-delete" v-show="haveText" @click="del"></div>
			</div>
		</div>

		<!-- 好友列表 -->
		<div class="friendlist" v-if="search!=''">
			<div v-for="(item,index) in friendListFilter" :key="index">
				<div class="frienditem">
					<div class="friend-info" @click="send(item)">
						<div v-if="item.type=='otm'" class="avatar">群</div>
						<div v-else class="avatar">{{item.realName.substr(0,1)}}</div>
						<div class="remark">{{item.groupName||item.nickName}}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapState, mapMutation, mapGetters, mapActions } from "vuex";
	export default {
		data() {
			return {
				searchValue: "",
				active: false,
				allFriendList: [],
				allChatList: []
			};
		},
		computed: {
			...mapGetters([
				"friendList",
				"user",
				"chatList",
				"friendListFilter",
				"search",
				"message",
				"info"
			]),
			noText() {
				if (this.search === "") return true;
				return false;
			},
			haveText() {
				if (this.search === "") return false;
				return true;
			}
		},
		watch: {
			searchValue() {
				this.setSearch(this.searchValue);
			},
			search() {
				this.filterData();
			}
		},
		methods: {
			...mapActions([
				"setSearch",
				"setFriendListFilter",
				"setSelectFriendId",
				"setInfo",
				"setMessage",
				"setSelectChatId",
				"setSelectFriendId",
				"setChatList"
			]),
			del() {
				this.searchValue = "";
				this.setSearch("");
				this.setFriendListFilter([]);
			},
			filterData() {
				let friends = this.friendList.filter(
					friends =>
						(friends.userName || friends.groupName).indexOf(
							this.search
						) != -1 ||
						(friends.nickName || friends.groupName).indexOf(
							this.search
						) != -1
				);
				if (this.search == "") {
					friends = [];
				}
				this.setFriendListFilter(friends);
			},
			send(value) {
				this.setSelectFriendId(value.userNum || value.groupNum);
				this.setInfo(value);
				this.del();
				this.$router.push("/friend");
			}
		}
	};
</script>

<style  scoped>
	.wrapper {
		padding: 22px 12px 12px 12px;
	}

	.search-wrapper {
		position: relative;
		display: flex;
		box-sizing: border-box;
		height: 26px;
		width: 100%;
		background-color: #e5e3e2;
		border: 1px solid #d9d7d6;
		border-radius: 2px;
	}

	.searchInput {
		flex: 1;
		font-size: 12px;
		padding: 6px;
		background-color: #e5e3e2;
		outline: none;
	}

	.searchInput:focus {
		background-color: #f2efee;
	}

	.icon-search {
		display: inline-block;
		width: 24px;
		height: 24px;
		font-size: 14px;
		line-height: 24px;
		text-align: center;
	}

	.searchInput-delete {
		display: block;
		position: absolute;
		outline: none;
		top: 0;
		right: 0;
		width: 24px;
		height: 100%;
		background-image: url("delete.png");
		background-size: 26px;
		background-position: center;
		background-repeat: no-repeat;
		cursor: pointer;
	}

	.friendlist {
		height: 92%;
		overflow-y: auto;
	}

	.noborder {
		border-top: none;
	}

	.frienditem {
		border-top: 1px solid rgb(220, 220, 220, 0.2);
	}

	.list_title {
		box-sizing: border-box;
		width: 100%;
		font-size: 12px;
		padding: 15px 0 3px 12px;
		color: #999;
	}

	.friend-info {
		display: flex;
		padding: 12px;
		font-size: 0;
	}

	.friend-info:hover {
		background-color: rgb(220, 220, 220, 0.2);
		cursor: pointer;
	}

	.friend-info:active {
		background-color: rgb(220, 220, 220, 0.2);
	}
	.active {
		background-color: rgb(220, 220, 220, 0.2);
	}
	.avatar {
		border-radius: 2px;
		margin-right: 12px;
	}

	.remark {
		font-size: 14px;
		line-height: 36px;
	}
	.avatar {
		line-height: 36px;
		text-align: center;
		width: 36px;
		height: 36px;
		background-color: #409eff;
		color: #fff;
		font-size: 14px;
		margin-right: 12px;
	}
</style>
