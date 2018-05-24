import cloneDeep from 'lodash/cloneDeep'

function createContext(ref, context, icon) {
	return {
		icon: icon,
		ref: ref,
		context: context,
		state: undefined,
		in_progress: false,
	}
}

function createStage(name, stagingRef, stagingContext, productionRef, productionContext) {
	return {
		name: name,
		stages: {
			staging: createContext(stagingRef, stagingContext, 'business'),
			production: createContext(productionRef, productionContext, 'public'),
		},
	};
}

export const CONFIG = {
	'DocPlanner/booking-backend-app': {
		ref: 'develop',
		pipelines: [
			createStage('PROD', 'develop', 'buddy/pipeline/production', 'buddy/pipeline/production'),
		]
	},
	'DocPlanner/booking-front-app': {
		ref: 'develop',
		pipelines: [
			createStage('STAG', 'develop', 'buddy/pipeline/staging', 'buddy/pipeline/staging'),
		]
	},
	'DocPlanner/brag-app': {
		ref: 'develop',
		pipelines: [
			createStage('STAG', 'develop', 'buddy/pipeline/staging', 'buddy/pipeline/staging'),
			createStage('PROD', 'develop', 'buddy/pipeline/production', 'buddy/pipeline/production'),
		]
	},
	'DocPlanner/crm-app': {
		ref: 'develop',
		pipelines: [
			createStage('PROD', 'develop', 'buddy/pipeline/production', 'buddy/pipeline/production'),
		]
	},
	'DocPlanner/dashboard-app': {
		ref: 'develop',
		pipelines: [
			createStage('STAG', 'develop', 'buddy/pipeline/Deploy staging', 'buddy/pipeline/Deploy staging'),
			createStage('PROD', 'develop', 'buddy/pipeline/Deploy production', 'buddy/pipeline/Deploy production'),
		]
	},
	'DocPlanner/dp-icons': {
		ref: 'develop',
		pipelines: [
			createStage('PUBL', 'develop', 'buddy/pipeline/publish package', 'buddy/pipeline/publish package'),
		]
	},
	'DocPlanner/dp-ui-kit': {
		ref: 'develop',
		pipelines: [
			createStage('PUBL', 'develop', 'buddy/pipeline/publish package', 'buddy/pipeline/publish package'),
		]
	},
	'DocPlanner/fetcher-app': {
		ref: 'develop',
		pipelines: [
			createStage('PROD', 'develop', 'buddy/pipeline/production', 'buddy/pipeline/production'),
		]
	},
	'DocPlanner/hubspot-mirroring-app': {
		ref: 'develop',
		pipelines: [
			createStage('PROD', 'develop', 'buddy/pipeline/production', 'buddy/pipeline/production'),
		]
	},
	'DocPlanner/integrations-app': {
		ref: 'develop',
		pipelines: [
			createStage('STAG', 'develop', 'buddy/pipeline/staging', 'buddy/pipeline/staging'),
			createStage('PROD', 'develop', 'buddy/pipeline/production', 'buddy/pipeline/production'),
		]
	},
	'DocPlanner/logger-app': {
		ref: 'develop',
		pipelines: [
			createStage('PROD', 'develop', 'buddy/pipeline/production', 'buddy/pipeline/production'),
		]
	},
	'DocPlanner/monolith-app': {
		baseRef: 'develop',
		pipelines: [
			createStage('PA', 'staging', 'buddy/pipeline/phraseapp update', 'production', 'buddy/pipeline/phraseapp update'),
			createStage('K1', 'staging', 'buddy/pipeline/staging-k1', 'master', 'buddy/pipeline/production-k1'),
			createStage('K2', 'staging', 'buddy/pipeline/staging-k2', 'master', 'buddy/pipeline/production-k2'),
		]
	},
	'DocPlanner/mydentista': {
		ref: 'develop',
		pipelines: [
			createStage('PROD', 'develop', 'buddy/pipeline/production', 'buddy/pipeline/production'),
		]
	},
	'DocPlanner/opinion-moderation-app': {
		ref: 'develop',
		pipelines: [
			createStage('PROD', 'develop', 'buddy/pipeline/production', 'buddy/pipeline/production'),
		]
	},
	'DocPlanner/opinions-app': {
		ref: 'develop',
		pipelines: [
			createStage('ASD', 'develop', 'buddy/pipeline/asd', 'buddy/pipeline/asd'),
		]
	},
	'DocPlanner/payments-app': {
		ref: 'develop',
		pipelines: [
			createStage('STAG', 'develop', 'buddy/pipeline/staging', 'buddy/pipeline/staging'),
			createStage('PROD', 'develop', 'buddy/pipeline/production', 'buddy/pipeline/production'),
		]
	},
	'DocPlanner/reservation-app': {
		ref: 'develop',
		pipelines: [
			createStage('STAG', 'develop', 'buddy/pipeline/staging', 'buddy/pipeline/staging'),
			createStage('PROD', 'develop', 'buddy/pipeline/production', 'buddy/pipeline/production'),
		]
	},
	'DocPlanner/sso-app': {
		ref: 'develop',
		pipelines: [
			createStage('STAG', 'develop', 'buddy/pipeline/staging', 'buddy/pipeline/staging'),
			createStage('PROD', 'develop', 'buddy/pipeline/production', 'buddy/pipeline/production'),
		]
	},
	'DocPlanner/voicemail-app': {
		ref: 'develop',
		pipelines: [
			createStage('STAG', 'develop', 'buddy/pipeline/staging', 'buddy/pipeline/staging'),
			createStage('PROD', 'develop', 'buddy/pipeline/Deploy on production', 'buddy/pipeline/Deploy on production'),
		]
	},
	'DocPlanner/websites-app': {
		ref: 'develop',
		pipelines: [
			createStage('PROD', 'develop', 'buddy/pipeline/production', 'buddy/pipeline/production'),
		]
	},
}

export function getConfig(owner, repo) {
	for (let key in CONFIG) {
		if (key === `${owner}/${repo}`) {
			return cloneDeep(CONFIG[key]);
		}
	}

	return {};
}
