<template>
	<span>
		<v-tooltip
				v-for="(stage, i) in cluster.stages"
				:key="i"
				top
		>
			<v-btn
					slot="activator"
					icon
					:small="$vuetify.breakpoint.xsOnly"
					:href="stage.href"
					target="_blank"
					:class="{
						'green white--text': 'success' === stage.state,
						'red white--text': 'failure' === stage.state,
						'orange white--text': 'in_progress' === stage.state,
						'grey lighten-3 grey--text': !isDark && 'idle' === stage.state,
						'grey darken-2 grey--text': isDark && 'idle' === cluster.state.state,
						'btn--disabled lighten-3': !stage.href,
						'pulsating': stage.inProgress,
						'mx-1': true,
					}"
			>
				<v-icon v-text="stage.data.icon" size="18"></v-icon>
			</v-btn>
			<span>{{ stage.tooltip }}</span>
		</v-tooltip>
	</span>
</template>

<script>
	import {mapGetters} from 'vuex';

	export default {
		name: 'UnnamedCluster',
		computed: {
			...mapGetters([
				'isDark',
			]),
		},
		props: {
			cluster: Object,
		}
	}
</script>
