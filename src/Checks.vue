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
						<strong>{{ data.checkName }}</strong>
					</v-list-tile-title>
					<v-list-tile-sub-title
							:class="{
								'grey--text': true,
								'text--darken-1': isDark,
								'text--lighten-1': !isDark,
							}"
					>
						<template v-for="tagData in data.tags">
							<strong
									:key="tagData.tagName"
									:class="{
										'text-xs-lighten-1 red--text': tagData.stats.down > 0,
										'text-xs-lighten-1 orange--text': !tagData.stats.down && tagData.stats.grace
									}"
							>
								{{ tagData.tagName }}
							</strong>
						</template>
					</v-list-tile-sub-title>
				</v-list-tile-content>
			</v-list-tile>
		</template>
		<v-list-tile key="__more" v-if="filteredChecks.length > this.minVisible">
			<v-list-tile-content class="text-xs-right">
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
	import * as _ from "lodash";

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
					.value();
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
							tags: _
								.chain(checks)
								.map(check => ({
									status: check.status,
									tags: _
										.chain(check.tags)
										.split(' ')
										.filter(tag => tag !== this.tagName)
										.filter(tag => !_.endsWith(tag, '-app'))
										.map(tag => {
											return _.startsWith(tag, 'app-') ? tag.substr(4) : tag
										})
										.value()
								}))
								.reduce((acc, {status, tags}) => {
									for (let tag of tags) {
										acc[tag] = acc[tag] || {up: 0, down: 0, grace: 0, paused: 0, new: 0};
										++acc[tag][status];
									}

									return acc
								}, {})
								.map((value, key) => ({
									tagName: key,
									stats: value,
								}))
								.sortBy([
									(tagData) => tagData.stats.down ? -1 : 0,
									(tagData) => tagData.tagName,
								])
								.value()
						}
					})
					.sortBy([
						(checkData) => -checkData.stats.down,
						(checkData) => -checkData.checks.length,
						(checkData) => -checkData.stats.grace,
						(checkData) => checkData.checkName
					])
					.value();

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
