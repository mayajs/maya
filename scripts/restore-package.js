const fs = require("fs");
const path = require("path");
const env = require("./variables");

// Define absolute paths for original pkg and temporary pkg.
const ORIG_PATH = path.resolve(__dirname, env.ORIG_PATH);
const TEMP_PATH = path.resolve(__dirname, env.TEMP_PATH);

// Obtain original/cached contents from `cached-package.json`.
const packageData = JSON.stringify(require(TEMP_PATH), null, 2) + "\n";

// Write data from `cached-package.json` back to original `package.json`.
fs.writeFile(ORIG_PATH, packageData, function (err) {
  if (err) throw err;
});

// Delete the temporary `cached-package.json` file.
fs.unlink(TEMP_PATH, function (err) {
  if (err) throw err;
});
