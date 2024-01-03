const json = require("@rollup/plugin-json");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const path = require("path");
const pkg = process.env.TARGET;
const resolve = (p) => path.resolve(`${__dirname}/packages/${pkg}`, p);

const { buildOptions } = require(resolve("package.json"));

const formatMap = {
  esm: {
    file: resolve(`dist/${pkg}.esm.js`),
    format: "esm",
  },
  umd: {
    file: resolve(`dist/${pkg}.umd.js`),
    format: "umd",
  },
  cjs: {
    file: resolve(`dist/${pkg}.cjs.js`),
    format: "cjs",
  },
};

// output: {
//   name: buildOptions.name,
//   file: resolve(`dist/${name}.esm.js`),
//   format: "esm",
// },

function createConfig(output) {
  output.name = buildOptions.name;
  return {
    input: resolve("src/index.js"),
    output,
    plugins: [json(), nodeResolve()],
  };
}

const configs = buildOptions.formats.map((format) =>
  createConfig(formatMap[format])
);

module.exports = configs;
