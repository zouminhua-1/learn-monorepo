const fs = require("fs");
const execa = require("execa");
// 读packages目录下的所有子文件夹/文件
const pkgs = fs
  .readdirSync("packages")
  .filter((p) => fs.statSync(`packages/${p}`).isDirectory());

// rollup -c --environment TARGET:shared
async function build(pkg) {
  return execa("rollup", ["-c", "--environment", `TARGET:${pkg}`], {
    stdio: "inherit",
  });
}

function runParallel(targets, buildFn) {
  return Promise.all(targets.map(buildFn));
}

runParallel(pkgs, build);
