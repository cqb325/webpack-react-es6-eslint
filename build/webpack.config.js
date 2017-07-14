var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var WebpackMd5Hash = require('webpack-md5-hash');
var HashedModuleIdsPlugin = require('./HashedModuleIdsPlugin');
var HtmlwebpackPlugin = require('html-webpack-plugin');

// 辅助函数
var utils = require('./utils');
var fullPath  = utils.fullPath;
var pickFiles = utils.pickFiles;

// 项目根路径
var ROOT_PATH = fullPath('../');
// 项目源码路径
var SRC_PATH = ROOT_PATH + '/src';
// 产出路径
var DIST_PATH = ROOT_PATH + '/assets';
// node_modules
var NODE_MODULES_PATH =  ROOT_PATH + '/node_modules';
//开发模式
var __DEV__ = process.env.NODE_ENV !== 'production';

// loaders
var CACHE_PATH = ROOT_PATH + '/cache';

var alias = {};
// var alias = pickFiles({
//     id: /(conf\/[^\/]+).js$/,
//     pattern: SRC_PATH + '/conf/*.js'
// });

var config = {
    context: SRC_PATH,
    entry: {
        app: [SRC_PATH + '/pages/app.js'],
        lib: ['react', 'react-dom']
    },
    output: {
        path: DIST_PATH,
        // chunkhash 不能与 --hot 同时使用
        // see https://github.com/webpack/webpack-dev-server/issues/377
        filename: __DEV__ ? 'modules/[name].js' : 'modules/[name].[hash].js',
    },
    module: {
        loaders: [
            // 使用 babel 编译 jsx、es6
            {
                test: /\.js$/,
                exclude: /node_modules/,
                // 这里使用 loaders ，因为后面还需要添加 loader
                loaders: ['babel-loader?cacheDirectory=' + CACHE_PATH, 'eslint-loader']
            },
            // 图片路径处理，压缩
            {
                test: /\.(?:jpg|gif|png)$/,
                loaders: [
                    'file-loader?name=imgs/[hash].[ext]'
                ]
            },
            // 字体.
            {
                test: /\.(?:woff|woff2|eot|ttf|svg)$/,
                loaders: [
                    'url-loader?limit=8000&name=cmui-font/[hash].[ext]'
                ]
            },
            {
                test: /\.less/,
                loaders: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.(scss|sass)$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            }
        ]
    },
    resolve: {
        alias: alias
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || 'development')
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['lib', 'manifest']
        }),
        // 使用 hash 作模块 ID，文件名作ID太长了，文件大小剧增
        new HashedModuleIdsPlugin(),
        // 根据文件内容生成 hash
        new WebpackMd5Hash(),

        new HtmlwebpackPlugin({
            filename: 'index.html',
            chunks: ['app', 'lib'],
            template: SRC_PATH + '/pages/app.html',
            minify: __DEV__ ? false : {
                collapseWhitespace: true,
                collapseInlineTagWhitespace: true,
                removeRedundantAttributes: true,
                removeEmptyAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                removeComments: true
            }
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                eslint: {
                    configFile: './.eslintrc',
                    ignorePath: './.eslintignore'
                }
            }
       })
    ],
    devServer: {
        port: 4000,
        https: false,
        compress: true,
        hot: true,
        historyApiFallback: true
    }
}

// 内嵌 manifest 到 html 页面
config.plugins.push(function() {
    this.plugin('compilation', function(compilation) {
        compilation.plugin('html-webpack-plugin-after-emit', function(file, callback) {
            var manifest = '';
            Object.keys(compilation.assets).forEach(function(filename) {
                if (/\/?manifest.[^\/]*js$/.test(filename)) {
                    manifest = '<script>' + compilation.assets[filename].source() + '</script>';
                }
            });
            if (manifest) {
                var htmlSource = file.html.source();
                htmlSource = htmlSource.replace(/(<\/head>)/, manifest + '$1');
                file.html.source = function() {
                    return htmlSource;
                };
            }
            callback(null, file);
        });
    });
});

module.exports = config;
