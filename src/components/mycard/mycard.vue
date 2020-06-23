<!-- 最左边的选择框 -->
<template>
	<div class="mycard" v-if="user.userNum!=undefined">
		<header @click="info()">
			<div
				style="margin: 20px 12px 0 12px;;line-height:36px;text-align:center;width:36px;height:36px;background-color:#f2f2f2;color:#000000;font-size:14px;margin-right: 12px;"
			>{{user.realName.substr(0,1)}}</div>
		</header>
		<div class="navbar" @click="clearSearch()">
			<router-link :to="message.type=='oto'?'/chat/friend':'/chat/group'" tag="div" class="item">
				<el-badge :value="unread">
					<div :class="{on: 'chat'==routePath}" class="icon iconfont icon-xiaoxi"></div>
				</el-badge>
			</router-link>

			<router-link to="/friend" tag="div" class="item">
				<div :class="{on: 'friend'==routePath}" class="icon iconfont icon-yonghu"></div>
			</router-link>
		</div>
		<footer>
			<div class="icon iconfont icon-chuangjianketang item" @click="dialogVisible = true"></div>
			<div class="icon iconfont icon-Controlinfo- item"></div>
		</footer>
		<creategroupVue :dialogVisible="dialogVisible" @close="dialogClose"></creategroupVue>
	</div>
</template>

<script>
	import creategroupVue from "./../creategroup/creategroup.vue";
	import { mapState, mapMutation, mapGetters, mapActions } from "vuex";
	export default {
		data() {
			return {
				routePath: "",
				dialogVisible: false
			};
		},
		components: {
			creategroupVue
		},
		computed: {
			...mapGetters(["message", "user", "unread"])
		},
		watch: {
			$route() {
				this.routePath = this.$route.path;
				this.routePath = this.$route.path.split("/");
				this.routePath = this.routePath[1];
			}
		},
		mounted() {},
		methods: {
			...mapActions(["setSearch", "setInfo"]),
			clearSearch() {
				this.setSearch("");
			},
			dialogClose() {
				this.dialogVisible = !this.dialogVisible;
			},
			info() {
				this.setInfo(this.user);
				this.$router.push("/friend");
			}
		}
	};
</script>

<style scoped>
	.mycard {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.navbar {
		width: 100%;
		text-align: center;
	}

	.icon {
		font-size: 20px;
		box-sizing: border-box;
		color: rgb(173, 174, 175);
		opacity: 0.8;
		cursor: pointer;
	}

	.icon:active {
		color: #409eff;
	}
	.on {
		color: #409eff;
	}
	.icon:hover {
		opacity: 1;
	}

	.icon-msg,
	.icon-more {
		font-size: 22px;
	}

	.icon-msg {
		padding: 0 19px;
	}

	footer {
		position: absolute;
		bottom: 20px;
		width: 100%;
		text-align: center;
	}
	.item {
		padding: 15px;
	}
</style>
<style>
	.el-badge__content {
		border: none;
	}
</style>

