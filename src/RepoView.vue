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

			<v-list :dense="$vuetify.breakpoint.lgAndDown" two-line subheader
					v-for="(commitDatas, date) in commitsByDate" :key="date">
				<v-subheader :key="date">
					<v-icon small>access_time</v-icon>&nbsp;{{ date }}
				</v-subheader>
				<v-list-tile avatar ripple v-for="(commitData, key) in commitDatas" :key="key">
					<v-badge overlap left :color="commitData.commit.signature.isValid ? 'green' : 'red'"
							 v-if="commitData.commit.signature">
						<v-icon slot="badge" small color="white" v-if="commitData.commit.signature.isValid">done
						</v-icon>
						<v-icon slot="badge" small color="white" v-else>clear</v-icon>
						<v-list-tile-avatar>
							<img :src="commitData.commit.author.avatarUrl">
						</v-list-tile-avatar>
					</v-badge>
					<v-list-tile-avatar v-else>
						<img :src="commitData.commit.author.avatarUrl">
					</v-list-tile-avatar>

					<v-list-tile-content>
						<v-list-tile-title>
							<strong v-html="commitData.commit.messageHeadlineHTML"></strong>
						</v-list-tile-title>
						<v-list-tile-sub-title>
							<a :href="commitData.commit.author.user.url"
							   target="_blank"
							   class="grey--text"
							   v-if="commitData.commit.author.user && commitData.commit.author.user.login"
							><strong>{{ commitData.commit.author.user.login }}</strong></a>
							<strong v-else class="grey--text">
								{{ commitData.commit.author.name }}
							</strong>
							<span v-if="!commitData.commit.authoredByCommitter">authored and</span>
							<span v-else>committed</span>

							<span v-if="!commitData.commit.authoredByCommitter">
								<a :href="commitData.commit.committer.user.url"
								   target="_blank"
								   class="grey--text"
								   v-if="commitData.commit.committer.user && commitData.commit.committer.user.login"
								><strong>{{ commitData.commit.committer.user.login }}</strong></a>
								<strong class="grey--text" v-else>
									{{ commitData.commit.committer.name }}
								</strong>
								<span v-if="!commitData.commit.authoredByCommitter">committed</span>
							</span>

							<span :title="commitData.commit.committedDate">
								<RelativeTime :date="commitData.commit.committedDate"></RelativeTime>
							</span>
						</v-list-tile-sub-title>
					</v-list-tile-content>

					<v-list-tile-action>
						<v-btn :icon="$vuetify.breakpoint.lgAndDown"
							   color="blue"
							   flat
							   round
							   :href="commitData.commit.url"
							   :small="$vuetify.breakpoint.lgAndDown"
							   target="_blank">
							<v-icon class="hidden-xl-only">link</v-icon>
							<strong class="hidden-lg-and-down">
								#{{ commitData.commit.abbreviatedOid }}
							</strong>
						</v-btn>
					</v-list-tile-action>

					<v-list-tile-action
							v-for="(cluster) in commitData.state"
							:class="{
								'mr-2': !cluster.name
							}"
					>
						<template v-if="!cluster.name">
							<v-btn
									v-for="(stage) in cluster.stages"
									icon
									:href="stage.href"
									:small="$vuetify.breakpoint.lgAndDown"
									target="_blank"
									:class="{
										'green white--text': 'success' === stage.state,
										'red white--text': 'failure' === stage.state,
										'orange white--text': 'in_progress' === stage.state,
										'grey lighten-3 grey--text': 'idle' === stage.state,
										'btn--disabled lighten-3': !stage.href,
										'pulsating': stage.inProgress,
									}"
							>
								<v-icon v-text="stage.data.icon" size="18"></v-icon>
							</v-btn>
						</template>
						<v-chip
								v-else
								disabled
								small
								:class="{
									'green white--text': 'success' === cluster.state,
									'red white--text': 'failure' === cluster.state,
									'orange white--text': 'in_progress' === cluster.state,
								}"
						>
							<strong>{{ cluster.name }}</strong>
							<v-btn
									v-for="(stage) in cluster.stages"
									icon
									:small="$vuetify.breakpoint.lgAndDown"
									:href="stage.href"
									target="_blank"
									:class="{
										'green white--text': 'success' === stage.state,
										'red white--text': 'failure' === stage.state,
										'orange white--text': 'in_progress' === stage.state,
										'grey white--text': 'idle' === stage.state,
										'btn--disabled lighten-3': !stage.href,
										'pulsating': stage.inProgress,
									}"
									style="margin-left: 8px; margin-right: -13px;"
							>
								<v-icon v-text="stage.data.icon"></v-icon>
							</v-btn>
						</v-chip>
					</v-list-tile-action>

					<template v-if="!commitData.state">
						<v-list-tile-action>
							<em class="grey--text text--lighten-1">no clusters defined</em>
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
	import {getConfig, STATE} from './config.js';
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
						count: 100,
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
			refreshInterval: 60,
			refreshTimeout: 60,
			refreshIntervalHandle: undefined,
		}),
		computed: {
			commitsByDate: function () {
				let config = getConfig(this.$route.params.owner, this.$route.params.repo)
				let clonedCommits = _.cloneDeep(this.history)

				if (!clonedCommits.length) {
					return [];
				}

				// compute initial state
				const previousState = _.mapValues(clonedCommits, () => {
					return _.mapValues(config.clusters, (cluster) => {
						return {
							name: cluster.name,
							state: STATE.IDLE,
							stages: _.mapValues(cluster.stages, () => {
								return {state: STATE.IDLE, inProgress: false, href: undefined};
							})
						}
					})
				});

				const computedHistory = _.mapValues(clonedCommits, (commit, commitIdx) => ({
					commit: commit.node,
					state: _.mapValues(config.clusters, (cluster, clusterIdx) => {
						const stagesData = _.mapValues(cluster.stages, (stage, stageIdx) => {
							const stageData = stage.stateFunc(
								commit.node,
								commitIdx > 0 ? clonedCommits[commitIdx - 1].node : undefined,
								commitIdx > 0 ? previousState[commitIdx - 1][clusterIdx]['stages'][stageIdx] : undefined
							);

							previousState[commitIdx][clusterIdx]['stages'][stageIdx] = stageData

							return stageData;
						});

						const clusterState = cluster.stateFunc(
							stagesData,
							commitIdx > 0 ? previousState[commitIdx - 1][clusterIdx]['state'] : undefined
						);

						previousState[commitIdx][clusterIdx]['state'] = clusterState

						return {
							name: cluster.name,
							state: clusterState,
							stages: stagesData
						};
					})
				}));

				return _.groupBy(computedHistory, commitData => moment(commitData.commit.committedDate).format('YYYY-MM-DD'))
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
				}, 1000)
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
