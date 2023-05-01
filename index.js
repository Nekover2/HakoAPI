const User = require('./models/User');
const Project = require('./models/Project');
const Volume = require('./models/Volume');
const Chapter = require('./models/Chapter');
const Team = require('./models/Team');

module.exports = {
    common: {
        User,
        Project,
        Volume,
        Chapter,
        Team
    },

    managers: {
        UserManager: require('./managers/UserManager'),
    }
}