import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from "@rollup/plugin-json";

export default {
    input: 'src/index.ts',  // 入口文件
    output: [
        {
            file: 'dist/index.cjs.js',
            format: 'cjs',
            sourcemap: true,
        },
        {
            file: 'dist/index.esm.js',
            format: 'esm',
            sourcemap: true,
        }
    ],
    plugins: [
        json(),
        resolve(),
        commonjs(),
        typescript({ tsconfig: './tsconfig.json' })
    ]
};
