# node-hako-api

> An unofficial lib to retrieve data from ln.hako.vn website, no username or password required. Other methods are not implemented yet. Feel free to contribute. 

[![NPM version](https://badge.fury.io/js/nodehakoapi.svg)](https://npmjs.org/package/nodehakoapi) [![Build Status](https://travis-ci.org/Nekov5/node-hako-api.svg?branch=master)](https://travis-ci.org/Nekov5/node-hako-api) [! [Dependency Status] (https://david-dm.org/Nekov5/node-hako-api.svg)] (https://david-dm.org/Nekov5/node-hako-api) [![devDependency Status](https://david-dm.org/Nekov5/node-hako-api/dev-status.svg)](https://david-dm.org/Nekov5/node-hako-api#info=devDependencies) [![Coverage Status](https://coveralls.io/repos/github/Nekov5/node-hako-api/badge.svg?branch=master)](https://coveralls.io/github/Nekov5/node-hako-api?branch=master) [![Known Vulnerabilities](https://snyk.io/test/github/Nekov5/node-hako-api/badge.svg?targetFile=package.json)](https://snyk.io/test/github/Nekov5/node-hako-api?targetFile=package.json) [![npm](https://img.shields.io/npm/dt/nodehakoapi.svg)](https://www.npmjs.com/package/nodehakoapi) [![npm](https://img.shields.io/npm/dm/nodehakoapi.svg)](https://www.npmjs.com/package/nodehakoapi) [![npm](https://img.shields.io/npm/l/nodehakoapi.svg)](https://www.npmjs.com/package/nodehakoapi)


## Table of Contents

* [Install](#install)
* [Usage](#usage)
  * [Node](#node)
* [Supported Platforms](#supported-platforms)
* [License](#license)

## Note

This package is not affiliated with or endorsed by Hako or any related parties. I'm still working on this package, so expect more features to come.
## Install

[npm][]:

```sh
npm install nodehakoapi
```


## Usage

### Node

```js
const NHA = require('nodehakoapi');

//test function

(async () => {
    //get user info
    let userInfo = await NHA.common.User.get("https://ln.hako.vn/thanh-vien/104802");
    let projectInfo = await NHA.common.User.get("https://ln.hako.vn/project/10000");

    //Auth required function

    let User = new NHA.managers.UserManager("username", "password");
    let user = await User.login();
    //get notification
    let notification = await user.getNotifications();
    //get unread project
    let unreadProject = await user.getUnreadProjects();
})();
```

## Supported Platforms

* Node: v6.x+

## License

[MIT](LICENSE) © [Nekov5]()
##

[npm]: https://www.npmjs.com/

[yarn]: https://yarnpkg.com/
