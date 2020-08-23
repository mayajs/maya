<p align="center"><img src="https://github.com/mayajs/maya/blob/master/maya.svg"></p>
<p align="center">A simple <a href="http://nodejs.org" target="_blank">Node.js</a> framework for creating fast and scalable server-side applications.</p>
<p align="center">
  <a href="https://www.npmjs.com/package/@mayajs/core"><img src="https://img.shields.io/npm/v/@mayajs/core.svg?style=for-the-badge&logo=appveyor" alt="Version"></a>
  <a href="https://www.npmjs.com/package/@mayajs/core"><img src="https://img.shields.io/npm/dm/@mayajs/core.svg?style=for-the-badge&logo=appveyor" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/@mayajs/core"><img src="https://img.shields.io/npm/l/@mayajs/core?style=for-the-badge&logo=appveyor" alt="License"></a>
  <a href="https://github.com/microsoft/typescript-tslint-plugin"><img src="https://img.shields.io/badge/code%20style-standard-blue.svg?style=for-the-badge&logo=appveyor" alt="Code Style"></a>
</p>

MayaJS is designed for simplicity and ease of use for beginners. It is built using [Typescript](https://www.typescriptlang.org/) to take advantage of strong type checking and at the same time preserving support for pure Javascript. It also has support for [MongoDb](https://www.mongodb.com/) and SQL databases. It has its own routing library and doesn't need third party routing libraries to run under the hood.

# Installation

- Run `npm i @mayajs/cli -g` to install MayaJS globally in your local machine.
  > Install the latest [Node.js stable build](https://nodejs.org/en/download/) before running this command

# Quick Start

- Run `maya new my-new-app`.
- Run `cd my-new-app` to go inside your project folder.
- Run `maya serve` to start your MayaJS project.

> In the case where the port number is already in use or where you want to run it on a different port number, use `--port` to specify a different port. **i.e. `maya serve --port=4444`**

# Ecosystem

| Project          | Description            |
| ---------------- | ---------------------- |
| [@mayajs/core]   | MayaJS core library    |
| [@mayajs/common] | MayaJS common modules  |
| [@mayajs/router] | NodeJS routing library |
| [@mayajs/cli]    | Project scaffolding    |
| [@mayajs/mongo]  | MongoDB Plugin         |
| [@mayajs/sql]    | SQL Plugin             |

[@mayajs/core]: https://github.com/mayajs/maya
[@mayajs/common]: https://github.com/mayajs/common
[@mayajs/router]: https://github.com/mayajs/router
[@mayajs/cli]: https://github.com/mayajs/cli
[@mayajs/mongo]: https://github.com/mayajs/mongo
[@mayajs/sql]: https://github.com/mayajs/sql

# Documentation

To check out [live examples](https://github.com/mayajs/sample) and docs, visit [mayajs.io](https://mayajs.io).

## Collaborating

See collaborating guides [here.](https://github.com/mayajs/maya/blob/master/COLLABORATOR_GUIDE.md)

## People

Author and maintainer [Mac Ignacio](https://github.com/Mackignacio)

## License

[MIT](https://github.com/mayajs/maya/blob/master/LICENSE)
