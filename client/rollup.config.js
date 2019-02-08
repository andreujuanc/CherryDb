// rollup.config.js
import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';

export default {
    input   : './src/main.ts',    
    output: {
        format: "umd",
        name: "cherrydbcient",
        file: './build/cherrydb.js',
        sourcemap: true
    },
    plugins: [
        typescript({
            typescript: require('typescript'),
            target: "es5"
        }),
        resolve()
    ]
}