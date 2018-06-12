<template>
	<div>
		<v-tooltip v-for="status in statuses" v-if="circles[status].count > 0" :key="status" top>
			<v-chip
					slot="activator"
					disabled
					small
					:color="`${circles[status].color} white--text`"
			>
				<strong>{{ circles[status].count }}</strong>
			</v-chip>
			<span>{{ circles[status].tooltip }}</span>
		</v-tooltip>
	</div>
</template>

<script>
	export default {
		name: 'Stats',
		data: () => ({}),
		computed: {
			circles: function () {
				return {
					up: {color: 'green darken-1', tooltip: 'Up', count: this.stats.up},
					down: {color: 'red darken-1', tooltip: 'Down', count: this.stats.down},
					grace: {color: 'orange darken-1', tooltip: 'Grace', count: this.stats.grace},
					paused: {color: 'grey', tooltip: 'Paused', count: this.stats.paused},
					new: {color: 'grey lighten-1', tooltip: 'New', count: this.stats.new},
				}
			},
		},
		props: {
			stats: Object,
			statuses: {
				type: Array,
				default: () => ['down', 'grace', 'paused', 'new', 'up'],
			},
		}
	}
</script>
