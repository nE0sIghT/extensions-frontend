// vetur.config.js
/** @type {import('vls').VeturConfig} */
module.exports = {
    settings: {},
    projects: [
        {
            root: './',
            globalComponents: [
                './src/**/*.vue',
                './src/js/*.js',
            ]
        }
    ]
}
