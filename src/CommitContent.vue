<template>
	<v-list-tile-content>
		<v-list-tile-title>
			<strong v-html="commit.messageHeadlineHTML"></strong>
		</v-list-tile-title>
		<v-list-tile-sub-title>
			<a :href="commit.author.user.url"
			   target="_blank"
			   class="grey--text"
			   v-if="commit.author.user && commit.author.user.login"
			><strong>{{ commit.author.user.login }}</strong></a>
			<strong v-else class="grey--text">
				{{ commit.author.name }}
			</strong>
			<span v-if="!commit.authoredByCommitter">authored and</span>
			<span v-else>committed</span>

			<span v-if="!commit.authoredByCommitter">
				<a :href="commit.committer.user.url"
				   target="_blank"
				   class="grey--text"
				   v-if="commit.committer.user && commit.committer.user.login"
				><strong>{{ commit.committer.user.login }}</strong></a>
				<strong class="grey--text" v-else>
					{{ commit.committer.name }}
				</strong>
				<span v-if="!commit.authoredByCommitter">committed</span>
			</span>

			<span :title="commit.committedDate">
				<RelativeTime :date="commit.committedDate"></RelativeTime>
			</span>
		</v-list-tile-sub-title>
	</v-list-tile-content>
</template>
<script>
	import RelativeTime from './RelativeTime'

	export default {
		name: 'CommitContent',
		components: {RelativeTime},
		props: {
			commit: Object,
		}
	}
</script>
