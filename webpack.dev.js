const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
	mode: 'development',
	output: {
		path: path.resolve(__dirname, './dist'),
		publicPath: '/dist',
		filename: 'build.js'
	},
	devServer: {
		historyApiFallback: true,
		noInfo: true,
		overlay: true,
	},
	devtool: '#eval-source-map'
});
