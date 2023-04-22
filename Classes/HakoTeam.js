const axios = require('axios');
const cheerio = require('cheerio');
const HakoProject = require('../Project_class/HakoProject');


//=================Custom Functions==================


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
        return {
            data : mainRequest.data,
            finalLink : mainRequest.request.res.responseUrl
        };
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = class Hakoteam {

    #name = "undefined";
    #link = "undefined";
    #projects = [];
    #members = new Set();
    #description = "undefined";
    constructor(src) {
        let destinationLink = "";
        if (src.toLowerCase().startsWith("https://") || src.toLowerCase().startsWith("ln.hako.vn") || src.toLowerCase().startsWith("docln.net")) destinationLink = src;
        else destinationLink = `https://ln.hako.vn/nhom-dich/${src}`;
        this.#link = destinationLink;
    }

    async retrieveData() {
        const userSite = await getSiteData(this.#link);
        let cheerioData = cheerio.load(userSite.data);

        this.#name = cheerioData('span.page-name').text();
        this.#link = userSite.finalLink;
        this.#description = cheerioData('main.sect-body').text();

        for (let index = 1; index < 20; index++) {
            const destinationLink = `${this.#link}?page=${index}`;
            const userSite = await getSiteData(destinationLink);

            // Load the html into cheerio
            let cheerioData = cheerio.load(userSite.data);
            let tmp = cheerioData('div.showcase-item').toArray();

            // If no more project in page n, break the loop
            if (tmp.length == 0) break;
            console.log(`Page ${index} loaded`);

            // Add the project to the list
            for (const projectChererio of tmp) {
                let cheerioElem = cheerio.load(projectChererio);

                let tmp = {
                    name: cheerioElem("h5.series-name").text(),
                    link: `https://ln.hako.vn${cheerioElem("h5.series-name > a").attr("href")}`,
                    status: cheerioElem("span.status-value").text(),
                    lastUpdate: cheerioElem("time.timeago").attr("title"),
                    data: new HakoProject(cheerioElem("h5.series-name > a").attr("href"))
                }

                this.#projects.push(tmp);
            }

            await sleep(100);
        }


    }

    get name() {
        return this.#name;
    }

    get link() {
        return this.#link;
    }

    get projects() {
        return this.#projects;
    }

    get members() {
        return this.#members;
    }

    // /**
    //  * Working, recommend using retrieveMemberCallback instead
    //  */
    // async retrieveMembers() {
    //     if (this.#projects.length > 25) return "Error: Too many projects to retrieve members, process will cause 429 error";
    //     for (const project of this.#projects) {
    //         await project.data.retrieveData();
    //         this.#members.add(project.data.owner);
    //         console.log(`Member ${project.data.owner.name} added`);
    //         await sleep(1000);
    //     }
    // }

    // /**
    //  * 
    //  * @param {CallableFunction} callback 
    //  * @param {Number} timeout wait time before next request (ms) 
    //  */

    // retrieveMembersCallback(callback, timeout = 1000) {
    //     const completed = 0;
    //     for (const project of this.#projects) {
    //         project.data.retrieveData().then((member) => {
    //             this.#members.add(member);
    //             completed++;
    //             callback(this.#members, completed, this.#projects.length);
    //         }, timeout);
    //     }
    // }

    //TODO: request queue? Proxies? VPN - maybe? or... Cache?
    toString() {
        return `Name: ${this.#name}
        Link: ${this.#link}
        Description: ${this.#description}
        Projects: ${this.#projects}
        Members: ${this.#members}`;
    }

}