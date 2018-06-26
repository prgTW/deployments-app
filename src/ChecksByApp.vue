<template>
	<v-layout v-if="!detailed" row wrap>
		<v-flex xs12>
			<v-card
					v-for="(data, appName) in checksByApp"
					:key="appName"
					:class="{
						'mb-3': true,
						'lighten-4': !isDark,
						'darken-4': isDark,
						'red white--text': data.stats.down,
						'orange white--text': !data.stats.down && data.stats.grace,
						'green white--text': !data.stats.down && !data.stats.grace,
					}"
			>
				<v-card-title
						:class="{
							'pa-2': true,
							'red darken-3 white--text': data.stats.down,
							'orange darken-3 white--text': !data.stats.down && data.stats.grace,
							'green darken-3 white--text': !data.stats.down && !data.stats.grace,
						}"
				>
					<span class="headline"><strong>{{ appName }}</strong></span>
					<v-spacer/>
					<Stats :stats="data.stats"/>
				</v-card-title>

				<template v-if="data.stats.down + data.stats.grace + data.stats.paused">
					<v-divider/>
					<ChecksByTag :checks="data.checks" :detailed="detailed"/>
				</template>
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
							{up: 0, down: 0, grace: 0, paused: 0, new: 0},
							_.countBy(checks, check => check.status),
						)
					}))
					.sortBy([
						(checkData) => -checkData.stats.down,
						(checkData) => -checkData.stats.grace,
						(checkData) => checkData.appName
					])
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
