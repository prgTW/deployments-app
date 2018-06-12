<template>
	<v-container text-xs-center fluid fill-height>
		<v-layout align-center justify-center>
			<v-flex xs12 sm8 md4>
				<slot>
					<v-progress-linear indeterminate color="grey"></v-progress-linear>
				</slot>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
	export default {
		name: 'Centered'
	}
</script>
