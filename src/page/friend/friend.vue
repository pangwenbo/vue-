<template>
	<div class="content">
		<div class="friend-wrapper">
			<search></search>
			<friendlist></friendlist>
		</div>
		<div class="friendinfo">
			<info></info>
		</div>
	</div>
</template>

<script>
	import search from "../../components/search/search.vue";
	import friendlist from "../../components/friendlist/friendlist.vue";
	import info from "../../components/info/info.vue";
	export default {
		components: {
			search,
			friendlist,
			info
		}
	};
</script>

<style scoped>
	.content {
		display: flex;
		width: 800px;
		height: 100%;
	}

	.friend-wrapper {
		width: 250px;
		background: rgb(230, 230, 230);
	}

	.friendinfo {
		flex: 3;
	}
</style>