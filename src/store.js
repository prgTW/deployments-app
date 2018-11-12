import * as Vuex from "vuex";
import _ from 'lodash';

function createStore() {
	return new Vuex.Store({
		state: {
			isDark: JSON.parse(localStorage.getItem('isDark') || 'false'),
			starredRepos: JSON.parse(localStorage.getItem('starredRepos') || '[]'),
		},
		getters: {
			isDark: (state) => state.isDark,
			groupedStarredRepositories: (state) => {
				return _.chain(state.starredRepos).sortBy(['owner', 'name', 'branch']).groupBy(r => r.owner).value()

			},
			isStarredRepository: (state) => (owner, name) => {
				return _.some(state.starredRepos, (r) => r.owner === owner && r.name === name)
			},
		},
		mutations: {
			toggleDark: (state) => {
				state.isDark = !state.isDark;
				localStorage.setItem('isDark', JSON.stringify(state.isDark))
			},
			starRepository: (state, {owner, name, branch}) => {
				state.starredRepos.push({owner, name, branch});
				localStorage.setItem('starredRepos', JSON.stringify(state.starredRepos))
			},
			unstarRepository: (state, {owner, name}) => {
				state.starredRepos = _.filter(state.starredRepos, (r) => !(r.owner === owner && r.name === name));
				localStorage.setItem('starredRepos', JSON.stringify(state.starredRepos))
			},
		}
	});
}

export {createStore};
