<template>
	<v-list two-line>
		<template v-for="(data, i) in checks2.slice(0, this.visibleCount)">
			<v-list-tile :key="i">
				<v-list-tile-content>
					<v-list-tile-title>
						{{ data.checkName }}
					</v-list-tile-title>
					<v-list-tile-sub-title>
						{{ data.locales }}
					</v-list-tile-sub-title>
				</v-list-tile-content>
			</v-list-tile>
		</template>
		<v-list-tile :key="'__more'" v-if="checks.length > this.minVisible">
			<v-list-tile-content>
				<v-list-tile-sub-title>
					<a href="#" @click.prevent="limit = !limit">
						<template v-if="limit">
							... and {{ checks.length - this.visibleCount }} more
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
	export default {
		name: 'Checks',
		data: () => ({
			minVisible: 3,
			maxVisible: 9999,
			limit: true,
		}),
		computed: {
			visibleCount: function () {
				return this.limit ? this.minVisible : this.maxVisible;
			},
			checks2: function () {
				let data = _.groupBy(this.checks, check => {
					return _
						.chain(check.name)
						.replace(/^\[\w+\]\s*/, '')
						.value()
				})
				data = _.map(data, (checks, checkName) => {
					return {
						checkName: checkName,
						checks: checks,
						locales: _
							.chain(checks)
							.map(check => check.tags)
							.map(tag => _.split(tag, ' '))
							.flatten()
							.filter(tag => tag !== this.tagName)
							.filter(tag => !_.endsWith(tag, '-app'))
							.sort()
							.sortedUniq()
							.join(', ')
							.value()
					}
				})

				return data
			},
		},
		props: {
			tagName: String,
			checks: Array,
			detailed: Boolean
		}
	}
</script>
