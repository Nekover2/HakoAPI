const superagent = require('superagent');
const cheerio = require('cheerio');

module.exports = class Chapter {

    #name;
    #link;
    #id;
    #projectId;
    #lastUpdate;
    #totalWords;
    
    #content;

    getName() {
        return this.#name;
    }

    getLink() {
        return this.#link;
    }

    getId() {
        return this.#id;
    }

    getProjectId() {
        return this.#projectId;
    }

    getLastUpdate() {
        return this.#lastUpdate;
    }

    getTotalWords() {
        return this.#totalWords;
    }

    getContent() {
        return this.#content;
    }


    // Static methods

    /**
     * get the data of a chapter from the url
     * @param {string} url 
     * @returns {Promise<Chapter>}
     */
    static async get(url) {
        try {
            //check if url is valid
            if (!(url.startsWith("https://ln.hako.vn/truyen/") || url.startsWith("https://docln.net/truyen/"))) throw new Error("Invalid url");
            // Get the data
            const response = await superagent.get(url);

            //check response status
            if (response.status !== 200) throw new Error(`Error in retrieving data from: ${url}, status code: ${response.status}`);

            const $ = cheerio.load(response.text);

            // extract the data

            let resultChapter = new Chapter();

            resultChapter.#name = $('div.title-top > h4').text();
            resultChapter.#link = url;
            resultChapter.#id = url.split("/").at(-1).split("-").shift();
            resultChapter.#projectId = url.split("/").at(-2).split("-").shift();
            resultChapter.#lastUpdate = new Date($('div.title-top > h6 > time').attr('datetime'));
            resultChapter.#totalWords = parseInt($('div.title-top > h6').text().trim().slice(8).replace(',', ''));

            let contentHtml = $('div#chapter-content > p').toArray();
            resultChapter.#content = '';

            for(const p of contentHtml) {
                resultChapter.#content += $(p).text().trim() + '\n';
            }

            return resultChapter;
        } catch (error) {
            console.log(error);
            throw new Error(`Error in retrieving data from: ${url}`);
        }
    }
}