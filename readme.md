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
npm install node-hako-api
```

[yarn][]:

```sh
yarn add node-hako-api
```


## Usage

### Node

```js
const NHA = require('node-hako-api');

//test function

(async () => {
    //get user info
    let userInfo = await NHA.User.get("https://ln.hako.vn/thanh-vien/104802");
    let projectInfo = await NHA.Project.get("https://ln.hako.vn/project/10000");
    
    console.log(userInfo.toString());
})();
```

## Supported Platforms

* Node: v6.x+

## License

[MIT](LICENSE) © [Nekov5]()
##

[npm]: https://www.npmjs.com/

[yarn]: https://yarnpkg.com/
