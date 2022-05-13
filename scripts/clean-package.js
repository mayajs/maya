const fs = require("fs");
const path = require("path");
const env = require("./variables");

// Define absolute paths for original pkg and temporary pkg.
const ORIG_PATH = path.resolve(__dirname, env.ORIG_PATH);
const TEMP_PATH = path.resolve(__dirname, env.TEMP_PATH);

// Obtain original `package.json` contents.
const packageData = require(ORIG_PATH);

// Write/cache the original `package.json` data to `cached-package.json` file.
fs.writeFile(TEMP_PATH, JSON.stringify(packageData, null, 2), function (err) {
  if (err) throw err;
});

// Define properties to remove in `package.json`.
const removableProps = ["devDependencies"];

// Remove the specified properties from `package.json`.
removableProps.forEach((prop) => delete packageData[prop]);

// Define new scripts
const scripts = {
  clean: "rimraf interface && rimraf index.js && rimraf index.d.ts && rimraf utils && rimraf router && rimraf lib",
  postpack: "npm run clean && node ./scripts/restore-package.js",
};

// Replace scripts value
packageData.scripts = scripts;

// Replace main value
packageData.main = "index.js";

// Overwrite original `package.json` with new data (i.e. minus the specific data).
fs.writeFile(ORIG_PATH, JSON.stringify(packageData, null, 2), function (err) {
  if (err) throw err;
});
