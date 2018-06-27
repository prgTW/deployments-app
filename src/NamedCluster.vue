<template>
	<span>
		<v-chip
				disabled
				small
				:class="{
					'green white--text': 'success' === cluster.state.state,
					'red white--text': 'failure' === cluster.state.state,
					'orange white--text': 'in_progress' === cluster.state.state,
					'grey darken-2 white--text': isDark && 'idle' === cluster.state.state,
				}"
		>
			<strong>{{ cluster.name }}</strong>
			<v-tooltip
					v-for="(stage, stageKey) in cluster.stages"
					:key="stageKey"
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
							'grey white--text': !isDark && 'idle' === stage.state,
							'grey darken-1 white--text': isDark && 'idle' === stage.state,
							'btn--disabled lighten-3': !stage.href,
							'pulsating': stage.inProgress,
						}"
						style="margin-left: 8px; margin-right: -13px;"
				>
					<v-icon v-text="stage.data.icon"></v-icon>
				</v-btn>
				<span>{{ stage.tooltip }}</span>
			</v-tooltip>
		</v-chip>
	</span>
</template>

<script>
	import {mapGetters} from 'vuex';

	export default {
		name: "NamedCluster",
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
