<template>
	<span>
		<v-chip
				disabled
				small
				:class="{
					'green white--text': 'success' === cluster.state.state,
					'red white--text': 'failure' === cluster.state.state,
					'orange white--text': 'in_progress' === cluster.state.state,
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
							'grey white--text': 'idle' === stage.state,
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
	export default {
		name: "NamedCluster",
		props: {
			cluster: Object,
		}
	}
</script>
