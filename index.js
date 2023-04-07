const getCommonInfo = require('./get/info');


async function test() {
    let testResult = await getCommonInfo.getUserInfo("1", undefined, {summary : true});
    console.log(testResult);
}

test();
module.exports.GetCommon = getCommonInfo;