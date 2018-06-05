<template>
	<v-app :dark="isDark">
		<v-navigation-drawer
				fixed
				:clipped="$vuetify.breakpoint.lgAndUp"
				app
				v-model="drawer"
		>
			<starred></starred>
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
			<v-btn icon @click.stop="toggleDark()">
				<v-icon :class="{'grey--text': isDark}">highlight</v-icon>
			</v-btn>

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
					<strong>
						Made with ❤️ and dozens of 🤬 for <a href="https://www.docplanner.com" target="_blank">DocPlanner</a>
					</strong>
				</v-flex>
			</v-layout>
		</v-footer>
	</v-app>
</template>

<script>
	import Sidebar from "./Sidebar";
	import Starred from "./Starred";
	import {mapGetters, mapMutations} from 'vuex';

	export default {
		components: {Sidebar, Starred},
		data: () => ({
			dialog: false,
			drawer: null,
		}),
		props: {
			source: String
		},
		computed: {
			...mapGetters([
				'isDark',
			]),
		},
		methods: {
			...mapMutations([
				'toggleDark',
			]),
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
			transform: scale(1.0);
		}
		30% {
			transform: scale(1.0);
		}
		40% {
			transform: scale(1.15);
		}
		50% {
			transform: scale(1.0);
		}
		60% {
			transform: scale(1.15);
		}
		70% {
			transform: scale(1.0);
		}
		80% {
			transform: scale(1.0);
		}
		100% {
			transform: scale(1.0);
		}
	}
</style>
