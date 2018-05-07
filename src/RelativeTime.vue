<template>
	<v-tooltip top>
		<span slot="activator">{{ formatted }}</span>
		<span>{{ formattedLong }}</span>
	</v-tooltip>
</template>

<script>
	import moment from 'moment'
	// noinspection ES6UnusedImports
	import momentShortformat from 'moment-shortformat'
	// noinspection ES6UnusedImports
	import momentTimer from 'moment-timer'

	export default {
		data: () => ({
			formatted: '',
			formattedLong: '',
			timer: null
		}),
		props: {
			date: String,
		},
		methods: {
			updateDescriptions: function () {
				let thisMoment = moment(this.date)
				this.formatted = thisMoment.short()
				this.formattedLong = thisMoment.format("LLL Z")
			}
		},
		mounted: function () {
			this.updateDescriptions()
			this.timer = moment.duration({seconds: 5}).timer({
				loop: true,
				start: true
			}, this.updateDescriptions)
		},
		beforeDestroy: function () {
			this.timer.stop()
		}
	}
</script>
