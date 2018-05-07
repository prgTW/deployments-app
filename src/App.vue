<template>
	<v-app id="inspire">
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
									{{ child.text }}
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
			<v-text-field
					flat
					solo-inverted
					prepend-icon="search"
					label="Search"
					class="hidden-sm-and-down"
			></v-text-field>
			<v-spacer></v-spacer>
			<v-btn icon>
				<v-icon>apps</v-icon>
			</v-btn>
			<v-btn icon>
				<v-icon>notifications</v-icon>
			</v-btn>
			<v-btn icon large>
				<v-avatar size="32px">
					<img src="//ssl.gstatic.com/s2/oz/images/sge/grey_silhouette.png">
				</v-avatar>
			</v-btn>
		</v-toolbar>
		<v-content>
			<v-container fluid fill-height>
				<v-layout justify-center align-center>
					<router-view></router-view>
				</v-layout>
			</v-container>
		</v-content>
	</v-app>
</template>

<script>
	export default {
		data: () => ({
			dialog: false,
			drawer: null,
			items: [
				{
					icon: 'keyboard_arrow_up',
					'icon-alt': 'keyboard_arrow_down',
					text: 'DocPlanner',
					model: true,
					children: [
						{icon: 'link', text: 'monolith-app', owner: 'DocPlanner', repo: 'monolith-app'}
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
			}
		}
	}
</script>
