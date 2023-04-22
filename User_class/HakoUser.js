const axios = require('axios');
const cheerio = require('cheerio');
const HakoProject = require('../Project_class/HakoProject');


//Custom Functions

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get body/html of a websites 
 * @param {string} destinationLink link of the site you want to get
 * @returns the body of the site
 */
const getSiteData = async (destinationLink) => {
    try {
        const mainRequest = await axios.get(destinationLink);
        return mainRequest.data;
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = class HakoUser {
    #name = "Undefined";
    #link = "https://ln.hako.vn/thanh-vien/id";
    #roles = [];
    #badges = [];

    #avatarUrl = "https://ln.hako.vn/img/noava.png";
    #memberSince = "Undefined";

    #chapterCount = 0;
    #following = 0;

    #postedProjects = [];
    #joinedProject = [];
    /**
     * 
     * @param {String} src The link or ID to the hako user
     */
    constructor(src) {
        let destinationLink = "";
        if (src.toLowerCase().startsWith("https://") || src.toLowerCase().startsWith("ln.hako.vn") || src.toLowerCase().startsWith("docln.net")) destinationLink = src;
        else destinationLink = `https://ln.hako.vn/thanh-vien/${src}`;

        this.#link = destinationLink;
    }

    /**
     * Get user data from ln.hako.vn
     * @returns {Promise<void>}
     */
    async retrieveData() {
        const userSite = await getSiteData(this.#link);
        let cheerioData = cheerio.load(userSite);

        this.#name = cheerioData('h3.profile-intro_name').text();
        this.#avatarUrl = cheerioData('div.profile-ava > img').attr('src');
        this.#memberSince = cheerioData('main.sect-body > div:last-child > span.info-value').text();

        this.#chapterCount = Number(cheerioData('ul.statistic-top.row > li:nth-child(1) > div.statistic-value').text());
        this.#following = Number(cheerioData('ul.statistic-top.row > li:nth-child(2) > div.statistic-value').text());

        
        cheerioData('#mainpart > div.container > div > div:nth-child(2) > section:nth-child(1) > div.row > div').each((index, element) => {
            let projectLink = cheerioData(element).find('div.showcase-item > div.row > div:nth-child(2) > div.series-info > h5.series-name > a').attr('href');
            let projectName = cheerioData(element).find('div.showcase-item > div.row > div:nth-child(2) > div.series-info > h5.series-name > a').text();
            let tmp = {
                title: projectName,
                link: `https://ln.hako.vn${projectLink}`
            }
            this.#postedProjects.push(tmp);
        });

        cheerioData('#mainpart > div.container > div > div:nth-child(2) > section:nth-child(2) > div.row > div').each((index, element) => {
            let projectLink = cheerioData(element).find('div.showcase-item > div.row > div:nth-child(2) > div.series-info > h5.series-name > a').attr('href');
            let projectName = cheerioData(element).find('div.showcase-item > div.row > div:nth-child(2) > div.series-info > h5.series-name > a').text();
            let tmp = {
                title : projectName,
                link : `https://ln.hako.vn${projectLink}`
            }
            this.#joinedProject.push(tmp);
        });
    }

    get name() {
        return this.#name;
    }

    get link() {
        return this.#link;
    }

    get roles() {
        return this.#roles;
    }

    get badges() {
        return this.#badges;
    }

    get avatarUrl() {
        return this.#avatarUrl;
    }

    get memberSince() {
        return this.#memberSince;
    }

    get chapterCount() {
        return this.#chapterCount;
    }

    get following() {
        return this.#following;
    }

    get postedProjects() {
        return this.#postedProjects;
    }

    get joinedProject() {   
        return this.#joinedProject;
    }

    toString() {
        return `Name: ${this.#name} | Link: ${this.#link} | Roles: ${this.#roles} | Badges: ${this.#badges} | Avatar: ${this.#avatarUrl} | Member since: ${this.#memberSince} | Chapter count: ${this.#chapterCount} | Following: ${this.#following} | Posted projects: ${this.#postedProjects} | Joined projects: ${this.#joinedProject}`;
    }

    // /**
    //  * Get sum of all user's posted projects
    //  * @returns {Promise} Promise object represents the sum of all user's posted projects
    //  */
    // async getSumPostedProject() {
    //     let summary = {
    //         totalWord : 0,
    //         totalFollow : 0,
    //         totalView : 0
    //     }
    //     for(const project of this.#postedProjects) {
    //         let projectData = new HakoProject(project.link);
    //         await projectData.retrieveData();
    //         summary.totalWord += projectData.totalWords;
    //         summary.totalFollow += projectData.totalFollows;
    //         summary.totalView += projectData.totalViews;
    //     }
    //     return summary;
    // }

    // /**
    //  * Get sum of all user's posted projects with callback function
    //  * @param {CallableFunction} callback callback function
    //  * @param {number} timeout rest time per request (ms) 
    //  */
    // getSumPostedProjectCallback(callback, timeout = 100) {
    //     let summary = {
    //         completed : 0,
    //         totalWord : 0,
    //         totalFollow : 0,
    //         totalView : 0
    //     }
    //     for(const project of this.#postedProjects) {
    //         let projectData = new HakoProject(project.link);
    //         projectData.retrieveData().then(() => {
    //             summary.totalWord += projectData.totalWords;
    //             summary.totalFollow += projectData.totalFollows;
    //             summary.totalView += projectData.totalViews;
    //             summary.completed++;
    //             callback(summary);
    //         });
    //     }
    // }

    // /**
    //  * 
    //  * @returns {Promise} Promise object represents the sum of all user's joined projects
    //  */

    // async getSumJoinedProject() {
    //     let summary = {
    //         totalWord : 0,
    //         totalFollow : 0,
    //         totalView : 0
    //     }
    //     for(const project of this.#joinedProject) {
    //         let projectData = new HakoProject(project.link);
    //         await projectData.retrieveData();
    //         summary.totalWord += projectData.totalWords;
    //         summary.totalFollow += projectData.totalFollows;
    //         summary.totalView += projectData.totalViews;
    //     }
    //     return summary;
    // }

    // /**
    //  * Get sum of all user's joined projects with callback function
    //  * @param {Number} timeout 
    //  * @param {CallableFunction} callback 
    //  */

    // getSumJoinedProjectCallback(timeout = 100, callback) {
    //     let summary = {
    //         completed : 0,
    //         totalWord : 0,
    //         totalFollow : 0,
    //         totalView : 0
    //     }
    //     for(const project of this.#joinedProject) {
    //         let projectData = new HakoProject(project.link);
    //         projectData.retrieveData().then(() => {
    //             summary.totalWord += projectData.totalWords;
    //             summary.totalFollow += projectData.totalFollows;
    //             summary.totalView += projectData.totalViews;
    //             summary.completed++;
    //             callback(summary);
    //         });
    //         await(timeout)
    //     }
    // }
}