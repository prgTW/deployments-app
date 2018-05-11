<template>
	<v-list dense subheader>
		<v-subheader>{{ organization.login }}</v-subheader>
		<v-list-tile
				:to="{name: 'repo_view', params: {owner: repository.node.owner.login, repo: repository.node.name, branch: repository.node.defaultBranchRef.name}}"
				v-for="(repository, i) in repositories"
				:key="i"
		>
			<v-list-tile-content>
				<v-list-tile-title>
					{{ repository.node.name }}
				</v-list-tile-title>
			</v-list-tile-content>
			<v-list-tile-action>
				<v-btn icon ripple>
					<v-icon color="grey lighten-1">star_border</v-icon>
				</v-btn>
			</v-list-tile-action>
		</v-list-tile>
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
						owner: this.owner
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
