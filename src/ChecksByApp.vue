<template>
		<v-expansion-panel>
			<v-expansion-panel-content
				v-for="(data, appName) in dataByApp"
				:key="appName"
				:class="{
					'white--text': true,
					'red lighten-1': data.stats.down > 0,
					'yellow': 0 === data.stats.down && data.stats.grace > 0,
					'green lighten-1': 0 === data.stats.down && 0 === data.stats.grace,
				}"
			>
				<div slot="header">
					<v-layout row justify-space-around>
						<v-flex xs9>
							<strong>{{ appName }}</strong>
						</v-flex>
						<v-flex xs2>{{ data.stats.up }} / {{ data.stats.grace }} / {{ data.stats.down }}</v-flex>
					</v-layout>
				</div>
				<v-card>
					<v-card-text>
						<pre>{{ data.checks }}</pre>
					</v-card-text>
				</v-card>
			</v-expansion-panel-content>
		</v-expansion-panel>
</template>
<script>
	export default {
		name: 'ChecksByApp',
		props: {
			dataByApp: Object,
		}
	}
</script>
