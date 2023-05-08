const Project = require('./Project');

(async () => {
    try {
        const project = await Project.get('https://ln.hako.vn/truyen/787-tensei-shitara-kendeshita');
        let res = project.getChapters();
        console.log(res);
    } catch (error) {
        console.log(error);
    }
})();