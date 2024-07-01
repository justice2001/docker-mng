import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
    input: "src/index.ts",
    output: [
        {
            file: "lib/index.cjs.js",
            format: "cjs"
        },
        {
            file: "lib/index.esm.js",
            format: "es"
        }
    ],
    plugins: [typescript(), nodeResolve(), commonjs()]
}