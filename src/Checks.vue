<template>
	<v-list dense two-line>
		<template v-for="(data, i) in filteredChecks.slice(0, this.visibleCount)">
			<v-list-tile :key="i">
				<v-list-tile-avatar>
					<strong class="red--text">{{ data.stats.down }}</strong>
					&nbsp;/&nbsp;
					<strong class="orange--text">{{ data.stats.grace }}</strong>
				</v-list-tile-avatar>
				<v-list-tile-content>
					<v-list-tile-title>
						{{ data.checkName }}
					</v-list-tile-title>
					<v-list-tile-sub-title
							:class="{
								'grey--text': true,
								'text--darken-1': isDark,
								'text--lighten-1': !isDark,
							}"
					>
						{{ data.locales.join(', ') }}
					</v-list-tile-sub-title>
				</v-list-tile-content>
			</v-list-tile>
		</template>
		<v-list-tile :key="'__more'" v-if="filteredChecks.length > this.minVisible">
			<v-list-tile-content>
				<v-list-tile-sub-title>
					<a href="#" @click.prevent="limit = !limit">
						<template v-if="limit">
							... and {{ filteredChecks.length - this.visibleCount }} more
						</template>
						<template v-else>
							hide
						</template>
					</a>
				</v-list-tile-sub-title>
			</v-list-tile-content>
		</v-list-tile>
	</v-list>
</template>

<script>
	import {mapGetters} from 'vuex';

	export default {
		name: 'Checks',
		data: () => ({
			minVisible: 3,
			maxVisible: 9999,
			limit: true,
		}),
		computed: {
			...mapGetters([
				'isDark',
			]),
			visibleCount: function () {
				return this.limit ? this.minVisible : this.maxVisible;
			},
			filteredChecks: function () {
				let data = _
					.chain(this.checks)
					.filter(check => this.statuses.includes(check.status))
					.groupBy(check => {
						return _
							.chain(check.name)
							.replace(/^\[\w+\]\s*/, '')
							.value()
					})
					.value()
				data = _
					.chain(data)
					.map((checks, checkName) => {
						return {
							checkName: checkName,
							checks: checks,
							stats: _.extend({},
								{up: 0, down: 0, grace: 0, paused: 0, new: 0},
								_.countBy(checks, check => check.status),
							),
							locales: _
								.chain(checks)
								.map(check => check.tags)
								.map(tag => _.split(tag, ' '))
								.flatten()
								.filter(tag => tag !== this.tagName)
								.filter(tag => !_.endsWith(tag, '-app'))
								.sort()
								.sortedUniq()
								.value()
						}
					})
					.sortBy([
						(checkData) => -checkData.stats.down,
						(checkData) => -checkData.checks.length,
						(checkData) => -checkData.stats.grace,
						(checkData) => checkData.checkName
					])
					.value()

				return data
			},
		},
		props: {
			tagName: String,
			checks: Array,
			statuses: {
				type: Array,
				default: ['down', 'grace', 'paused'],
			},
			detailed: Boolean
		}
	}
</script>
