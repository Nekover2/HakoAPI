const UserManager = require('./UserManager');

(async () => {
    const user = new UserManager('mpid291004@gmail.com', 'chungho982a');
    await user.login();
    let res = await user.unfollowProject(4167);
    console.log(res);
})();