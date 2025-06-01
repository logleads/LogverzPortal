const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { VueLoaderPlugin } = require('vue-loader');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ESLintPlugin = require('eslint-webpack-plugin');

const myEslintOptions = {
  extensions: [`js`, `jsx`, `ts`], //vue
  exclude: [`node_modules`],
};

const DEVELOPMENT_MODE = 'development';
const PRODUCTION_MODE = 'production';
const isProduction =
  process.argv.indexOf('production') >= 0 || process.env.NODE_ENV === PRODUCTION_MODE;

const SRC_PATH = path.join(__dirname, './src');
const DIST_PATH = path.join(__dirname, './build');

module.exports = {
  context: SRC_PATH,
  entry: './index.ts',
  output: {
    // filename: 'js/app.bundle.js',
    filename: 'js/[name].bundle.js',
    publicPath: isProduction ? '/V3/HTTP/S3/LB/ui/' : '/',
    path: DIST_PATH,
  },
  target: 'web',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    mainFields: ['module', 'browser', 'main'],
    alias: {
      vue: '@vue/runtime-dom',
      '~': path.resolve(__dirname, SRC_PATH),
    },
    fallback: {
      buffer: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: true, // Enable CSS modules automatically for files ending in `.module.css`
                namedExport: false, // Use default imports instead of namespace imports
                exportLocalsConvention: 'as-is', // Preserve class names as-is
              },
            },
          },
        ],
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: { appendTsSuffixTo: [/\.vue$/] },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              // modules: {
              //   localIdentName: isProduction ? '[hash:base64:5]' : '[local]__[hash:base64:5]',
              // },
              sourceMap: !isProduction,
              importLoaders: 1,
            },
          },
          'sass-loader',
        ],
      }
      ,
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext]',
        },
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
      },
    ],
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 1 * 1024 * 1024,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/styles.css',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled',
      generateStatsFile: false,
      statsOptions: { source: false },
    }),
    new CleanWebpackPlugin(),
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     NODE_ENV: isProduction ? "'production'" : "'development'",
    //   },
    // }),
    new HtmlPlugin({
      title: 'LogLeads',
      //favicon: "./assets/images/favicon.ico",
      template: `${__dirname}/template.html`,
      filename: 'index.html',
    }),
    new CopyPlugin({
      patterns: [{ from: './assets/images/favicon.ico', to: 'images/favicon.ico' }],
    }),
    new VueLoaderPlugin(),
    new Dotenv({
      systemvars: true,
      safe: true,
    }),
  ],
};
