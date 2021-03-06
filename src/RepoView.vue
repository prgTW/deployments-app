<template>
	<Centered v-if="isLoading && 0 === history.length"/>
	<v-layout row justify-center v-else>
		<v-flex xs12 xl10>
			<v-btn
					fab
					bottom
					right
					fixed
					color="primary"
					:loading="isLoading"
					:disabled="isLoading || refreshTimeout > (refreshInterval * 2 / 3)"
					@click.stop="fetchCommits"
			>
				{{ refreshTimeoutNice }}
			</v-btn>

			<CommitsList
					v-for="(commits, date) in commitsByDate"
					:key="date"
					:commits="commits"
					:date="date"
			/>

		</v-flex>
	</v-layout>
</template>

<script>
	import _ from 'lodash';
	import moment from 'moment';
	import {QUERY_COMMITS_HISTORY} from './queries.js';
	import {getConfig, STATE} from './config.js';
	import {resetAnimations} from "./helpers";
	import CommitsList from "./CommitsList";
	import Centered from "./Centered";

	export default {
		name: "RepoView",
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
					this.history = result.data.repository.ref.target.history.edges;
					this.hasNextPage = result.data.repository.ref.target.history.pageInfo.hasNextPage;
					this.isLoading = false;
					this.resetTimer();
					resetAnimations()
				},
				error() {
					this.isLoading = false;
					this.resetTimer();
					resetAnimations()
				}
			},
		},
		components: {CommitsList, Centered},
		data: () => ({
			history: [],
			hasNextPage: false,
			isLoading: false,
			refreshInterval: 180,
			refreshTimeout: 180,
			refreshIntervalHandle: undefined,
		}),
		computed: {
			commitsByDate: function () {
				let config = getConfig(this.$route.params.owner, this.$route.params.repo);
				let clonedCommits = _.cloneDeep(this.history);

				if (!clonedCommits.length) {
					return [];
				}

				// compute initial state
				const previousState = _.mapValues(clonedCommits, () => {
					return _.mapValues(config.clusters, (cluster) => {
						return {
							name: cluster.name,
							state: {state: STATE.IDLE, inProgress: false},
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

							previousState[commitIdx][clusterIdx]['stages'][stageIdx] = stageData;

							return stageData;
						});

						const clusterState = cluster.stateFunc(
							commit.node,
							commitIdx > 0 ? clonedCommits[commitIdx - 1].node : undefined,
							commitIdx > 0 ? previousState[commitIdx - 1][clusterIdx]['state'] : undefined,
							stagesData,
						);

						previousState[commitIdx][clusterIdx]['state'] = clusterState;

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
				this.isLoading = true;
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
						this.resetTimer(false);
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
