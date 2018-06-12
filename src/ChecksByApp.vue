<template>
	<v-layout v-if="!detailed" row wrap>
		<v-flex xs12>
			<v-card
					v-for="(data, appName) in checksByApp"
					:key="appName"
					:class="{
						'mb-3': true,
						'grey darken-1': isDark
					}"
			>
				<v-card-title
						:class="{
						'grey darken-2': isDark,
						'grey lighten-3': !isDark,
						'pa-2': true,
					}"
				>
					<strong>{{ appName }}</strong>
					<v-spacer/>
					<Stats :stats="data.stats"/>
				</v-card-title>

				<v-divider/>

				<ChecksByTag :checks="data.checks" :detailed="detailed"/>
			</v-card>
		</v-flex>
	</v-layout>
</template>
<script>
	import ChecksByTag from "./ChecksByTag";
	import {mapGetters} from 'vuex';
	import Stats from "./Stats";

	export default {
		name: 'ChecksByApp',
		components: {Stats, ChecksByTag},
		data: () => ({}),
		computed: {
			...mapGetters([
				'isDark',
			]),
			checksByApp: function () {
				let data = {};

				_.forEach(this.checks, check => {
					const tags = check.tags.split(' ')
					let apps = _.filter(tags, tag => _.endsWith(tag, '-app'))

					if (0 === apps.length) {
						apps = ['_other'];
					}
					_.forEach(apps, app => {
						data[app] = data[app] || [];
						data[app].push(check)
					})
				});

				data = _
					.chain(data)
					.mapValues((checks, appName) => ({
						appName: appName,
						checks: checks,
						stats: _.extend({},
							{new: 0, paused: 0, up: 0, grace: 0, down: 0},
							_.countBy(checks, check => check.status),
						)
					}))
					.sortBy(data, ({appName}) => appName)
					.value()
				data = _.keyBy(data, ({appName}) => appName)

				return data
			},
		},
		props: {
			checks: Array,
			detailed: Boolean
		}
	}
</script>
