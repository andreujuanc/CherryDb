// rollup.config.js
import typescript from 'rollup-plugin-typescript';

export default {
    input   : './src/main.ts',    
    output: {
        format: "es",
        name: "cherrydbcient",
        file: './build/cherrydb.js',
        sourcemap: true
    },
    plugins: [
        typescript({
            typescript: require('typescript'),
            target: "ES2017"
        })
    ]
}