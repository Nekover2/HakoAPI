const HakoUser = require('../User_class/HakoUser')
const axios = require('axios');
const cheerio = require('cheerio');

/**
 * 
 * @param {string} destinationLink link of the site you want to get
 * @returns the body of the site
 */
const getSiteData = async (destinationLink) => {
    try {
        const mainRequest = await axios.get(destinationLink);
        return mainRequest.data;
    } catch (error) {
        throw new Error(`Lỗi trong khi nhận dữ liệu đến server với link: ${destinationLink}`);
    }
}


module.exports = class HakoProject {
    #link = "https://ln.hako.vn/truyen/ID";
    #name = "Undefined";
    #coverURL = "https://ln.hako.vn/img/nocover.jpg";
    #author = "Undefined";
    #illustrator = "Undefined";
    #status = "Đang tiến hành";
    
    #owner = {
        name : "Unknown",
        link : "Unknown"
    }
    #helpers = [];

    #totalFollows = 0;
    #lastUpdate = "Unknown";
    #totalWords = 0;
    #rating = 0;
    #totalViews = 0;
    //

    constructor(ID) {
        let destinationLink = "";
        if (ID.startsWith("https://") || ID.startsWith("ln.hako.vn") || ID.startsWith("docln.net")) destinationLink = ID;
        else destinationLink = `https://ln.hako.vn${ID}`;
        this.#link = destinationLink;
    }

    /**
     * Get all the data of the project from the site ln.hako.vn
     */

    async retrieveData() {
        const projectSite = await getSiteData(this.#link);
        let cheerioData = cheerio.load(projectSite);

        this.#name = cheerioData('div.series-name-group > span > a').text();
        this.#coverURL = cheerioData('div.series-cover > div.a6-ratio > div.content').attr('style').split("'").at(1);
        this.#author = cheerioData('div.series-information > div:nth-child(2) > span.info-value > a').text();
        this.#illustrator = cheerioData('div.series-information > div:nth-child(3) > span.info-value > a').text();
        this.#status = cheerioData('div.series-information > div:nth-child(4) > span.info-value > a').text();

        this.#owner = {
            name : cheerioData('div.series-owner.group-mem > div.series-owner-title > span.series-owner_name > a').text(),
            link : cheerioData('div.series-owner.group-mem > div.series-owner-title > span.series-owner_name > a').attr('href')
        }

        cheerioData('div.series-owner_share > a.ln_info-name').each((index, element) => {
            let tmp = {
                name : cheerioData(element).text(),
                link : cheerioData(element).attr('href')
            }
            this.#helpers.push(tmp);
        });
        this.#totalFollows = Number(cheerioData('#collect > span.block.feature-name').text());
        this.#lastUpdate = cheerioData('div.row.statistic-list > div:nth-child(1) > div.statistic-value > time').attr('title');
        this.#totalWords = Number(cheerioData('div.row.statistic-list > div:nth-child(2) > div.statistic-value').text().replaceAll('.', ''));
        this.#rating = Number(cheerioData('div.row.statistic-list > div:nth-child(3) > div.statistic-value').text().replaceAll('.', ''));
        this.#totalViews = Number(cheerioData('div.row.statistic-list > div:nth-child(4) > div.statistic-value').text().replaceAll('.', ''));
    }

    get name() {
        return this.#name;
    }

    get coverURL() {    
        return this.#coverURL;
    }
    
    get author() {
        return this.#author;
    }

    get illustrator() { 
        return this.#illustrator;
    }

    get status() {
        return this.#status;
    }

    get owner() {
        return this.#owner;
    }

    get helpers() {
        return this.#helpers;
    }
     
    get totalFollows() {
        return this.#totalFollows;
    }

    get lastUpdate() {
        return this.#lastUpdate;
    }

    get totalWords() {
        return this.#totalWords;
    }

    get rating() {
        return this.#rating;
    }

    get totalViews() {
        return this.#totalViews;
    }
    get link() {
        return this.#link;
    }

}