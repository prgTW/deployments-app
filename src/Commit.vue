<template>
	<div>
		<v-list-tile :avatar="$vuetify.breakpoint.smAndUp">
			<CommitAvatar :commit="commitData.commit"/>

			<CommitContent :commit="commitData.commit"/>

			<CommitLink :commit="commitData.commit"/>

			<ClusterInformation :commitData="commitData" v-if="$vuetify.breakpoint.mdAndUp"/>
		</v-list-tile>

		<v-layout row justify-end align-center mb-2 v-if="$vuetify.breakpoint.smAndDown">
			<ClusterInformation :commitData="commitData"/>
		</v-layout>
	</div>
</template>

<script>
	import ClusterInformation from "./ClusterInformation";
	import CommitAvatar from "./CommitAvatar";
	import CommitContent from "./CommitContent";
	import CommitLink from "./CommitLink";

	export default {
		name: "Commit",
		components: {CommitAvatar, CommitContent, CommitLink, ClusterInformation},
		props: {
			commitData: Object,
		}
	}
</script>

