// const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

module.exports = {
    lintOnSave: false,
    runtimeCompiler: true,

    "devServer": {
        "proxy": "http://workoutspro.test/"
    },

    "outputDir": "../public",

    // modify the location of the generated HTML file.
    // make sure to do this only in production.
    indexPath: process.env.NODE_ENV === 'production' ?
        '../resources/views/index.blade.php' : 'index.html',

    "transpileDependencies": [
        "vuetify"
    ],

    css: {
        loaderOptions: {
            // by default the `sass` option will apply to both syntaxes
            // because `scss` syntax is also processed by sass-loader underlyingly
            // but when configuring the `data` option
            // `scss` syntax requires an semicolon at the end of a statement, while `sass` syntax requires none
            // in that case, we can target the `scss` syntax separately using the `scss` option
            scss: {
                prependData: `
                @import "~@/assets/scss/fonts.scss";
                @import "~@/assets/scss/variables.scss";
                @import "~@/assets/scss/global.scss";
                `
            }
        }
    },

    // used to generate all the icons needed for pwa support. Should only be run once or whenever is needed.
    // configureWebpack: {
    //     plugins: [
    //         new FaviconsWebpackPlugin('./public/img/logo-512x512.png')
    //     ]
    // },

    pwa: {
        name: 'WorkoutsPro',
        // themeColor: '#F4C257',
        appleMobileWebAppCapable: 'yes'
    }
}
