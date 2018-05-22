<template>
	<div>
		<v-list
				dense
				subheader
				v-for="(repositories, owner) in groupedStarredRepositories"
		>
			<v-subheader>{{ owner }}</v-subheader>
			<v-list-tile
					:to="{name: 'repo_view', params: {owner: repository.owner, repo: repository.name}}"
					v-for="(repository) in repositories"
					:key="`starred-${repository.owner}-${repository.name}`"
			>
				<v-list-tile-content>
					<v-list-tile-title>
						{{ repository.name }}
					</v-list-tile-title>
				</v-list-tile-content>
				<v-list-tile-action>
					<v-btn icon ripple
						   @click.prevent="unstarRepository({owner: repository.owner, name: repository.name})">
						<v-icon color="orange">star</v-icon>
					</v-btn>
				</v-list-tile-action>
			</v-list-tile>
		</v-list>
		<v-divider/>
	</div>
</template>

<script>
	import {mapGetters, mapMutations} from 'vuex'

	export default {
		data: () => ({}),
		computed: {
			...mapGetters([
				'groupedStarredRepositories',
			]),
		},
		methods: {
			...mapMutations([
				'unstarRepository',
			]),
			showRepoView: function (owner, repo) {
				this.$router.push({
					name: 'repo_view',
					params: {owner, repo}
				})
			},
			toggleStar: function (repositoryName) {
				this.$store.commit('toggleStarredRepository', {
					repositoryName: repositoryName
				})
			}
		},
	}
</script>
