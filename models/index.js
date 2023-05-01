const Project = require('./Project');

(async () => {
    try {
        const project = await Project.get('https://ln.hako.vn/truyen/787-tensei-shitara-kendeshita');
        //console.log(project);
    } catch (error) {
        console.log(error);
    }
})();