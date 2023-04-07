const getCommonInfo =
{
    user : require('./user'),
    project : require('./project')
}


async function test() {
    let testResult = await getCommonInfo.project.get.getProjectInfo("1");
    console.log(testResult);
}

test();
module.exports.GetCommon = getCommonInfo;