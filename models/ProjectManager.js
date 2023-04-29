const superagent = require('superagent');
const cheerio = require('cheerio');
const Project = require('./Project');

const getCookie = async (username, password) => {
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
            { name : cookies[0].split('=')[0], value : cookies[0].split('=')[1] },
            { name : cookies[1].split('=')[0], value : cookies[1].split('=')[1] }
        ];

        return cookieFinal;
    } catch (error) {
        throw new Error(`Cannot login to ln.hako.vn. Error: ${error}`);
    }
}

module.exports = class ProjectManager {

    #cookie = [];
    #id = '';
    
    constructor(id) {}
    async auth(username, password) {
        try {
            this.#cookie = await getCookie(username, password);
        } catch (error) {
            throw new Error(`Error: ${error}`);
        }
    }
}