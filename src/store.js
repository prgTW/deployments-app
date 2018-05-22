import * as Vuex from "vuex";
import _ from 'lodash';

function createStore() {
	return new Vuex.Store({
		state: {
			isDark: JSON.parse(localStorage.getItem('isDark') || 'false'),
			starredRepos: JSON.parse(localStorage.getItem('starredRepos') || '[]'),
		},
		getters: {
			groupedStarredRepositories: (state) => {
				return _.chain(state.starredRepos).sortBy(['owner', 'name']).groupBy(r => r.owner).value()

			},
			isStarredRepository: (state) => (owner, name) => {
				return _.some(state.starredRepos, (r) => r.owner === owner && r.name === name)
			},
		},
		mutations: {
			starRepository: (state, {owner, name}) => {
				state.starredRepos.push({owner, name});
				localStorage.setItem('starredRepos', JSON.stringify(state.starredRepos))
			},
			unstarRepository: (state, {owner, name}) => {
				state.starredRepos = _.filter(state.starredRepos, (r) => !(r.owner === owner && r.name === name))
				localStorage.setItem('starredRepos', JSON.stringify(state.starredRepos))
			},
		}
	});
}

export {createStore};
