<template>
	<v-list two-line subheader>
		<v-subheader>
			<v-icon small>access_time</v-icon>
			<span>{{ date }}</span>
		</v-subheader>

		<Commit
				v-for="commitData in commits"
				:key="commitData.commit.abbreviatedOid"
				:commitData="commitData"
		/>

		<v-divider></v-divider>
	</v-list>
</template>

<script>
	import Commit from "./Commit";

	export default {
		name: "CommitsList",
		components: {Commit},
		props: {
			date: String,
			commits: Array,
		},
	}
</script>
