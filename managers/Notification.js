const cheerio = require('cheerio');
const axios = require('axios');

module.exports = class Notification {
    #id;
    #title;
    #url;
    #time;
    #isRead;
    #cookies;
    #sessionToken;

    constructor(id, title, url, time, isRead, cookies, sessionToken) {
        this.#id = id;
        this.#title = title;
        this.#url = url;
        this.#time = time;
        this.#isRead = isRead;
        this.#cookies = cookies;
        this.#sessionToken = sessionToken;
    }

    getId() {
        return this.#id;
    }


    getTitle() {
        return this.#title;
    }

    getUrl() {
        return this.#url;
    }

    getTime() {
        return this.#time;
    }

    isRead() {
        return this.#isRead;
    }

    setId(id) {
        this.#id = id;
        return this;
    }

    setTitle(title) {
        this.#title = title;
        return this;
    }

    setUrl(url) {
        this.#url = url;
        return this;
    }

    setTime(time) {
        this.#time = time;
        return this;
    }

    setRead(isRead) {
        this.#isRead = isRead;
        return this;
    }

    setCookies(cookies) {
        this.#cookies = cookies;
        return this;
    }

    setSessionToken(sessionToken) {
        this.#sessionToken = sessionToken;
        return this;
    }

    /**
     * Mark this notification as read
     * @returns {Promise<{result : string}>} result : success | touched
     */
    async markAsRead() {
        const headers = {
            Cookie : `${this.#cookies[0].name}=${this.#cookies[0].value};${this.#cookies[1].name}=${this.#cookies[1].value}`,
        }

        const response = await axios.get('https://ln.hako.vn/thong-bao', {
            headers : headers
        });
        const $ = cheerio.load(response.data);
        let sessionToken = $('body > script[data-turbo-eval="false"]').text().split('window.livewire_token')[1].split("'")[1];
        let result = await axios.post('https://ln.hako.vn/action/notification/touch', {
            '_token': sessionToken,
            'notification_id': this.#id,
        }, {
            headers: headers
        });

        if(result.status == 200) {
            this.#isRead = true;
            return result.data;
        }
        return false;
    }

    toString() {
        return `Notification: ${this.#title} - ${this.#url} - ${this.#time} - ${this.#isRead} - ${this.#id}`;
    }
}
