<template>
	<v-layout row justify-center>
		<v-flex xs12 sm10 md10>
			<v-list two-line>
				<template v-for="(commits, date) in commitsByDate">
					<v-subheader :key="date">
						<v-icon small>access_time</v-icon>&nbsp;{{ date }}
					</v-subheader>
					<template v-for="commit in commits">
						<v-list-tile avatar ripple>
							<v-list-tile-avatar>
								<img :src="commit.raw.author.avatarUrl">
							</v-list-tile-avatar>

							<v-list-tile-content>
								<v-list-tile-title v-html="commit.raw.messageHeadlineHTML"></v-list-tile-title>
								<v-list-tile-sub-title>
									<a :href="commit.raw.author.url">
										<span>{{ commit.raw.author.name }}</span>
									</a>
									committed
									<span :title="commit.raw.committedDate">
										<RelativeTime :date="commit.raw.committedDate"></RelativeTime>
									</span>
								</v-list-tile-sub-title>
							</v-list-tile-content>

							<v-list-tile-action>
								<v-btn color="blue" flat small round slot="activator" :href="commit.raw.url">
									<v-icon class="hidden-md-and-up">link</v-icon>
									<strong class="hidden-sm-and-down">
										#{{ commit.raw.abbreviatedOid }}
									</strong>
								</v-btn>
							</v-list-tile-action>

							<v-list-tile-action>
								<v-chip
										small
										disabled
										color="green lighten-1"
										text-color="white"
										v-if="isContextSuccessful('ci/circleci', commit.raw.status.contexts)"
								>
									<v-avatar class="green">
										<v-icon>bug_report</v-icon>
									</v-avatar>
									<strong>CircleCI</strong>
								</v-chip>
								<v-chip
										small
										disabled
										color="orange lighten-1"
										text-color="white"
										v-else-if="isContextPending('ci/circleci', commit.raw.status.contexts)"
										class="pulsating"
								>
									<v-avatar class="orange">
										<v-icon>bug_report</v-icon>
									</v-avatar>
									<strong>CircleCI</strong>
								</v-chip>
								<v-chip small disabled color="grey lighten-4" text-color="grey" v-else>
									<v-avatar class="grey lighten-3">
										<v-icon>bug_report</v-icon>
									</v-avatar>
									<strong class="grey--text">CircleCI</strong>
								</v-chip>
							</v-list-tile-action>

							<template v-for="pipeline in commit.pipelines">
								<v-list-tile-action>
									<v-chip
											disabled
											small
											color="grey lighten-3"
											text-color="grey"
									>
										<template v-for="stage in pipeline.stages">
											<v-avatar class="green white--text" v-if="'done' === stage.state">
												<v-icon>{{ stage.icon }}</v-icon>
											</v-avatar>
											<v-avatar class="orange white--text"
													  v-else-if="'in_progress' === stage.state">
												<v-icon>{{ stage.icon }}</v-icon>
											</v-avatar>
											<v-avatar class="grey white--text" v-else>
												<v-icon>{{ stage.icon }}</v-icon>
											</v-avatar>
										</template>
										<strong>{{ pipeline.name }}</strong>
									</v-chip>
								</v-list-tile-action>
							</template>
						</v-list-tile>
					</template>
				</template>
			</v-list>
		</v-flex>
	</v-layout>
</template>

<script>
	import axios from 'axios';
	import _ from 'lodash';
	import moment from 'moment';
	import RelativeTime from './RelativeTime';
	import mockedData from './mockedData.js';

	export default {
		components: {RelativeTime},
		data: () => ({
			isLoading: true,
			commits: [],
		}),
		computed: {
			today: function () {
				return moment().format('YYYY-MM-DD');
			},
			commitsByDate: function () {
				return _.groupBy(this.commits, (commit) => {
					return moment(commit.raw.committedDate).format('YYYY-MM-DD');
				});
			}
		},
		methods: {
			fetchCommits: function () {
				this.isLoading = true
				let vm = this
				axios.get('https://yesno.wtf/api')
					.then(function (response) {
						let rsp = mockedData;

						vm.isLoading = false

						let pipelines = [
							{
								name: "OLD",
								stages: [
									{
										icon: "business",
										context: "old-staging",
										state: undefined
									},
									{
										icon: "public",
										context: "old-production",
										state: undefined
									},
								],
							},
							{
								name: "K1",
								stages: [
									{
										icon: "business",
										context: "buddy/pipeline/staging-k1",
										state: undefined
									},
									{
										icon: "public",
										context: "buddy/pipeline/production-k1",
										state: undefined
									},
								],
							},
							{
								name: "K2",
								stages: [
									{
										icon: "business",
										context: "buddy/pipeline/staging-k2",
										state: undefined
									},
									{
										icon: "public",
										context: "buddy/pipeline/production-k2",
										state: undefined
									},
								],
							},
						];

						vm.commits = _.map(rsp.data.repository.ref.target.history.edges, (commit) => {
							_.forEach(pipelines, (pipeline, pIdx) => {
								_.forEach(pipeline.stages, (stage, sIdx) => {
									if ('done' === stage.state) {
										return
									}
									if ('in_progress' === stage.state) {
										return
									}

									const currentContext = _
										.chain(commit.node.status.contexts || [])
										.filter((status) => {
											return status.context === stage.context
										})
										.first()
										.value()

									if (undefined === currentContext) {
										return;
									}

									pipelines[pIdx].stages[sIdx].state = {
										failure: "error",
										error: "error",
										pending: "in_progress",
										success: "done",
									}[currentContext.state || ''];
								})
							});

							return {
								raw: commit.node,
								pipelines: Object.assign({}, pipelines)
							}
						})
					})
					.catch(function (error) {
						vm.commits = []
					})
			},
			isContextPending: function (context, contexts) {
				return _.some(contexts, function (ctx) {
					return ctx.context === context && "PENDING" === ctx.state
				})
			},
			isContextFailed: function (context, contexts) {
				return _.some(contexts, function (ctx) {
					return ctx.context === context && ("ERROR" === ctx.state || "FAILURE" === ctx.state)
				})
			},
			isContextSuccessful: function (context, contexts) {
				return _.some(contexts, function (ctx) {
					return ctx.context === context && "SUCCESS" === ctx.state
				})
			}
		},
		mounted: function () {
			this.fetchCommits()
		}
	}
</script>

<style scoped>
	.pulsating {
		-webkit-animation: pulse 2s ease-in-out;
		-moz-animation: pulse 2s ease-in-out;
		animation: pulse 2s ease-in-out;
		-webkit-animation-iteration-count: infinite;
		-moz-animation-iteration-count: infinite;
		animation-iteration-count: infinite;
	}

	@keyframes pulse {
		0% {
			-webkit-transform: scale(0.8);
		}
		25% {
			-webkit-transform: scale(0.8);
		}
		50% {
			-webkit-transform: scale(1);
		}
		75% {
			-webkit-transform: scale(0.8);
		}
		100% {
			-webkit-transform: scale(0.8);
		}
	}
</style>
