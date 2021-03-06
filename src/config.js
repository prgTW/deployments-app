import _ from 'lodash'

export const STATE = {
	IDLE: 'idle',
	IN_PROGRESS: 'in_progress',
	FAILURE: 'failure',
	SUCCESS: 'success',
};

const ICON = {
	CIRCLECI_TESTS: 'bug_report',
	CIRCLECI_BUILD: 'category',
	DOCKERIZING: 'layers',
	DEPLOY_PREP: 'settings',
	DEPLOY_STAG: 'business',
	DEPLOY_PROD: 'public',
	DEPLOY_TEST: 'thumbs_up_down',
	PHRASEAPP: 'flag',
};

function getContextTargetUrl(commit, context) {
	if (!commit.status || [] === commit.status.contexts) {
		return undefined;
	}

	const firstContext = _.chain(commit.status.contexts).filter(ctx => ctx.context === context).first().value();
	return firstContext ? firstContext.targetUrl : undefined;
}

function createRepo(ref, clusters) {
	return {ref, clusters}
}

function createCluster(name, stateFunc, stages) {
	return {name, stateFunc, stages}
}

function createStage(ref, stateFunc) {
	return {ref, stateFunc};
}

function calculateClusterStateFromStageStates(commit, prevCommit, prevState, stageStates) {
	if (prevState && STATE.SUCCESS === prevState.state) {
		return {
			state: STATE.SUCCESS,
			inProgress: false,
			tooltip: undefined,
			href: undefined
		};
	} else if (_.every(stageStates, (state) => STATE.SUCCESS === state.state)) {
		return {
			state: STATE.SUCCESS,
			inProgress: false,
			tooltip: undefined,
			href: undefined
		};
	}
	// else if (_.some(stageStates, (state) => STATE.FAILURE === state.state)) {
	// 	return STATE.FAILURE;
	// }
	// else if (_.some(stageStates, (state) => STATE.IN_PROGRESS === state.state)) {
	// 	return STATE.IN_PROGRESS;
	// }

	return {
		state: STATE.IDLE,
		inProgress: _.some(stageStates, (state) => state.inProgress),
		tooltip: undefined,
		href: undefined
	};
}

function calculateStateFromStatusCheck(context) {
	return (commit, prevCommit, prevState) => {
		if (STATE.SUCCESS === prevState) {
			return {
				state: STATE.SUCCESS,
				inProgress: false,
				tooltip: context,
				href: getContextTargetUrl(commit, context)
			}
		}

		const currentContext = _
			.chain(commit.status ? (commit.status.contexts || []) : [])
			.filter((status) => {
				return status.context === context
			})
			.first()
			.value();

		if (undefined === currentContext) {
			return {
				...(prevState ? _.cloneDeep(prevState) : {state: STATE.IDLE, inProgress: false}),
				tooltip: context,
				href: undefined
			};
		}

		const currentState = {
			FAILURE: STATE.FAILURE,
			ERROR: STATE.FAILURE,
			PENDING: STATE.IN_PROGRESS,
			SUCCESS: STATE.SUCCESS,
		}[currentContext.state || ''];
		const currentInProgress = {
			FAILURE: prevState ? prevState.inProgress : false,
			ERROR: prevState ? prevState.inProgress : false,
			PENDING: true,
			SUCCESS: false,
		}[currentContext.state || ''];

		return {
			state: currentState,
			inProgress: currentInProgress,
			tooltip: context,
			href: getContextTargetUrl(commit, context)
		}
	}
}

function createIcon(icon, stateFunc) {
	return (commit, prevCommit, prevState) => ({
		...stateFunc(commit, prevCommit, prevState),
		data: {
			icon: icon
		},
	})
}

