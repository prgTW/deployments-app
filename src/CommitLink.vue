<template>
	<div>
		<v-btn :icon="$vuetify.breakpoint.lgAndDown"
			   color="blue"
			   flat
			   round
			   :href="commit.url"
			   :small="$vuetify.breakpoint.xsAndDown"
			   target="_blank">
			<v-icon class="hidden-xl-only">link</v-icon>
			<strong class="hidden-lg-and-down">
				{{ commit.abbreviatedOid }}
			</strong>
		</v-btn>
	</div>
</template>
<script>
	export default {
		name: 'CommitLink',
		props: {
			commit: Object,
		}
	}
</script>
