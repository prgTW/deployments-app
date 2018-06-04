<template>
	<div v-if="commitData.state">
		<template v-for="(cluster, i) in commitData.state">
			<NamedCluster v-if="cluster.name" :key="i" :cluster="cluster"/>
			<UnnamedCluster v-else :key="i" :cluster="cluster"/>
		</template>
	</div>
</template>
<script>
	import NamedCluster from './NamedCluster'
	import UnnamedCluster from "./UnnamedCluster"

	export default {
		name: 'ClusterInformation',
		components: {NamedCluster, UnnamedCluster},
		props: {
			commitData: Object
		}
	}
</script>
