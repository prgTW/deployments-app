<template>
	<v-app :dark="dark">
		<v-navigation-drawer
				fixed
				:clipped="$vuetify.breakpoint.lgAndUp"
				app
				v-model="drawer"
		>
			<v-list dense>
				<template v-for="item in items">
					<v-layout
							row
							v-if="item.heading"
							align-center
							:key="item.heading"
					>
						<v-flex xs6>
							<v-subheader v-if="item.heading">
								{{ item.heading }}
							</v-subheader>
						</v-flex>
						<v-flex xs6 class="text-xs-center">
							<a href="#!" class="body-2 black--text">EDIT</a>
						</v-flex>
					</v-layout>
					<v-list-group
							v-else-if="item.children"
							v-model="item.model"
							:key="item.text"
							:prepend-icon="item.model ? item.icon : item['icon-alt']"
							append-icon=""
					>
						<v-list-tile slot="activator">
							<v-list-tile-content>
								<v-list-tile-title>
									{{ item.text }}
								</v-list-tile-title>
							</v-list-tile-content>
						</v-list-tile>
						<v-list-tile
								v-for="(child, i) in item.children"
								:key="i"
								@click="showRepoView(child.owner, child.repo)"
						>
							<v-list-tile-action v-if="child.icon">
								<v-icon>{{ child.icon }}</v-icon>
							</v-list-tile-action>
							<v-list-tile-content>
								<v-list-tile-title>
									{{ child.repo }}
								</v-list-tile-title>
							</v-list-tile-content>
						</v-list-tile>
					</v-list-group>
					<v-list-tile v-else @click="" :key="item.text">
						<v-list-tile-action>
							<v-icon>{{ item.icon }}</v-icon>
						</v-list-tile-action>
						<v-list-tile-content>
							<v-list-tile-title>
								{{ item.text }}
							</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
				</template>
			</v-list>
		</v-navigation-drawer>
		<v-toolbar
				color="blue darken-3"
				dark
				app
				:clipped-left="$vuetify.breakpoint.lgAndUp"
				fixed
		>
			<v-toolbar-title style="width: 300px" class="ml-0 pl-3" @click="$router.push({path: '/'})">
				<v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
				<span class="hidden-sm-and-down">
					Deployments
				</span>
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-btn icon @click="dark=!dark">
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

	export default {
		components: {Avatar},
		data: () => ({
			dialog: false,
			drawer: null,
			dark: false,
			items: [
				{
					icon: 'keyboard_arrow_up',
					'icon-alt': 'keyboard_arrow_down',
					text: 'Buddy',
					model: true,
					children: [
						{icon: 'link', owner: 'DocPlanner', repo:'booking-front-app'},
						{icon: 'link', owner: 'DocPlanner', repo:'brag-app'},
						{icon: 'link', owner: 'DocPlanner', repo:'crm-app'},
						{icon: 'link', owner: 'DocPlanner', repo:'dashboard-app'},
						{icon: 'link', owner: 'DocPlanner', repo:'dp-icons'},
						{icon: 'link', owner: 'DocPlanner', repo:'dp-ui-kit'},
						{icon: 'link', owner: 'DocPlanner', repo:'fetcher-app'},
						{icon: 'link', owner: 'DocPlanner', repo:'hubspot-mirroring-app'},
						{icon: 'link', owner: 'DocPlanner', repo:'integrations-app'},
						{icon: 'link', owner: 'DocPlanner', repo:'logger-app'},
						{icon: 'link', owner: 'DocPlanner', repo:'monolith-app'},
						{icon: 'link', owner: 'DocPlanner', repo:'mydentista'},
						{icon: 'link', owner: 'DocPlanner', repo:'opinion-moderation-app'},
						{icon: 'link', owner: 'DocPlanner', repo:'opinions-app'},
						{icon: 'link', owner: 'DocPlanner', repo:'payments-app'},
						{icon: 'link', owner: 'DocPlanner', repo:'reservation-app'},
						{icon: 'link', owner: 'DocPlanner', repo:'sso-app'},
						{icon: 'link', owner: 'DocPlanner', repo:'voicemail-app'},
						{icon: 'link', owner: 'DocPlanner', repo:'websites-app'},
					]
				},
				{
					icon: 'keyboard_arrow_up',
					'icon-alt': 'keyboard_arrow_down',
					text: 'Old deployment',
					model: true,
					children: [
						{icon: 'link', owner: 'DocPlanner', repo: 'metrix-app'},
						{icon: 'link', owner: 'DocPlanner', repo: 'deployments-app'},
					]
				},
			]
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
