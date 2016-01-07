module.exports = {
    dev: {
        bsFiles: {
            src: ['src/index.html']
        },
        options: {
            server: {
                baseDir: './src'
            },
            watchTask: true,
            notify: false,
            ghostMode: false
        }
    }
}