const cheerio = require('cheerio');
const axios = require('axios');

const Notification = require('./Notification')
const FollowingProject = require('./FollowingProject')


module.exports = class UserManager {

    //auth
    #username;
    #password;
    #cookies;

    constructor(username, password) {
        this.#username = username;
        this.#password = password;
    }

    //
    async #getCookie(username, password) {
        try {
            const response = await axios.get("https://ln.hako.vn/login");

            const cookie = `${response.headers['set-cookie'].at(0).split(';').at(0).toString()};${response.headers['set-cookie'].at(1).split(';').at(0).toString()}`
            const loginPage = cheerio.load(response.data);
            const loginPage_form = loginPage('.form-horizontal');
            const loginPage_token = loginPage(loginPage_form).find('input').first().attr('value');
            const loginPage_bodyPost = {
                '_token': loginPage_token,
                'name': username,
                'password': password
            }
            const loginPage_headerPost = {
                'cookie': cookie,
                'content-type': 'application/x-www-form-urlencoded'
            };
            const response1 = await axios.post('https://ln.hako.vn/login', loginPage_bodyPost, {
                headers: loginPage_headerPost
            });

            //console.log(response1.headers['set-cookie']);

            let cookieFinal = `${response1.headers['set-cookie'].at(0).split(';').at(0).toString()};${response1.headers['set-cookie'].at(1).split(';').at(0).toString()}`
            let cookies = cookieFinal.split(';');
            cookieFinal = [
                { name: cookies[0].split('=')[0], value: cookies[0].split('=')[1] },
                { name: cookies[1].split('=')[0], value: cookies[1].split('=')[1] }
            ];
            return cookieFinal;
        } catch (error) {
            throw new Error(`Cannot login to ln.hako.vn. Error: ${error}`);
        }
    }

    async login() {
        this.#cookies = await this.#getCookie(this.#username, this.#password);
    }

    /**
     * Get all user's notifications
     * @returns {Promise<Notification[]>} all user's notifications
     */
    async getNotifications() {
        const headers = {
            Cookie: `${this.#cookies[0].name}=${this.#cookies[0].value};${this.#cookies[1].name}=${this.#cookies[1].value}`,
        }
        const response = await axios.get('https://ln.hako.vn/thong-bao', {
            headers: headers
        });
        const $ = cheerio.load(response.data);

        let notiObject = $('main.sect-body > article');
        let notifications = [];
        for (const noti of notiObject) {
            let currNoti = new Notification()
                .setId($(noti).attr('data-notification'))
                .setTitle($(noti).find('div.noti-content > span').text())
                .setUrl(`https://ln.hako.vn${$(noti).find('a').attr('href')}`)
                .setTime(new Date($(noti).find('div.noti-content > time').attr('datetime')))
                .setRead(!$(noti).hasClass('untouch'))
                .setCookies(this.#cookies);
            notifications.push(currNoti);
        }
        return notifications;
    }

    /**
     * get all user's following projects (unread project only)
     * @returns {Promise<FollowingProject[]>} all user's following but unread projects
     */

    async getUnreadProjects() {
        const headers = {
            Cookie: `${this.#cookies[0].name}=${this.#cookies[0].value};${this.#cookies[1].name}=${this.#cookies[1].value}`,
        }

        let unreadProject = [];

        for (let i = 1; i < 10; i++) {

            const response = await axios.get(`https:ln.hako.vn/ke-sach?page=${i}`, {
                headers: headers
            });
            const $ = cheerio.load(response.data);

            let projectObjects = $('tbody > tr').toArray();
            if (projectObjects.length == 1) break;

            let brkPoint = false;

            for (const project of projectObjects) {
                if ($(project).find('td.text-right.update-action > span.update-status').hasClass('unread-chapters')) {
                    let currProject = new FollowingProject()
                        .setCookies(this.#cookies)
                        .setId($(project).find('div.series-name > a').attr('href').split('/').at(2).split('-').at(0))
                        .setName($(project).find('div.series-name > a').text())
                        .setUrl(`https://ln.hako.vn${$(project).find('div.series-name > a').attr('href')}`)
                        .setType($(project).find('small.type-translation').text())
                        .setNewestChapter({
                            name: $(project).find('td.none.table-cell-m > a').text(),
                            link: `https://ln.hako.vn${$(project).find('td.none.table-cell-m > a').attr('href')}`
                        });

                    unreadProject.push(currProject);
                }
                if ($(project).find('td.text-right.update-action > span.update-status').hasClass('no-chapters')) {
                    brkPoint = true;
                    break;
                };
            }
            if (brkPoint) break;
        }

        return unreadProject;
    }

    /**
     * Follow or unfollow a project
     * @param {string} projectId 
     * @returns {Promise<FollowingProject>} status of action, colleced mean you currently flollowing this project or not
     */
    async followProject(projectId) {
        projectId = parseInt(projectId);
        const headers = {
            Cookie: `${this.#cookies[0].name}=${this.#cookies[0].value};${this.#cookies[1].name}=${this.#cookies[1].value}`,
        }

        const firstResponse = await axios.get(`https://ln.hako.vn/truyen/${projectId}`, {
            headers: headers
        });

        const $ = cheerio.load(firstResponse.data);
        let sessionToken = $('body > script[data-turbo-eval="false"]').text().split('window.livewire_token')[1].split("'")[1];

        let body = {
            series_id: projectId,
            _token: sessionToken
        }

        let secondResponse = await axios.post('https://ln.hako.vn/action/series/collect', body, { headers: headers });

        if(secondResponse.data.collected == false) secondResponse = await axios.post('https://ln.hako.vn/action/series/collect', body, { headers: headers });
        return secondResponse.data.collected;
    }

    
    /**
     * Follow or unfollow a project
     * @param {string} projectId 
     * @returns {Promise<FollowingProject>} status of action, colleced mean you currently flollowing this project or not
     */
    async unfollowProject(projectId) {
        projectId = parseInt(projectId);
        const headers = {
            Cookie: `${this.#cookies[0].name}=${this.#cookies[0].value};${this.#cookies[1].name}=${this.#cookies[1].value}`,
        }

        const firstResponse = await axios.get(`https://ln.hako.vn/truyen/${projectId}`, {
            headers: headers
        });

        const $ = cheerio.load(firstResponse.data);
        let sessionToken = $('body > script[data-turbo-eval="false"]').text().split('window.livewire_token')[1].split("'")[1];

        let body = {
            series_id: projectId,
            _token: sessionToken
        }

        let secondResponse = await axios.post('https://ln.hako.vn/action/series/collect', body, { headers: headers });

        if(secondResponse.data.collected == true) secondResponse = await axios.post('https://ln.hako.vn/action/series/collect', body, { headers: headers });
        return !secondResponse.data.collected;
    }

    markAllAsRead() {
        //TODO
    }

}