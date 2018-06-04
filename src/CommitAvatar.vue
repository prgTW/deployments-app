<template>
	<v-badge overlap left :color="commit.signature.isValid ? 'green' : 'red'"
			 v-if="commit.signature">
		<v-icon slot="badge" small color="white" v-if="commit.signature.isValid">done
		</v-icon>
		<v-icon slot="badge" small color="white" v-else>clear</v-icon>
		<v-list-tile-avatar>
			<img :src="commit.author.avatarUrl">
		</v-list-tile-avatar>
	</v-badge>
	<v-list-tile-avatar v-else>
		<img :src="commit.author.avatarUrl">
	</v-list-tile-avatar>
</template>
<script>
	export default {
		name: 'CommitAvatar',
		props: {
			commit: Object,
		}
	}
</script>
