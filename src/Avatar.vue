<template>
	<div>
		<v-avatar size="32px">
			<img :src="avatarUrl">
		</v-avatar>
	</div>
</template>

<script>
	import {QUERY_VIEWER} from "./queries";

	export default {
		apollo: {
			viewer: {
				fetchPolicy: 'no-cache',
				query: QUERY_VIEWER,
				result: function () {
					this.isError = false
					this.isLoading = false
				},
				error: function () {
					this.isError = true
					this.isLoading = false
				},
			},
		},
		data: () => ({
			isError: false,
			isLoading: true,
		}),
		computed: {
			avatarUrl: function () {
				return (this.isError || this.isLoading) ? '//ssl.gstatic.com/s2/oz/images/sge/grey_silhouette.png' : this.viewer.avatarUrl
			},
		}
	}
</script>
