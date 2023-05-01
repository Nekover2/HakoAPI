# node-hako-api

> An unofficial lib to retrieve data from ln.hako.vn website, no username or password required. Other methods are not implemented yet.


## Table of Contents

* [Install](#install)
* [Usage](#usage)
  * [Node](#node)
* [Supported Platforms](#supported-platforms)
* [License](#license)


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
    let notification = await user.getNotification();
    //get unread project
    let unreadProject = await user.getUnreadProject();
})();
```

## Supported Platforms

* Node: v6.x+

## License

[MIT](LICENSE) © [Nekov5]()
##

[npm]: https://www.npmjs.com/

[yarn]: https://yarnpkg.com/
