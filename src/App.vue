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
				color="blue darken-3"
				dark
				app
				:clipped-left="$vuetify.breakpoint.lgAndUp"
				fixed
		>
			<v-toolbar-title style="width: 300px" class="ml-0 pl-3" @click.stop="$router.push({path: '/'})">
				<v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
				<span class="hidden-sm-and-down">
					Deployments
				</span>
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
