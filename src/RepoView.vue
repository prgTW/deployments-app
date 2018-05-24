<template>
	<v-layout row justify-center>
		<v-flex xs12 xl10>
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
					<v-badge overlap left :color="commit.raw.signature.isValid ? 'green' : 'red'"
							 v-if="commit.raw.signature">
						<v-icon slot="badge" small color="white" v-if="commit.raw.signature.isValid">done</v-icon>
						<v-icon slot="badge" small color="white" v-else>clear</v-icon>
						<v-list-tile-avatar>
							<img :src="commit.raw.author.avatarUrl">
						</v-list-tile-avatar>
					</v-badge>
					<v-list-tile-avatar v-else>
						<img :src="commit.raw.author.avatarUrl">
					</v-list-tile-avatar>

					<v-list-tile-content>
						<v-list-tile-title>
							<strong v-html="commit.raw.messageHeadlineHTML"></strong>
						</v-list-tile-title>
						<v-list-tile-sub-title>
							<a :href="commit.raw.author.user.url"
							   target="_blank"
							   class="grey--text"
							   v-if="commit.raw.author.user && commit.raw.author.user.login"
							><strong>{{ commit.raw.author.user.login }}</strong></a>
							<strong v-else class="grey--text">
								{{ commit.raw.author.name }}
							</strong>
							<span v-if="!commit.raw.authoredByCommitter">authored and</span>
							<span v-else>committed</span>

							<span v-if="!commit.raw.authoredByCommitter">
								<a :href="commit.raw.committer.user.url"
								   target="_blank"
								   class="grey--text"
								   v-if="commit.raw.committer.user && commit.raw.committer.user.login"
								><strong>{{ commit.raw.committer.user.login }}</strong></a>
								<strong class="grey--text" v-else>
									{{ commit.raw.committer.name }}
								</strong>
								<span v-if="!commit.raw.authoredByCommitter">committed</span>
							</span>

							<span :title="commit.raw.committedDate">
								<RelativeTime :date="commit.raw.committedDate"></RelativeTime>
							</span>
						</v-list-tile-sub-title>
					</v-list-tile-content>

					<v-list-tile-action>
						<v-btn :icon="$vuetify.breakpoint.lgAndDown"
							   color="blue"
							   outline
							   round
							   slot="activator"
							   :href="commit.raw.url"
							   :small="$vuetify.breakpoint.lgAndDown"
							   target="_blank">
							<v-icon class="hidden-xl-only">link</v-icon>
							<strong class="hidden-lg-and-down">
								#{{ commit.raw.abbreviatedOid }}
							</strong>
						</v-btn>
					</v-list-tile-action>

					<v-list-tile-action class="mr-3">
						<template
								v-if="commit.raw.status && hasContext('ci/circleci', commit.raw.status.contexts || [])">
							<v-btn icon
								   :small="$vuetify.breakpoint.lgAndDown"
								   color="green"
								   :href="getContextTargetUrl('ci/circleci', commit)"
								   target="_blank"
								   v-if="isContextSuccessful('ci/circleci', commit.raw.status.contexts || [])">
								<v-icon color="white" size="18">bug_report</v-icon>
							</v-btn>
							<v-btn icon
								   :small="$vuetify.breakpoint.lgAndDown"
								   color="orange" class="pulsating"
								   :href="getContextTargetUrl('ci/circleci', commit)"
								   target="_blank"
								   v-else-if="isContextPending('ci/circleci', commit.raw.status.contexts || [])">
								<v-icon color="white" size="18">bug_report</v-icon>
							</v-btn>
							<v-btn icon
								   :small="$vuetify.breakpoint.lgAndDown"
								   color="red"
								   :href="getContextTargetUrl('ci/circleci', commit)"
								   target="_blank"
								   v-else-if="isContextFailed('ci/circleci', commit.raw.status.contexts || [])">
								<v-icon color="white" size="18">bug_report</v-icon>
							</v-btn>
							<v-btn icon
								   :small="$vuetify.breakpoint.lgAndDown"
								   color="grey lighten-3"
								   :href="getContextTargetUrl('ci/circleci', commit)"
								   target="_blank" v-else>
								<v-icon color="grey lighten-1" size="18">bug_report</v-icon>
							</v-btn>
						</template>
						<v-icon color="grey lighten-1" size="18" v-else>bug_report</v-icon>
					</v-list-tile-action>

					<template v-for="pipeline in commit.pipelines">
						<v-list-tile-action>
							<v-chip
									disabled
									small
									:class="{
										'lighten-3': 'done' !== pipeline.stages.staging.state || 'done' !== pipeline.stages.production.state,
										'grey grey--text text--darken-3': 'done' !== pipeline.stages.staging.state || 'done' !== pipeline.stages.production.state,
										'green white--text': 'done' === pipeline.stages.staging.state && 'done' === pipeline.stages.production.state,
									}"
							>
								<v-btn icon
									   :small="$vuetify.breakpoint.lgAndDown"
									   :href="getContextTargetUrl(pipeline.stages.staging.context, commit)"
									   target="_blank"
									   :class="{
									   		'green white--text': 'done' === pipeline.stages.staging.state,
									   		'red white--text': 'error' === pipeline.stages.staging.state,
									   		'orange white--text': 'in_progress' === pipeline.stages.staging.state,
									   		'grey lighten-3 white--text': undefined === pipeline.stages.staging.state,
									   		'btn--disabled lighten-3': !getContextTargetUrl(pipeline.stages.staging.context, commit),
									   		'pulsating': pipeline.stages.staging.in_progress,
									   }"
									   style="margin-left: -13px; margin-right: 8px;"
								>
									<v-icon v-text="pipeline.stages.staging.icon"></v-icon>
								</v-btn>

								<strong>{{ pipeline.name }}</strong>

								<v-btn icon
									   :small="$vuetify.breakpoint.lgAndDown"
									   :href="getContextTargetUrl(pipeline.stages.production.context, commit)"
									   target="_blank"
									   :class="{
									   		'green white--text': 'done' === pipeline.stages.production.state,
									   		'red white--text': 'error' === pipeline.stages.production.state,
									   		'orange white--text': 'in_progress' === pipeline.stages.production.state,
									   		'grey lighten-3 white--text': undefined === pipeline.stages.production.state,
									   		'btn--disabled lighten-3': !getContextTargetUrl(pipeline.stages.production.context, commit),
									   		'pulsating': pipeline.stages.production.in_progress,
									   }"
									   style="margin-left: 8px; margin-right: -13px;"
								>
									<v-icon v-text="pipeline.stages.production.icon"></v-icon>
								</v-btn>
							</v-chip>
						</v-list-tile-action>
					</template>
					<template v-if="0 === commit.pipelines.length">
						<v-list-tile-action>
							<em class="grey--text text--lighten-1">no pipelines defined</em>
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
	import {getConfig} from './pipelines.js';
	import {resetAnimations} from "./helpers";

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
					resetAnimations()
				},
				error() {
					this.isLoading = false
					this.resetTimer()
					resetAnimations()
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
				let config = getConfig(this.$route.params.owner, this.$route.params.repo)
				let pipelines = config.pipelines || []
				let clonedCommits = _.cloneDeep(this.history)

				let commits = _.map(clonedCommits, (commit, cIdx) => {
					_.forEach(pipelines, (pipeline, pIdx) => {
						_.forEach(pipeline.stages, (stage, sIdx) => {
							if ('done' === stage.state) {
								pipelines[pIdx].stages[sIdx].in_progress = false
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
							pipelines[pIdx].stages[sIdx].in_progress = {
								FAILURE: cIdx > 0 ? pipelines[pIdx].stages[sIdx].in_progress : false,
								ERROR: cIdx > 0 ? pipelines[pIdx].stages[sIdx].in_progress : false,
								PENDING: true,
								SUCCESS: false,
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
			hasContext: function (context, contexts) {
				return _.some(contexts, function (ctx) {
					return ctx.context === context
				})
			},
			getContextTargetUrl: function (context, commit) {
				if (!commit.raw.status || [] === commit.raw.status.contexts) {
					return undefined;
				}

				const firstContext = _.chain(commit.raw.status.contexts).filter(ctx => ctx.context === context).first().value();
				return firstContext ? firstContext.targetUrl : undefined;
			}
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