<!DOCTYPE html>
<html lang="en">
<head>
	<link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons" rel="stylesheet">
	<link href="https://unpkg.com/vuetify/dist/vuetify.min.css" rel="stylesheet">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">
	<meta charset="utf-8">
	<title>Deployments dashboard</title>
</head>
<body>
<div id="app"></div>
<script>
	// noinspection JSAnnotator
	const APP_ACCESS_TOKEN = <?php echo json_encode($_SERVER['HTTP_X_FORWARDED_ACCESS_TOKEN'] ?? ''); ?>;
	const APP_ENVIRONMENT = 'production';
</script>
</body>
</html>
