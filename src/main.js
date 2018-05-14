import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import 'babel-polyfill'
import App from './App.vue'
import Dashboard from './Dashboard.vue'

import {ApolloClient} from 'apollo-client'
import {HttpLink} from 'apollo-link-http'
import {InMemoryCache} from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';

Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(Vuetify)

if ('production' === APP_ENVIRONMENT) {
	Raven
		.config('https://38403b3775c34bd9a351c74266e19a2d@sentry.io/142396')
		.setEnvironment(APP_ENVIRONMENT)
		.addPlugin(RavenVue, Vue)
		.install();
}

const httpLink = new HttpLink({
	uri: 'https://api.github.com/graphql',
	headers: {
		Authorization: 'Bearer ' + APP_ACCESS_TOKEN,
	}
})

// Create the apollo client
const apolloClient = new ApolloClient({
	link: httpLink,
	cache: new InMemoryCache(),
	connectToDevTools: true,
})

// Install the vue plugin
Vue.use(VueApollo)

const apolloProvider = new VueApollo({
	defaultClient: apolloClient,
})

const routes = [
	{
		name: 'repo_view',
		path: '/repos/:owner/:repo/:branch',
		component: Dashboard
	},
];

const router = new VueRouter({
	routes
})

const app = new Vue({
	el: '#app',
	apolloProvider,
	router,
	render: h => h(App),
})
