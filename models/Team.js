const superagent = require('superagent');
const cheerio = require('cheerio');


module.exports = class Team {

    #name;
    #url;
    #id;
    #description;
    #projects = [];

    getName() {
        return this.#name;
    }

    getUrl() {
        return this.#url;
    }

    getId() {
        return this.#id;
    }

    getDescription() {
        return this.#description;
    }

    getProjects() {
        return this.#projects;
    }
    // Static method to get a team from the web

    static async get(input) {

        let finalUrl = '';
        if (input.startsWith('http')) {
            finalUrl = input;
        } else {
            finalUrl = `https://ln.hako.vn/nhom-dich/${input}`;
        }

        const response = await superagent.get(finalUrl);

        if (response.status !== 200) {
            throw new Error('Cannot get team, may be team doesn\'t exist, using url: ' + finalUrl);
        }

        const $ = cheerio.load(response.text);

        let result = new Team();

        result.#name = $('span.page-name').text().split(':').at(1).trim();
        result.#url = $('div.pagination_wrap > a').attr('href').split('?').at(0);
        result.#id = result.#url.split('/').at(-1).split('-').at(0);
        result.#description = $('div.sect-body').text().trim();
        result.#projects = [];
        for (let i = 1; i <= 50; i++) {
            const reqLink = `${result.#url}?page=${i}`;
            const req = await superagent.get(reqLink);
            const $ = cheerio.load(req.text);
            let projectPage = $('div.showcase-item > div.row').toArray();

            console.log(`Page ${i} has ${projectPage.length} projects`);
            if (projectPage.length === 0) break;

            for (const project of projectPage) {

                result.#projects.push({
                    name: $(project).find('div.col-8 > div.series-info > h5.series-name > a').text().trim(),
                    url: `https://ln.hako.vn${$(project).find('div.col-8 > div.series-info > h5.series-name > a').attr('href')}`,
                    type : $(project).find('div.col-8 > div.series-info > div.series-type-wrapper').text().trim(),
                    coverUrl : $(project).find('div.content.img-in-ratio').attr('style').split('url(').at(1).split(')').at(0),
                    status : $(project).find('div.col-8 > div.series-status > div:nth-child(1) > span.status-value').text().trim(),
                    lastUpdate : new Date($(project).find('div.col-8 > div.series-status > div:nth-child(2) > span.status-value > time').attr('datetime')),
                })
            }
        }
        return result;
    }
}

// Path: models\Team.js

