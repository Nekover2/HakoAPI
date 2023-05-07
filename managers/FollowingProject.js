const axios = require('axios');
const cheerio = require('cheerio');

module.exports = class FollowingProject {

    #name;
    #id;
    #url;
    #type;
    #newestChapter;
    #cookies;

    constructor(name = "", id = "", url = "", type = "", newestChapter = { name : '', link : ""}, cookies = [{name: '', value: ''}]) {
        this.#name = name;
        this.#id = id;
        this.#url = url;
        this.#type = type;
        this.#newestChapter = newestChapter;
        this.#cookies = cookies;
    }

    getName() {
        return this.#name;
    }

    getId() {
        return this.#id;
    }

    getUrl() {
        return this.#url;
    }

    getType() {
        return this.#type;
    }

    getNewestChapter() {
        return this.#newestChapter;
    }

    setName(name) {
        this.#name = name;
        return this;
    }

    setId(id) {
        this.#id = id;
        return this;
    }

    setUrl(url) {
        this.#url = url;
        return this;
    }

    setType(type) {
        this.#type = type;
        return this;
    }

    setNewestChapter(newestChapter) {
        this.#newestChapter = newestChapter;
        return this;
    }

    setCookies(cookies) {
        this.#cookies = cookies;
        return this;
    }

    /**
     * mark project as read
     * @returns {Promise<{result: string}>} success|marked 
     */
    async markAsRead() {
        try {
            // get session token

            if(this.#cookies.length < 2) throw new Error('Error in mark project as read: Cookies not found');
            const headerPost = {
                'cookie': `${this.#cookies[0].name}=${this.#cookies[0].value};${this.#cookies[1].name}=${this.#cookies[1].value}`,
            };

            const response = await axios.get('https://ln.hako.vn/ke-sach', {
                headers: headerPost
            });
            const $ = cheerio.load(response.data);
            let sessionToken = $('body > script[data-turbo-eval="false"]').text().split('window.livewire_token')[1].split("'")[1];

            const bodyPost = {
                '_token': sessionToken,
                'series_id': this.#id
            }

            const response1 = await axios.post('https://ln.hako.vn/action/series/usermarkread', bodyPost, {
                headers: headerPost
            });
            return response1.data;
        } catch (error) {
            throw new Error(`Cannot mark project as read. Error: ${error}`);
        }
    }

    toString() {
        return `Name: ${this.#name}\nId: ${this.#id}\nUrl: ${this.#url}\nType: ${this.#type}\nNewest chapter: ${this.#newestChapter.name}`;
    }
}