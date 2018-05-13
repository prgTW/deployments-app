<template>
	<v-layout row justify-center>
		<v-flex xs12 md10>
			<v-btn
					fab
					bottom
					right
					fixed
					color="primary"
					:loading="isLoading"
					@click.stop="fetchCommits"
			>
				{{ refreshTimeoutNice }}
			</v-btn>
			<v-snackbar bottom center v-model="isLoading" color="info">
				<strong>Loading</strong>
			</v-snackbar>

			<v-list two-line subheader v-for="(commits, date) in commitsByDate" :key="date">
				<v-subheader :key="date">
					<v-icon small>access_time</v-icon>&nbsp;{{ date }}
				</v-subheader>
				<v-list-tile avatar ripple v-for="(commit, key) in commits" :key="key">
					<v-list-tile-avatar>
						<img :src="commit.raw.author.avatarUrl">
					</v-list-tile-avatar>

					<v-list-tile-content>
						<v-list-tile-title>
							<strong v-html="commit.raw.messageHeadlineHTML"></strong>
						</v-list-tile-title>
						<v-list-tile-sub-title>
							<a :href="commit.raw.author.user.url"
							   target="_blank"
							   v-text="commit.raw.author.user.login"></a>
							<span v-if="!commit.raw.authoredByCommitter && commit.raw.committer.user">authored and</span>
							<span v-else>committed</span>

							<span v-if="!commit.raw.authoredByCommitter">
								<a :href="commit.raw.committer.user.url"
								   target="_blank"
								   v-if="commit.raw.committer.user"
								   v-text="commit.raw.committer.user.login"
								></a>
								<span v-if="!commit.raw.authoredByCommitter && commit.raw.committer.user">committed</span>
							</span>

							<span :title="commit.raw.committedDate">
								<RelativeTime :date="commit.raw.committedDate"></RelativeTime>
							</span>
						</v-list-tile-sub-title>
					</v-list-tile-content>

					<v-list-tile-action>
						<v-btn :icon="$vuetify.breakpoint.smAndDown"
							   color="blue"
							   outline
							   round
							   slot="activator"
							   :href="commit.raw.url"
							   :small="$vuetify.breakpoint.mdAndUp"
							   target="_blank">
							<v-icon class="hidden-md-and-up">link</v-icon>
							<strong class="hidden-sm-and-down">
								#{{ commit.raw.abbreviatedOid }}
							</strong>
						</v-btn>
					</v-list-tile-action>

					<v-list-tile-action class="mr-3">
						<template v-if="commit.raw.status">
							<v-btn icon small color="green"
								   :href="getContextTargetUrl('ci/circleci', commit.raw.status.contexts || [])"
								   target="_blank"
								   v-if="isContextSuccessful('ci/circleci', commit.raw.status.contexts || [])">
								<v-icon color="white" size="18">bug_report</v-icon>
							</v-btn>
							<v-btn icon small color="orange" class="pulsating"
								   :href="getContextTargetUrl('ci/circleci', commit.raw.status.contexts || [])"
								   target="_blank"
								   v-else-if="isContextPending('ci/circleci', commit.raw.status.contexts || [])">
								<v-icon color="white" size="18">bug_report</v-icon>
							</v-btn>
							<v-btn icon small color="red"
								   :href="getContextTargetUrl('ci/circleci', commit.raw.status.contexts || [])"
								   target="_blank"
								   v-else-if="isContextFailed('ci/circleci', commit.raw.status.contexts || [])">
								<v-icon color="white" size="18">bug_report</v-icon>
							</v-btn>
							<v-btn icon small color="grey lighten-3"
								   :href="getContextTargetUrl('ci/circleci', commit.raw.status.contexts || [])"
								   target="_blank" v-else>
								<v-icon color="grey lighten-1" size="18">bug_report</v-icon>
							</v-btn>
						</template>
						<v-icon color="grey lighten-1" size="18" v-else>not_interested</v-icon>
					</v-list-tile-action>

					<template v-for="pipeline in commit.pipelines">
						<v-list-tile-action>
							<v-chip
									disabled
									small
									:class="{
										'lighten-3': 'done' !== pipeline.stages.staging.state || 'done' !== pipeline.stages.production.state,
										'grey grey--text': 'done' !== pipeline.stages.staging.state || 'done' !== pipeline.stages.production.state,
										'green white--text': 'done' === pipeline.stages.staging.state && 'done' === pipeline.stages.production.state,
									}"
							>

								<v-avatar class="green white--text"
										  v-if="'done' === pipeline.stages.staging.state"
								>
									<v-icon>{{ pipeline.stages.staging.icon }}</v-icon>
								</v-avatar>
								<v-avatar class="red white--text"
										  v-else-if="'error' === pipeline.stages.staging.state">
									<v-icon>{{ pipeline.stages.staging.icon }}</v-icon>
								</v-avatar>
								<v-avatar class="orange white--text pulsating"
										  v-else-if="'in_progress' === pipeline.stages.staging.state">
									<v-icon>{{ pipeline.stages.staging.icon }}</v-icon>
								</v-avatar>
								<v-avatar class="grey lighten-3 white--text" v-else>
									<v-icon color="grey lighten-1">{{ pipeline.stages.staging.icon }}</v-icon>
								</v-avatar>

								<strong>{{ pipeline.name }}</strong>

								<v-avatar class="green white--text"
										  v-if="'done' === pipeline.stages.production.state"
										  style="margin-left: 8px; margin-right: -12px;">
									<v-icon>{{ pipeline.stages.production.icon }}</v-icon>
								</v-avatar>
								<v-avatar class="red white--text"
										  v-else-if="'error' === pipeline.stages.production.state"
										  style="margin-left: 8px; margin-right: -12px;">
									<v-icon>{{ pipeline.stages.production.icon }}</v-icon>
								</v-avatar>
								<v-avatar class="orange white--text pulsating"
										  v-else-if="'in_progress' === pipeline.stages.production.state"
										  style="margin-left: 8px; margin-right: -12px;">
									<v-icon>{{ pipeline.stages.production.icon }}</v-icon>
								</v-avatar>
								<v-avatar class="grey lighten-3 white--text" v-else
										  style="margin-left: 8px; margin-right: -12px;">
									<v-icon color="grey lighten-1">{{ pipeline.stages.production.icon }}
									</v-icon>
								</v-avatar>
							</v-chip>
						</v-list-tile-action>
					</template>
				</v-list-tile>
				<v-divider></v-divider>
			</v-list>
		</v-flex>
	</v-layout>
