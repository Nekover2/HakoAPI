const getCommonInfo =
{
    user : require('./user'),
    project : require('./project'),
    login : require('./login/getCookie'),
}

const HakoTeam = require('./Classes/HakoTeam');

/*
    144 req? 1s (429 error: too many requests)
    delay 1s/req?
    too slow...
    100ms/req?
    >14s to get 144 projects (to retrieve all members)
    background?
    database?
    or defer message, delete old message, send new message?

    ok,
*/
async function test() {
    let testResult = new HakoTeam("1");
    await testResult.retrieveData();
    await testResult.retrieveMembers();
}

test();
module.exports.GetCommon = getCommonInfo;