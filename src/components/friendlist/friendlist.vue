<!-- 好友列表 -->
<template>
	<div class="friendlist" v-if="search==''">
		<div class="list_title">群组</div>
		<div v-for="(item,index) in friendList" :key="index+'group'">
			<div class="frienditem" v-if="item.type=='otm'">
				<div
					class="friend-info"
					:class="{ active: item.groupNum === selectFriendId }"
					@click="selectFriend(item)"
				>
					<div
						style=";line-height:36px;text-align:center;width:36px;height:36px;background-color:#409EFF;color:#fff;font-size:14px;margin-right: 12px;"
					>群</div>
					<div class="remark">{{item.groupName}}</div>
				</div>
			</div>
		</div>
		<div class="list_title">联系人</div>
		<div v-for="(item,index) in friendList" :key="index+'info'">
			<div class="frienditem" v-if="item.type=='oto'">
				<div
					class="friend-info"
					:class="{ active: item.userNum === selectFriendId }"
					@click="selectFriend(item)"
				>
					<div
						style=";line-height:36px;text-align:center;width:36px;height:36px;background-color:#409EFF;color:#fff;font-size:14px;margin-right: 12px;"
					>{{item.realName.substr(0,1)}}</div>
					<div class="remark">{{item.nickName}}</div>
				</div>
			</div>
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
			...mapGetters(["user", "friendList", "selectFriendId", "search"])
		},
		mounted() {
			console.log("friend");
		},
		methods: {
			...mapActions(["setSelectFriendId", "setInfo"]),
			selectFriend(value) {
				this.setSelectFriendId(value.groupNum || value.userNum);
				this.setInfo(value);
			}
		}
	};
</script>

<style scoped>
	.friendlist {
		height: 92%;
		overflow-y: auto;
	}

	.noborder {
		border-top: none;
	}

	.frienditem {
		border-bottom: 1px solid #dadada;
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
		background-color: rgb(220, 220, 220);
		cursor: pointer;
	}

	.friend-info:active {
		background-color: #c4c4c4;
	}
	.active {
		background-color: #c4c4c4;
	}
	.avatar {
		border-radius: 2px;
		margin-right: 12px;
	}

	.remark {
		font-size: 14px;
		line-height: 36px;
	}
</style>
