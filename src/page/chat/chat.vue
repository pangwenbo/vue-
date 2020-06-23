<template>
	<div class="content">
		<div class="msglist">
			<search></search>
			<chatlist></chatlist>
		</div>
		<div class="chatbox">
			<router-view></router-view>
			<v-text></v-text>
		</div>
	</div>
</template>

<script>
	import search from "../../components/search/search";
	import chatlist from "../../components/chatlist/chatlist";
	import vText from "../../components/text/text";
	export default {
		components: {
			search,
			chatlist,
			vText
		}
	};
</script>

<style scoped>
	.content {
		display: flex;
		width: 100%;
		height: 100%;
	}

	.msglist {
		width: 250px;
		background: rgb(230, 230, 230);
	}

	.chatbox {
		flex: 1;
	}
</style>
