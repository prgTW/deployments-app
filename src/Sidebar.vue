<template>
	<v-list dense subheader>
		<v-subheader>{{ owner }}</v-subheader>
		<v-layout row justify-center v-if="$apollo.queries.organization.loading">
			<v-flex xs10>
				<v-progress-linear indeterminate color="grey"></v-progress-linear>
			</v-flex>
		</v-layout>
		<v-list-tile
				:to="{name: 'repo_view', params: {owner: repository.node.owner.login, repo: repository.node.name, branch: repository.node.defaultBranchRef.name}}"
				v-for="repository in repositories"
				:key="`${repository.node.owner.login}-${repository.node.name}`"
		>
			<v-list-tile-content>
				<v-list-tile-title>
					{{ repository.node.name }}
				</v-list-tile-title>
			</v-list-tile-content>
			<v-list-tile-action>
				<v-btn
						v-if="isStarredRepository(repository.node.owner.login, repository.node.name)"
						small
						icon
						ripple
						@click.prevent="unstarRepository({owner: repository.node.owner.login, name: repository.node.name, branch: repository.node.defaultBranchRef.name})">
					<v-icon color="orange">star</v-icon>
				</v-btn>
				<v-btn
						v-else
						small
						icon
						ripple
						@click.prevent="starRepository({owner: repository.node.owner.login, name: repository.node.name, branch: repository.node.defaultBranchRef.name})"
				>
					<v-icon color="grey lighten-1">star_border</v-icon>
				</v-btn>
			</v-list-tile-action>
		</v-list-tile>
	</v-list>
</template>

<script>
	import {QUERY_ORGANISATION_REPOSITORIES} from "./queries";
	import _ from 'lodash';
	import {mapGetters, mapMutations} from 'vuex'

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
			...mapGetters([
				'isStarredRepository',
			]),
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
			...mapMutations([
				'starRepository',
				'unstarRepository'
			]),
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
