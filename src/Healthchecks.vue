<template>
	<v-layout row justify-center>
		<v-flex xs12>
			<v-btn
					fab
					bottom
					right
					fixed
					color="primary"
					:loading="isLoading"
					:disabled="isLoading || refreshTimeout > (refreshInterval * 2 / 3)"
					@click.stop="fetch"
			>
				{{ refreshTimeoutNice }}
			</v-btn>

			<ChecksByApp :dataByApp="dataByApp"/>

		</v-flex>
	</v-layout>
</template>

<script>
	import _ from 'lodash';
	import axios from 'axios';
	import ChecksByApp from "./ChecksByApp";
	import moment from 'moment';

	export default {
		name: "Healthchecks",
		components: {ChecksByApp},
		data: () => ({
			checks: [],
			isLoading: true,
			refreshInterval: 180,
			refreshTimeout: 180,
			refreshIntervalHandle: undefined,
		}),
		computed: {
			// allTags: function () {
			// 	return _
			// 		.chain(this.checks)
			// 		.map(check => check.tags.split(' '))
			// 		.flatten()
			// 		.sort()
			// 		.sortedUniq()
			// 		.value();
			// },
			dataByApp: function () {
				let data = {};

				_.forEach(this.checks, check => {
					const tags = check.tags.split(' ')
					let apps = _.filter(tags, tag => _.endsWith(tag, '-app'))
					// let locales = _.filter(tags, tag => _.startsWith(tag, 'app-'))

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
			refreshTimeoutNice: function () {
				return moment(this.refreshTimeout * 1000).format('mm:ss');
			}
		},
		methods: {
			fetch: function () {
				this.isLoading = true
				axios
					.get('https://wt-012b9f4822e043e9d184bf6262822d15-0.sandbox.auth0-extend.com/healthchecks-status/checks')
					.then(response => {
						this.checks = response.data.checks
						this.isLoading = false
						this.resetTimer()
					})
					.catch(error => {
						this.checks = [];
						this.isLoading = false
						this.resetTimer()
					})
			},
			resetTimer: function (queueNext = true) {
				if (this.refreshIntervalHandle) {
					clearInterval(this.refreshIntervalHandle);
				}
				if (!queueNext) {
					return;
				}
				this.refreshTimeout = this.refreshInterval;
				this.refreshIntervalHandle = setInterval(() => {
					--this.refreshTimeout;
					if (this.refreshTimeout <= 0) {
						this.resetTimer(false)
						this.fetch()
					}
				}, 1000)
			},
		},
		mounted: function () {
			this.fetch()
		},
		beforeDestroy: function () {
			this.resetTimer(false)
		}
	}
</script>
