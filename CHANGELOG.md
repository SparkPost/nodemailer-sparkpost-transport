# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [2.1.0] - 2018/07/16

### Added
- Support for setting the SparkPost endpoint. Closes #20.

## [2.0.0] - 2017/01/06 *breaking*
With this major release, we are now using the latest 2.x version of the node-sparkpost library.
This removes support for versions of Node.js below 4.0.

### Added
- Populate node-sparkpost's stackIdentity option

### Updated
- Updated to [`sparkpost@2.1.0`](https://github.com/SparkPost/node-sparkpost/).

### Removed
- No longer supporting Node.js versions 0.10 & 0.12. We will be following the [LTS Schedule](https://github.com/nodejs/LTS) going forward.

## [1.1.0] - 2016/11/10
### Added
- Support for Nodemailer's `from.name` and `from.address` fields by @ewandennis. Closes #10.

### Updated
- Switched to using `npm version` for releases by @aydrian. Closes #13.
- Updated to `sparkpost@1.3.8`.
- Updated to `mocha@3.1.2`.
- Updated to `sinon@1.17.6`.

### Removed
- `with-package` package no longer needed.

## [1.0.0] - 2016/07/26
- [#7](https://github.com/SparkPost/nodemailer-sparkpost-transport/pull/7) Implemented the Nodemailer API (@ewandennis)

## [0.1.2] - 2016/05/17
- [#4](https://github.com/SparkPost/nodemailer-sparkpost-transport/pull/4) Removed dotenv, updated README, and general cleanup. Closes #3 (@aydrian)
- [#2](https://github.com/SparkPost/nodemailer-sparkpost-transport/pull/2) Sort available options lists (@simison)
- [#1](https://github.com/SparkPost/nodemailer-sparkpost-transport/pull/1) fixed typo in readme file (@OogieBoogieInJSON)

## [0.1.1] - 2016/05/17
- Unpublished from NPM. Republished as v0.1.2

## 0.1.0 - 2015/08/28
- Initial release

[Unreleased]: https://github.com/SparkPost/nodemailer-sparkpost-transport/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/SparkPost/nodemailer-sparkpost-transport/compare/1.1.0...v2.0.0
[1.1.0]: https://github.com/SparkPost/nodemailer-sparkpost-transport/compare/1.0.0...v1.1.0
[1.0.0]: https://github.com/SparkPost/nodemailer-sparkpost-transport/compare/0.1.2...1.0.0
[0.1.2]: https://github.com/SparkPost/nodemailer-sparkpost-transport/compare/0.1.1...0.1.2
[0.1.1]: https://github.com/SparkPost/nodemailer-sparkpost-transport/compare/v0.1.0...0.1.1