</template>

<script>
	import _ from 'lodash';
	import moment from 'moment';
	import RelativeTime from './RelativeTime';
	import {QUERY_COMMITS_HISTORY} from './queries.js';

	export default {
		apollo: {
			repository: {
				fetchPolicy: 'no-cache',
				query: QUERY_COMMITS_HISTORY,
				variables() {
					return {
						owner: this.$route.params.owner,
						name: this.$route.params.repo,
						qualifiedName: `refs/heads/${this.$route.params.branch}`,
						count: 50,
					}
				},
				result(result) {
					this.history = result.data.repository.ref.target.history.edges
					this.hasNexPage = result.data.repository.ref.target.history.pageInfo.hasNextPage
					this.isLoading = false
					this.resetTimer()
					this.resetAnimation()
				},
				error() {
					this.isLoading = false
					this.resetTimer()
					this.resetAnimation()
				}
			},
		},
		components: {RelativeTime},
		data: () => ({
			history: [],
			hasNexPage: false,
			isLoading: true,
			refreshInterval: 180,
			refreshTimeout: 180,
			refreshIntervalHandle: undefined,
		}),
		computed: {
			commitsByDate: function () {
				let pipelines = [
					{
						name: "K1",
						stages: {
							staging: {
								icon: "business",
								context: "buddy/pipeline/staging-k1",
								state: undefined
							},
							production: {
								icon: "public",
								context: "buddy/pipeline/production-k1",
								state: undefined
							},
						},
					},
					{
						name: "K2",
						stages: {
							staging: {
								icon: "business",
								context: "buddy/pipeline/staging-k2",
								state: undefined
							},
							production: {
								icon: "public",
								context: "buddy/pipeline/production-k2",
								state: undefined
							},
						},
					},
				];
				let clonedCommits = _.cloneDeep(this.history)

				let commits = _.map(clonedCommits, (commit) => {
					_.forEach(pipelines, (pipeline, pIdx) => {
						_.forEach(pipeline.stages, (stage, sIdx) => {
							if ('done' === stage.state) {
								return
							}

							const currentContext = _
								.chain(commit.node.status ? (commit.node.status.contexts || []) : [])
								.filter((status) => {
									return status.context === stage.context
								})
								.first()
								.value()

							if (undefined === currentContext) {
								return;
							}

							pipelines[pIdx].stages[sIdx].state = {
								FAILURE: "error",
								ERROR: "error",
								PENDING: "in_progress",
								SUCCESS: "done",
							}[currentContext.state || ''];
						})
					});

					return {
						raw: commit.node,
						pipelines: _.cloneDeep(pipelines)
					}
				})

				return _.groupBy(commits, commit => moment(commit.raw.committedDate).format('YYYY-MM-DD'));
			},
			refreshTimeoutNice: function () {
				return moment(this.refreshTimeout * 1000).format('mm:ss');
			}
		},
		methods: {
			fetchCommits: function () {
				this.isLoading = true
				this.$apollo.queries.repository.refetch()
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
						this.fetchCommits()
					}
				}, 1000);
			},
			resetAnimation: function () {
				let pulsatingElements = document.querySelectorAll('.pulsating');
				_.forEach(pulsatingElements, (elem) => {
					elem.classList.remove('pulsating')
				})
				setTimeout(() => {
					_.forEach(pulsatingElements, (elem) => {
						elem.classList.add('pulsating')
					})
				}, 1)
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
			},
			getContextTargetUrl: function (context, contexts) {
				return _.chain(contexts).filter(ctx => ctx.context === context).first().value().targetUrl;
			},
		},
		mounted: function () {
			this.fetchCommits()
		},
		beforeDestroy: function () {
			this.resetTimer(false)
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
			-webkit-transform: scale(1.2);
		}
		75% {
			-webkit-transform: scale(1.2);
		}
		100% {
			-webkit-transform: scale(0.8);
		}
	}
</style>
