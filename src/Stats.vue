<template>
	<div>
		<v-tooltip v-for="type in types" v-if="circles[type].count > 0" :key="type" top>
			<v-chip
					slot="activator"
					disabled
					small
					:color="`${circles[type].color} white--text`"
			>
				<strong>{{ circles[type].count }}</strong>
			</v-chip>
			<span>{{ circles[type].tooltip }}</span>
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
					down: {color: 'red darken-1', tooltip: 'Down', count: this.stats.down},
					grace: {color: 'orange darken-1', tooltip: 'Grace', count: this.stats.grace},
					paused: {color: 'grey', tooltip: 'Paused', count: this.stats.paused},
					new: {color: 'grey lighten-1', tooltip: 'New', count: this.stats.new},
					up: {color: 'green darken-1', tooltip: 'Up', count: this.stats.up},
				}
			},
		},
		props: {
			stats: Object,
			types: {
				type: Array,
				default: () => ['down', 'grace', 'paused', 'new', 'up'],
			},
		}
	}
</script>
