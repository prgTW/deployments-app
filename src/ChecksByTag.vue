<template>
	<v-container grid-list-md fluid>
		<v-layout row wrap>
			<v-flex
					v-for="(data, tagName) in checksByTag"
					:key="tagName"
					d-flex
					xs12 sm6 md4 xl3
			>
				<v-card>
					<v-card-title
							:class="{
							'grey darken-2': isDark,
							'grey lighten-4': !isDark,
							'px-2 py-1': true,
						}"
					>
						<span class="headline">{{ tagName }}</span>
						<v-spacer></v-spacer>
						<Stats :stats="data.stats" :statuses="['down', 'grace', 'paused']"/>
					</v-card-title>
					<v-divider v-if="data.checks"/>

					<Checks :tagName="tagName" :checks="data.checks" :statuses="['down', 'grace', 'paused']"/>
				</v-card>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
	import Checks from "./Checks";
	import Stats from "./Stats";
	import {mapGetters} from 'vuex';

	export default {
		name: 'ChecksByTag',
		components: {Checks, Stats},
		data: () => ({}),
		computed: {
			...mapGetters([
				'isDark',
			]),
			checksByTag: function () {
				let data = {};

				_.forEach(this.checks, check => {
					let tags = _
						.chain(check.tags.split(' '))
						.filter(tag => false === _.startsWith(tag, 'app-'))
						.filter(tag => false === _.endsWith(tag, '-app'))
						.value()

					if (0 === tags.length) {
						tags = ['__untagged'];
					}
					_.forEach(tags, tag => {
						data[tag] = data[tag] || [];
						data[tag].push(check)
					})
				});

				data = _
					.chain(data)
					.mapValues((checks, tagName) => ({
						tagName: tagName,
						checks: checks,
						stats: _.extend({},
							{up: 0, down: 0, grace: 0, paused: 0, new: 0},
							_.countBy(checks, check => check.status),
						)
					}))
					.sortBy(data, ({tagName}) => tagName)
					.value()
				data = _.keyBy(data, ({tagName}) => tagName)

				return data
			},
		},
		props: {
			checks: Array,
			detailed: Boolean
		}
	}
</script>
