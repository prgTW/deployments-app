import cloneDeep from 'lodash/cloneDeep'

function createContext(context, icon) {
	return {
		icon: icon,
		context: context,
		state: undefined,
		in_progress: false,
	}
}

function createStage(name, stagingContext, productionContext) {
	return {
		name: name,
		stages: {
			staging: createContext(stagingContext, 'business'),
			production: createContext(productionContext, 'public'),
		},
	};
}

const PIPELINES = {
	'DocPlanner/booking-backend-app': [
		createStage('PROD', 'buddy/pipeline/production', 'buddy/pipeline/production'),
	],
	'DocPlanner/booking-front-app': [],
	'DocPlanner/brag-app': [],
	'DocPlanner/crm-app': [],
	'DocPlanner/dashboard-app': [],
	'DocPlanner/dp-icons': [],
	'DocPlanner/dp-ui-kit': [],
	'DocPlanner/fetcher-app': [],
	'DocPlanner/hubspot-mirroring-app': [],
	'DocPlanner/integrations-app': [],
	'DocPlanner/logger-app': [],
	'DocPlanner/monolith-app': [
		createStage('K1', 'buddy/pipeline/staging-k1', 'buddy/pipeline/production-k1'),
		createStage('K2', 'buddy/pipeline/staging-k2', 'buddy/pipeline/production-k2'),
	]
	,
	'DocPlanner/mydentista': [],
	'DocPlanner/opinion-moderation-app': [],
	'DocPlanner/opinions-app': [],
	'DocPlanner/payments-app': [
		createStage('STAG', 'buddy/pipeline/staging', 'buddy/pipeline/production'),
		createStage('PROD', 'buddy/pipeline/staging', 'buddy/pipeline/production'),
	],
	'DocPlanner/reservation-app': [],
	'DocPlanner/sso-app': [],
	'DocPlanner/voicemail-app': [],
	'DocPlanner/websites-app': [],
}

export function getPipelines(owner, repo) {
	for (let key in PIPELINES) {
		if (key === `${owner}/${repo}`) {
			return cloneDeep(PIPELINES[key]);
		}
	}

	return [];
}
