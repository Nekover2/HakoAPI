const { default: axios } = require('axios');
const cheerio = require('cheerio');
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
        const cookieFinal = `${response1.headers['set-cookie'].at(0).split(';').at(0).toString()};${response1.headers['set-cookie'].at(1).split(';').at(0).toString()}`
        console.log(cookieFinal);
        return cookieFinal;
    } catch (error) {
        throw new Error(error);
    }
}

getCookie('chjshchung@gmail.com','chungho982a');

module.exports.getCookie = getCookie;