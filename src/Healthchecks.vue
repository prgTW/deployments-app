<template>
	<Centered v-if="isLoading && 0 === checks.length"/>
	<v-layout row justify-center v-else>
		<v-btn
				fab
				bottom
				right
				fixed
				color="primary"
				:loading="isLoading"

				@click.stop="fetch"
		>
			{{ refreshTimeoutNice }}
		</v-btn>

		<Centered v-if="checks.length && allChecksOk">
			<v-alert type="success" :value="true">ALL CHECKS ARE UP!</v-alert>
		</Centered>
		<template v-else>
			<v-flex xs12>
				<!--<v-container fluid>-->
				<!--<v-layout wrap justify-space-around>-->
				<!--<v-flex xs4>-->
				<!--<v-select-->
				<!--v-model="appsFilter"-->
				<!--:items="allApps"-->
				<!--label="Choose applications"-->
				<!--multiple-->
				<!--tags-->
				<!--&gt;</v-select>-->
				<!--</v-flex>-->
				<!--<v-flex xs4>-->
				<!--<v-select-->
				<!--v-model="localesFilter"-->
				<!--:items="allLocales"-->
				<!--label="Choose locales"-->
				<!--multiple-->
				<!--tags-->
				<!--&gt;</v-select>-->
				<!--</v-flex>-->
				<!--</v-layout>-->
				<!--</v-container>-->

				<ChecksByApp :checks="checks" :detailed="false"/>
			</v-flex>
		</template>
	</v-layout>
</template>

<script>
	import axios from 'axios';
	import ChecksByApp from "./ChecksByApp";
	import Centered from "./Centered";
	import moment from 'moment';

	export default {
		name: "Healthchecks",
		components: {ChecksByApp, Centered},
		data: () => ({
			checks: [],
			isLoading: false,
			refreshInterval: 180,
			refreshTimeout: 180,
			refreshIntervalHandle: undefined,
			appsFilter: [],
			localesFilter: [],
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
			// allApps: function () {
			// 	return _.filter(this.allTags, app => _.endsWith(app, '-app'))
			// },
			// allLocales: function () {
			// 	return _.filter(this.allTags, app => _.startsWith(app, 'app-'))
			// },
			allChecksOk: function () {
				return false === _.some(this.checks, check => 'up' !== check.status)
			},
			refreshTimeoutNice: function () {
				return moment(this.refreshTimeout * 1000).format('mm:ss');
			}
		},
		methods: {
			fetch: function () {
				this.isLoading = true;
				axios
					.get('https://wt-012b9f4822e043e9d184bf6262822d15-0.sandbox.auth0-extend.com/healthchecks-status/checks')
					.then(response => {
						this.checks = response.data.checks;
						this.isLoading = false;
						this.resetTimer()
					})
					.catch(error => {
						this.checks = [];
						this.isLoading = false;
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
						this.resetTimer(false);
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
