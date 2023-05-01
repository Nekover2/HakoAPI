const UserManager = require('./UserManager');

(async () => {
    const user = new UserManager('username', 'password');
    await user.login();
    let unreadProject = await user.getNotifications();
    console.log(unreadProject.at(0).toString());
})();