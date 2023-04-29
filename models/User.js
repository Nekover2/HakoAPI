const superagent = require('superagent');
const cheerio = require('cheerio');


//Custom Functions

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


module.exports = class User {
    #name = "Undefined";
    #link = "https://ln.hako.vn/thanh-vien/id";

    #avatarUrl = "https://ln.hako.vn/img/noava.png";
    #memberSince = "Undefined";

    #chapterCount = 0;
    #following = 0;

    /**
     * Get user data from ln.hako.vn
     * @returns {Promise<void>}
     */
    static async get(src) {
        let destinationLink = "";
        if (src.toLowerCase().startsWith("https://") || src.toLowerCase().startsWith("ln.hako.vn") || src.toLowerCase().startsWith("docln.net")) destinationLink = src;
        else destinationLink = `https://ln.hako.vn/thanh-vien/${src}`;
        
        const userSite = await superagent.get(destinationLink);
        //check if the user exists
        if (userSite.status !== 200) throw new Error(`cannot find user with link: ${src}`);


        let cheerioData = cheerio.load(userSite.text);

        let resultUser = new User();
        resultUser.#name = cheerioData('h3.profile-intro_name').text();
        resultUser.#avatarUrl = cheerioData('div.profile-ava > img').attr('src');
        resultUser.#memberSince = cheerioData('main.sect-body > div:last-child > span.info-value').text();

        resultUser.#chapterCount = Number(cheerioData('ul.statistic-top.row > li:nth-child(1) > div.statistic-value').text());
        resultUser.#following = Number(cheerioData('ul.statistic-top.row > li:nth-child(2) > div.statistic-value').text());

        return resultUser;
    }

    getName() {
        return this.#name;
    }

    getLink() {
        return this.#link;
    }

    getAvatarUrl() {
        return this.#avatarUrl;
    }

    getMemberSince() {
        return this.#memberSince;
    }

    getChapterCount() {
        return this.#chapterCount;
    }

    getFollowing() {
        return this.#following;
    }


    toString() {
        return `Name: ${this.#name} | Link: ${this.#link}| Avatar: ${this.#avatarUrl} | Member since: ${this.#memberSince} | Chapter count: ${this.#chapterCount} | Following: ${this.#following}`;
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