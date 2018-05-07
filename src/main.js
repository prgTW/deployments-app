import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'
import 'babel-polyfill'
import App from './App.vue'
import Dashboard from './Dashboard.vue'

Vue.use(VueRouter)
Vue.use(Vuetify)

const routes = [
	{
		name: 'repo_view',
		path: '/repos/:owner/:repo',
		component: Dashboard
	},
];

const router = new VueRouter({
	routes
})

const app = new Vue({
	render: h => h(App),
	router
}).$mount('#app')
