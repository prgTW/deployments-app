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
	'DocPlanner/booking-front-app': [
		createStage('STAG', 'buddy/pipeline/staging', 'buddy/pipeline/staging'),
	],
	'DocPlanner/brag-app': [
		createStage('STAG', 'buddy/pipeline/staging', 'buddy/pipeline/staging'),
		createStage('PROD', 'buddy/pipeline/production', 'buddy/pipeline/production'),
	],
	'DocPlanner/crm-app': [
		createStage('PROD', 'buddy/pipeline/production', 'buddy/pipeline/production'),
	],
	'DocPlanner/dashboard-app': [
		createStage('STAG', 'buddy/pipeline/Deploy staging', 'buddy/pipeline/Deploy staging'),
		createStage('PROD', 'buddy/pipeline/Deploy production', 'buddy/pipeline/Deploy production'),
	],
	'DocPlanner/dp-icons': [
		createStage('PUBL', 'buddy/pipeline/publish package', 'buddy/pipeline/publish package'),
	],
	'DocPlanner/dp-ui-kit': [
		createStage('PUBL', 'buddy/pipeline/publish package', 'buddy/pipeline/publish package'),
	],
	'DocPlanner/fetcher-app': [
		createStage('PROD', 'buddy/pipeline/production', 'buddy/pipeline/production'),
	],
	'DocPlanner/hubspot-mirroring-app': [
		createStage('PROD', 'buddy/pipeline/production', 'buddy/pipeline/production'),
	],
	'DocPlanner/integrations-app': [
		createStage('STAG', 'buddy/pipeline/staging', 'buddy/pipeline/staging'),
		createStage('PROD', 'buddy/pipeline/production', 'buddy/pipeline/production'),
	],
	'DocPlanner/logger-app': [
		createStage('PROD', 'buddy/pipeline/production', 'buddy/pipeline/production'),
	],
	'DocPlanner/monolith-app': [
		createStage('K1', 'buddy/pipeline/staging-k1', 'buddy/pipeline/production-k1'),
		createStage('K2', 'buddy/pipeline/staging-k2', 'buddy/pipeline/production-k2'),
	],
	'DocPlanner/mydentista': [
		createStage('PROD', 'buddy/pipeline/production', 'buddy/pipeline/production'),
	],
	'DocPlanner/opinion-moderation-app': [
		createStage('PROD', 'buddy/pipeline/production', 'buddy/pipeline/production'),
	],
	'DocPlanner/opinions-app': [
		createStage('ASD', 'buddy/pipeline/asd', 'buddy/pipeline/asd'),
	],
	'DocPlanner/payments-app': [
		createStage('STAG', 'buddy/pipeline/staging', 'buddy/pipeline/staging'),
		createStage('PROD', 'buddy/pipeline/production', 'buddy/pipeline/production'),
	],
	'DocPlanner/reservation-app': [
		createStage('STAG', 'buddy/pipeline/staging', 'buddy/pipeline/staging'),
		createStage('PROD', 'buddy/pipeline/production', 'buddy/pipeline/production'),
	],
	'DocPlanner/sso-app': [
		createStage('STAG', 'buddy/pipeline/staging', 'buddy/pipeline/staging'),
		createStage('PROD', 'buddy/pipeline/production', 'buddy/pipeline/production'),
	],
	'DocPlanner/voicemail-app': [
		createStage('STAG', 'buddy/pipeline/staging', 'buddy/pipeline/staging'),
		createStage('PROD', 'buddy/pipeline/Deploy on production', 'buddy/pipeline/Deploy on production'),
	],
	'DocPlanner/websites-app': [
		createStage('PROD', 'buddy/pipeline/production', 'buddy/pipeline/production'),
	],
}

export function getPipelines(owner, repo) {
	for (let key in PIPELINES) {
		if (key === `${owner}/${repo}`) {
			return cloneDeep(PIPELINES[key]);
		}
	}

	return [];
}
