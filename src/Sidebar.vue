<template>
	<v-list dense>
		<v-layout row>
			<v-flex>
				<v-list-tile v-if="organization">
					<v-list-tile-avatar size="24">
						<img :src="organization.avatarUrl">
					</v-list-tile-avatar>
					<v-subheader>
						{{ organization.login }}
					</v-subheader>
				</v-list-tile>
			</v-flex>
		</v-layout>
		<v-list subheader>
			<v-list-tile
					avatar
					:to="{name: 'repo_view', params: {owner: repository.node.owner.login, repo: repository.node.name}}"
					v-for="(repository, i) in repositories"
					:key="i"
			>

				<v-list-tile-action>
					<v-icon>business</v-icon>
				</v-list-tile-action>
				<v-list-tile-content>
					<v-list-tile-title>
						{{ repository.node.name }}
					</v-list-tile-title>
				</v-list-tile-content>
				<v-list-tile-action>
					<v-btn icon ripple>
						<v-icon color="grey lighten-1">info</v-icon>
					</v-btn>
				</v-list-tile-action>
			</v-list-tile>
		</v-list>
	</v-list>
</template>

<script>
	import {QUERY_ORGANISATION_REPOSITORIES} from "./queries";
	import _ from 'lodash';

	export default {
		apollo: {
			organization: {
				fetchPolicy: 'no-cache',
				query: QUERY_ORGANISATION_REPOSITORIES,
				variables: function () {
					return {
						owner: 'DocPlanner'
					}
				},
				result: function () {
					this.isError = false
					this.isLoading = false
				},
				error: () => {
					this.isError = true
					this.isLoading = false
				},
			},
		},
		data: () => ({
			isError: false,
			isLoading: true,
		}),
		computed: {
			repositories() {
				if (this.isError || this.isLoading) {
					return [];
				}

				return _.filter(this.organization.repositories.edges, (repository) => {
					return _.endsWith(repository.node.name, '-app');
				});
			}
		},
		methods: {
			showRepoView: function (owner, repo) {
				this.$router.push({
					name: 'repo_view',
					params: {owner, repo}
				})
			},
		},
		props: {
			owner: String
		}
	}
</script>
