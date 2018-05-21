<template>
	<v-layout row justify-center>
		<v-flex xs12 xl10>
			<v-alert :value="true" type="info">
				Choose project from menu
			</v-alert>
		</v-flex>
	</v-layout>
</template>

<script>
	export default {
		// apollo: {
		// 	q0: {
		// 		fetchPolicy: 'no-cache',
		// 		query: buildQuery(CONFIG),
		// 		result(result) {
		// 			console.log(result)
		// 		},
		// 		error() {
		// 			console.log(args)
		// 		}
		// 	},
		// },
		data: () => ({}),
	}
</script>
