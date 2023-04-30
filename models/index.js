const Team = require('./Team');
const Project = require('./Project');

(async () => {
    //const team = await Team.get('https://ln.hako.vn/nhom-dich/2412');
    const project = await Project.get('https://ln.hako.vn/truyen/14177-the-hero-took-everything-from-me-so-i-partied-with-the-heros-mother');
    console.log(project.toString());
})();