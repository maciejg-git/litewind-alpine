let fs = require("fs")
let esbuild = require("esbuild")

let components = fs.readdirSync("components")

components.forEach((component) => {
  let entryDir = `components/${component}/builds`
  let outDir = `components/${component}/dist`

  if (fs.existsSync(`${entryDir}/cdn.js`)) {
    console.log(`building component ${component}`)
    esbuild.buildSync({
      entryPoints: [`${entryDir}/cdn.js`],
      bundle: true,
      platform: "browser",
      outfile: `${outDir}/cdn.js`
    })
    console.log(`building component ${component} (minify)`)
    esbuild.buildSync({
      entryPoints: [`${entryDir}/cdn.js`],
      bundle: true,
      platform: "browser",
      minify: true,
      outfile: `${outDir}/cdn.min.js`
    })
    console.log(`building component ${component} (module)`)
    esbuild.buildSync({
      entryPoints: [`${entryDir}/module.js`],
      bundle: true,
      mainFields: ["module", "main"],
      platform: "neutral",
      outfile: `${outDir}/module.esm.js`
    })
  }
})

let plugins = fs.readdirSync("plugins")

plugins.forEach((plugin) => {
  let entryDir = `plugins/${plugin}/builds`
  let outDir = `plugins/${plugin}/dist`

  if (fs.existsSync(`${entryDir}/cdn.js`)) {
    console.log(`building plugin ${plugin}`)
    esbuild.buildSync({
      entryPoints: [`${entryDir}/cdn.js`],
      bundle: true,
      platform: "browser",
      outfile: `${outDir}/cdn.js`
    })
    console.log(`building plugin ${plugin} (minify)`)
    esbuild.buildSync({
      entryPoints: [`${entryDir}/cdn.js`],
      bundle: true,
      platform: "browser",
      minify: true,
      outfile: `${outDir}/cdn.min.js`
    })
    console.log(`building plugin ${plugin} (module)`)
    esbuild.buildSync({
      entryPoints: [`${entryDir}/module.js`],
      bundle: true,
      mainFields: ["module", "main"],
      platform: "neutral",
      outfile: `${outDir}/module.esm.js`
    })
  }
})
