module.exports = {
    lintOnSave: false,
    runtimeCompiler: true,
    devServer: {
        proxy: "http://workoutspro.test/"
    },
    outputDir: "../public",
    indexPath: "index.html",
    transpileDependencies: ["vuetify"],
    css: {
        loaderOptions: {
            scss: {
                prependData:
                    '\n                @import "~@/assets/scss/fonts.scss";\n                @import "~@/assets/scss/variables.scss";\n                @import "~@/assets/scss/global.scss";\n                '
            }
        }
    },
    pwa: {
        name: "WorkoutsPRO",
        appleMobileWebAppCapable: "yes"
    }
};