export const CONFIG = {
	'DocPlanner/axa-widget-frontend-app': createRepo('develop', [
		createCluster('', calculateClusterStateFromStageStates, [
			createStage('develop', createIcon(ICON.DOCKERIZING, calculateStateFromStatusCheck('buddy/pipeline/move commits from develop to master'))),
		]),
		createCluster('DEPLOY', calculateClusterStateFromStageStates, [
			createStage('master', createIcon(ICON.DEPLOY_PROD, calculateStateFromStatusCheck('buddy/pipeline/deploy production'))),
		]),
	]),
	'DocPlanner/booking-backend-app': createRepo('develop', [
		createCluster('', calculateClusterStateFromStageStates, [
			createStage('develop', createIcon(ICON.DOCKERIZING, calculateStateFromStatusCheck('buddy/pipeline/tests'))),
		]),
		createCluster('DEPLOY', calculateClusterStateFromStageStates, [
			createStage('master', createIcon(ICON.DEPLOY_PROD, calculateStateFromStatusCheck('buddy/pipeline/production'))),
		]),
	]),
	'DocPlanner/booking-front-app': createRepo('develop', [
		createCluster('', calculateClusterStateFromStageStates, [
			createStage('develop', createIcon(ICON.DOCKERIZING, calculateStateFromStatusCheck('buddy/pipeline/tests'))),
		]),
		createCluster('DEPLOY', calculateClusterStateFromStageStates, [
			createStage('master', createIcon(ICON.DEPLOY_STAG, calculateStateFromStatusCheck('buddy/pipeline/staging'))),
		]),
	]),
	'DocPlanner/brag-app': createRepo('develop', [
		createCluster('', calculateClusterStateFromStageStates, [
			createStage('develop', createIcon(ICON.DOCKERIZING, calculateStateFromStatusCheck('buddy/pipeline/Test & push from develop to staging'))),
		]),
		createCluster('DEPLOY', calculateClusterStateFromStageStates, [
			createStage('staging', createIcon(ICON.DEPLOY_STAG, calculateStateFromStatusCheck('buddy/pipeline/staging'))),
			createStage('master', createIcon(ICON.DEPLOY_PROD, calculateStateFromStatusCheck('buddy/pipeline/production'))),
		]),
	]),
	'DocPlanner/crm-app': createRepo('develop', [
		createCluster('PROD', calculateClusterStateFromStageStates, [
			createStage('develop', createIcon(ICON.DEPLOY_PREP, calculateStateFromStatusCheck('buddy/pipeline/production'))),
			createStage('develop', createIcon(ICON.DEPLOY_PROD, calculateStateFromStatusCheck('buddy/pipeline/production-k1'))),
			createStage('develop', createIcon(ICON.DEPLOY_PROD, calculateStateFromStatusCheck('buddy/pipeline/production-k2'))),
		]),
	]),
	'DocPlanner/dashboard-app': createRepo('develop', [
		createCluster('', calculateClusterStateFromStageStates, [
			createStage('develop', createIcon(ICON.DOCKERIZING, calculateStateFromStatusCheck('buddy/pipeline/Test & push from develop to staging'))),
		]),
		createCluster('DEPLOY', calculateClusterStateFromStageStates, [
			createStage('staging', createIcon(ICON.DEPLOY_STAG, calculateStateFromStatusCheck('buddy/pipeline/Deploy staging'))),
			createStage('master', createIcon(ICON.DEPLOY_PROD, calculateStateFromStatusCheck('buddy/pipeline/Deploy production'))),
		]),
	]),
	'DocPlanner/dp-icons': createRepo('develop', [
		createCluster('PUBLISH', calculateClusterStateFromStageStates, [
			createStage('master', createIcon(ICON.DEPLOY_PROD, calculateStateFromStatusCheck('buddy/pipeline/publish package'))),
		]),
	]),
	'DocPlanner/dp-ui-kit': createRepo('develop', [
		createCluster('', calculateClusterStateFromStageStates, [
			createStage('develop', createIcon(ICON.DOCKERIZING, calculateStateFromStatusCheck('buddy/pipeline/publish package'))),
		]),
		createCluster('PUBLISH', calculateClusterStateFromStageStates, [
			createStage('master', createIcon(ICON.DEPLOY_PROD, calculateStateFromStatusCheck('buddy/pipeline/publish package'))),
		]),
	]),
	'DocPlanner/fetcher-app': createRepo('develop', [
		createCluster('DEPLOY', calculateClusterStateFromStageStates, [
			createStage('master', createIcon(ICON.DEPLOY_PROD, calculateStateFromStatusCheck('buddy/pipeline/production'))),
		]),
	]),
	'DocPlanner/geocoder-app': createRepo('develop', [
		createCluster('', calculateClusterStateFromStageStates, [
			createStage('develop', createIcon(ICON.DOCKERIZING, calculateStateFromStatusCheck('buddy/pipeline/Test & push from develop to master'))),
		]),
		createCluster('PROD', calculateClusterStateFromStageStates, [
			createStage('master', createIcon(ICON.DEPLOY_PROD, calculateStateFromStatusCheck('buddy/pipeline/Production'))),
		]),
	]),
	'DocPlanner/hubspot-mirroring-app': createRepo('develop', [
		createCluster('DEPLOY', calculateClusterStateFromStageStates, [
			createStage('develop', createIcon(ICON.DEPLOY_PROD, calculateStateFromStatusCheck('buddy/pipeline/production'))),
		]),
	]),
	'DocPlanner/integrations-app': createRepo('develop', [
		createCluster('', calculateClusterStateFromStageStates, [
			createStage('develop', createIcon(ICON.DOCKERIZING, calculateStateFromStatusCheck('buddy/pipeline/Test & push from develop to staging'))),
		]),
		createCluster('DEPLOY', calculateClusterStateFromStageStates, [
			createStage('staging', createIcon(ICON.DEPLOY_STAG, calculateStateFromStatusCheck('buddy/pipeline/staging'))),
			createStage('master', createIcon(ICON.DEPLOY_PROD, calculateStateFromStatusCheck('buddy/pipeline/production'))),
		]),
	]),
	'DocPlanner/logger-app': createRepo('develop', [
		createCluster('PROD', calculateClusterStateFromStageStates, [
			createStage('master', createIcon(ICON.DEPLOY_PROD, calculateStateFromStatusCheck('buddy/pipeline/production'))),
		]),
	]),
	'DocPlanner/metrix-app': createRepo('develop', [
		createCluster('', calculateClusterStateFromStageStates, [
			createStage('develop', createIcon(ICON.CIRCLECI_TESTS, calculateStateFromStatusCheck('ci/circleci'))),
		]),
		createCluster('PROD', calculateClusterStateFromStageStates, [
			createStage('master', createIcon(ICON.DEPLOY_PROD, calculateStateFromStatusCheck('buddy/pipeline/production'))),
		]),
	]),
	'DocPlanner/monolith-app': createRepo('develop', [
		createCluster('', calculateClusterStateFromStageStates, [
			createStage('develop', createIcon(ICON.CIRCLECI_TESTS, calculateStateFromStatusCheck('ci/circleci'))),
		]),
		createCluster('', calculateClusterStateFromStageStates, [
			createStage('develop', createIcon(ICON.PHRASEAPP, calculateStateFromStatusCheck('buddy/pipeline/phraseapp update'))),
		]),
		createCluster('STAG', calculateClusterStateFromStageStates, [
			createStage('staging', createIcon(ICON.DEPLOY_PREP, calculateStateFromStatusCheck('buddy/pipeline/staging'))),
			createStage('staging', createIcon(ICON.DEPLOY_STAG, calculateStateFromStatusCheck('buddy/pipeline/staging-k1'))),
			createStage('staging', createIcon(ICON.DEPLOY_STAG, calculateStateFromStatusCheck('buddy/pipeline/staging-k2'))),
			createStage('staging', createIcon(ICON.DEPLOY_TEST, calculateStateFromStatusCheck('buddy/pipeline/zltapp-k2'))),
		]),
		createCluster('PROD', calculateClusterStateFromStageStates, [
			createStage('master', createIcon(ICON.DEPLOY_PREP, calculateStateFromStatusCheck('buddy/pipeline/production'))),
			createStage('master', createIcon(ICON.DEPLOY_PROD, calculateStateFromStatusCheck('buddy/pipeline/production-k1'))),
			createStage('master', createIcon(ICON.DEPLOY_PROD, calculateStateFromStatusCheck('buddy/pipeline/production-k2'))),
		]),
	]),
	'DocPlanner/mydentista': createRepo('develop', [
		createCluster('DEPLOY', calculateClusterStateFromStageStates, [
			createStage('master', createIcon(ICON.DEPLOY_PROD, calculateStateFromStatusCheck('buddy/pipeline/production'))),
		]),
	]),
	'DocPlanner/opinion-moderation-app': createRepo('develop', [
		createCluster('DEPLOY', calculateClusterStateFromStageStates, [
			createStage('master', createIcon(ICON.DEPLOY_PROD, calculateStateFromStatusCheck('buddy/pipeline/production'))),
		]),
	]),
	'DocPlanner/opinions-app': createRepo('develop', [
		createCluster('asd', calculateClusterStateFromStageStates, [
			createStage('develop', createIcon(ICON.DOCKERIZING, calculateStateFromStatusCheck('buddy/pipeline/asd'))),
		]),
	]),
	'DocPlanner/payments-app': createRepo('develop', [
		createCluster('', calculateClusterStateFromStageStates, [
			createStage('develop', createIcon(ICON.DOCKERIZING, calculateStateFromStatusCheck('buddy/pipeline/Test & push from develop to staging'))),
		]),
		createCluster('STAG', calculateClusterStateFromStageStates, [
			createStage('staging', createIcon(ICON.DEPLOY_PREP, calculateStateFromStatusCheck('buddy/pipeline/staging'))),
			createStage('staging', createIcon(ICON.DEPLOY_STAG, calculateStateFromStatusCheck('buddy/pipeline/staging-k1'))),
			createStage('staging', createIcon(ICON.DEPLOY_STAG, calculateStateFromStatusCheck('buddy/pipeline/staging-k2'))),
		]),
		createCluster('PROD', calculateClusterStateFromStageStates, [
			createStage('master', createIcon(ICON.DEPLOY_PREP, calculateStateFromStatusCheck('buddy/pipeline/production'))),
			createStage('master', createIcon(ICON.DEPLOY_PROD, calculateStateFromStatusCheck('buddy/pipeline/production-k1'))),
			createStage('master', createIcon(ICON.DEPLOY_PROD, calculateStateFromStatusCheck('buddy/pipeline/production-k2'))),
		]),
	]),
	'DocPlanner/reservation-app': createRepo('develop', [
		createCluster('DEPLOY', calculateClusterStateFromStageStates, [
			createStage('master', createIcon(ICON.DEPLOY_STAG, calculateStateFromStatusCheck('buddy/pipeline/staging'))),
			createStage('production', createIcon(ICON.DEPLOY_PROD, calculateStateFromStatusCheck('buddy/pipeline/production'))),
		]),
	]),
	'DocPlanner/sso-app': createRepo('develop', [
		createCluster('', calculateClusterStateFromStageStates, [
			createStage('develop', createIcon(ICON.CIRCLECI_TESTS, calculateStateFromStatusCheck('ci/circleci: tests'))),
			createStage('develop', createIcon(ICON.CIRCLECI_BUILD, calculateStateFromStatusCheck('ci/circleci: build'))),
			createStage('develop', createIcon(ICON.DOCKERIZING, calculateStateFromStatusCheck('buddy/pipeline/Test & push from develop to staging'))),
		]),
		createCluster('STAG', calculateClusterStateFromStageStates, [
			createStage('staging', createIcon(ICON.DEPLOY_PREP, calculateStateFromStatusCheck('buddy/pipeline/staging'))),
			createStage('staging', createIcon(ICON.DEPLOY_STAG, calculateStateFromStatusCheck('buddy/pipeline/staging-k1'))),
			createStage('staging', createIcon(ICON.DEPLOY_STAG, calculateStateFromStatusCheck('buddy/pipeline/staging-k2'))),
		]),
		createCluster('PROD', calculateClusterStateFromStageStates, [
			createStage('master', createIcon(ICON.DEPLOY_PREP, calculateStateFromStatusCheck('buddy/pipeline/production'))),
			createStage('master', createIcon(ICON.DEPLOY_PROD, calculateStateFromStatusCheck('buddy/pipeline/production-k1'))),
			createStage('master', createIcon(ICON.DEPLOY_PROD, calculateStateFromStatusCheck('buddy/pipeline/production-k2'))),
		]),
	]),
	'DocPlanner/voicemail-app': createRepo('develop', [
		createCluster('DEPLOY', calculateClusterStateFromStageStates, [
			createStage('staging', createIcon(ICON.DEPLOY_STAG, calculateStateFromStatusCheck('buddy/pipeline/staging'))),
			createStage('master', createIcon(ICON.DEPLOY_PROD, calculateStateFromStatusCheck('buddy/pipeline/Deploy on production'))),
		]),
	]),
	'DocPlanner/websites-app': createRepo('develop', [
		createCluster('DEPLOY', calculateClusterStateFromStageStates, [
			createStage('master', createIcon(ICON.DEPLOY_PROD, calculateStateFromStatusCheck('buddy/pipeline/production'))),
		]),
	]),
};

export function getConfig(owner, repo) {
	for (let key in CONFIG) {
		if (key === `${owner}/${repo}`) {
			return _.cloneDeep(CONFIG[key]);
		}
	}

	return {};
}
