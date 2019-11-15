const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
    entry: {
        index: __dirname + '/src/index.js'
    },
    output: {
        path: __dirname + '/dist',
        filename: 'js/[name].js'
    },
    mode: 'development',
    // mode: 'production',
    devtool: 'cheap-module-eval-source-map',
    module:{
        rules:[
            {
                test: /\.(jpeg|png|gif|jpg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            publicPath: '../',
                            name: 'images/[name].[ext]'
                        }
                    },
                ]
            },
            {
                test:/\.css$/,
                use:[
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    }
                ]
            }
        ]
    },
    plugins:[
        new ExtractTextPlugin({
            filename: 'css/[name].css'
        }),
        new HtmlWebpackPlugin({
            filename: 'view/index.html',
            template: 'src/index.html'
        })
    ]
}