const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HTMLInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin').default;

const mode = process.env.NODE_ENV || 'development'
const isProd = mode === 'production'

module.exports = {
  mode,
  entry: {
    'assets/main': {
      import: path.join(__dirname, './src/index.js')
    }
  },
  output: {
    filename: '[name].js?[contenthash]',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  devtool: 'eval-source-map',
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    client: {
      logging: 'none',
    },
  },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@public': path.resolve(__dirname, 'public'),
    },
    symlinks: false,
    cacheWithContext: false,
    extensions: ['*', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(css|less)$/,
        exclude: /node_modules/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader',
            options: { sourceMap: isProd },
          },
          {
            loader: 'less-loader',
            options: { sourceMap: isProd },
          },
        ],
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'src'),
        use: ['@svgr/webpack'],
      },
      {
        test: /\.pcss$/i,
        exclude: /node_modules/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader',
            options: {
              sourceMap: isProd,
              modules: {
                localIdentName: isProd ? '[hash:base64:5]' : '[local]--[hash:base64:5]',
              },
            },
          },
          {
            loader: 'less-loader',
            options: { sourceMap: isProd },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.(ttf|otf|eot|woff(2)?)?$/,
        exclude: /node_modules/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][ext]'
        }
      },
      {
        test: /\.(frag|vert)$/i,
        exclude: /node_modules/,
        use: 'raw-loader',
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HTMLInlineCSSWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: '3D',
      filename: 'index.html',
      template: './public/index.html',
      inlineSource: '.(js|css)$'
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'public/favicon.ico',
          to: 'favicon.ico?[contenthash]'
        },
        {
          from: 'public/assets/textures',
          to: 'assets/textures'
        }
      ]
    }),
    new webpack.DefinePlugin({
      'VERSION': '1.0.0',
      '__REACT_DEVTOOLS_GLOBAL_HOOK__': '({ isDisabled: true })'
    }),
  ],
};
