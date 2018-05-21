<template>
	<v-app :dark="dark">
		<v-navigation-drawer
				fixed
				:clipped="$vuetify.breakpoint.lgAndUp"
				app
				v-model="drawer"
		>
			<sidebar owner="DocPlanner"></sidebar>
		</v-navigation-drawer>
		<v-toolbar
				color="grey darken-3"
				dark
				app
				:clipped-left="$vuetify.breakpoint.lgAndUp"
				fixed
		>
			<v-toolbar-title style="width: 350px" class="ml-0 pl-3">
				<v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
				DocPlanner Deployments
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn icon @click.stop="dark=!dark">
				<v-icon :class="{'grey--text': dark}">highlight</v-icon>
			</v-btn>

			<avatar></avatar>

		</v-toolbar>
		<v-content>
			<v-container fluid fill-height>
				<v-layout justify-center align-center>
					<router-view :key="$route.fullPath"></router-view>
				</v-layout>
			</v-container>
		</v-content>
		<v-footer app class="grey lighten-4 hidden-md-and-down">
			<v-layout row wrap justify-center>
				<v-flex xs12 text-xs-center grey--text>
					&copy;2018 — <strong>DocPlanner</strong>
				</v-flex>
			</v-layout>
		</v-footer>
	</v-app>
</template>

<script>
	import Avatar from "./Avatar";
	import Sidebar from "./Sidebar";

	export default {
		components: {Sidebar, Avatar},
		data: () => ({
			dialog: false,
			drawer: null,
			dark: false,
		}),
		props: {
			source: String
		},
		methods: {
			showRepoView: function (owner, repo) {
				this.$router.push({
					name: 'repo_view',
					params: {owner, repo}
				})
			},
		},
	}
</script>

<style>
	.pulsating {
		-webkit-animation: pulse 2s ease-in-out;
		-moz-animation: pulse 2s ease-in-out;
		animation: pulse 2s ease-in-out;
		-webkit-animation-iteration-count: infinite;
		-moz-animation-iteration-count: infinite;
		animation-iteration-count: infinite;
	}

	@keyframes pulse {
		0% {
			-webkit-transform: scale(0.8);
		}
		25% {
			-webkit-transform: scale(0.8);
		}
		50% {
			-webkit-transform: scale(1.2);
		}
		75% {
			-webkit-transform: scale(1.2);
		}
		100% {
			-webkit-transform: scale(0.8);
		}
	}
</style>
