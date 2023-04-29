const superagent = require('superagent');
const cheerio = require('cheerio');

module.exports = class HakoVolume {

    #name;
    #url;
    #lastUpdate;
    #chapterList = [];

    getName() {
        return this.#name;
    }

    getUrl() {
        return this.#url;
    }

    getLastUpdate() {
        return this.#lastUpdate;
    }

    getChapterList() {
        return this.#chapterList;
    }

    // Static method

    static async getVolume(url) {

        try {
            // Get HTML
            const response = await superagent.get(url);
            if(response.statusCode !== 200) throw new Error('Status code is not 200, It is: ' + response.statusCode);

            // Load HTML
            const $ = cheerio.load(response.text);

            // Get volume name
            let project = new HakoVolume();
            project.#name = $('span.volume-name > a').text();
            project.#url = url;
            project.#lastUpdate = new Date($('div.info-item > span.info-value > time.timeago').attr('datetime'));

            let listChapterHtml = $('ul.list-chapter > li').toArray();
            project.#chapterList = [];
            for(let i = 0; i < listChapterHtml.length; i++) {
                let chapter = {};
                chapter.name = $(listChapterHtml[i]).find('div.chapter-name > a').text();
                chapter.url = $(listChapterHtml[i]).find('div.chapter-name > a').attr('href');
                chapter.datePublished = $(listChapterHtml[i]).find('div.chapter-time').text();
                project.#chapterList.push(chapter);
            }
            return project;
        } catch (error) {
            throw new Error("Error when get volume: " + error.message);
        }
    }
}