const Project = require('./Project');
const Chapter = require('./Chapter');

(async () => {
    try {
        const test = await Chapter.get("https://ln.hako.vn/truyen/12624-u-shiro-no-seki-no-gyaru-ni-suka-rete-shimatta-mo-ore-wa-damekamoshirenai/c98485-chuong-01");
        console.log(test.getTotalWords());
    } catch (error) {
        console.log(error);
    }
})();