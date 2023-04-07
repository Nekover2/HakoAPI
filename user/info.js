const { default: axios } = require('axios');
const cheerio = require('cheerio');
const DOMAIN = 'https://ln.hako.vn';


//-----------------------------Functions----------------------

const sumProjectStat = async (projectLinks) => {
    try {
        let result = {
            totalWord : 0,
            totalFollow : 0,
            totalView : 0
        }
        for(const projectLink of projectLinks ) {
            let projectInfo = await getProjectInfo(undefined,projectLink);
            result.totalWord += projectInfo.wordCount;
            result.totalFollow += projectInfo.follow;
            result.totalView += projectInfo.viewCount;
        }
        return result;
    } catch (error) {
        throw new Error(error);
    }
}

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
        throw new Error(error);
    }
}

/**
 * 
 * @returns {Array} current top 8 project in hako 
 */
const getDailyTop = async () => {
    try {
        const mainSiteData = await getSiteData('https://ln.hako.vn/');
        const mainSiteHtml = cheerio.load(mainSiteData);
        let result = [];

        mainSiteHtml('div.popular-thumb-item > .thumb-wrapper > a').each((index, element) => {
            let data = mainSiteHtml(element).attr();
            data.href = `${DOMAIN}${data.href}`;
            result.push(data);
        });

        console.log(result);
        return result;
    } catch (error) {
        throw new Error(error)
    }
}


const getProjectInfo = async (ID = undefined, link) => {
    //TODO Add phó post vào thông tin trả về
    try {
        let trueLink = link;
        if (typeof ID != 'undefined') trueLink = `https://ln.hako.vn/truyen/${ID}`;
        const mainSiteData = await getSiteData(trueLink);
        const mainSiteHtml = cheerio.load(mainSiteData);
        let result = {};

        result.title = mainSiteHtml('div.series-name-group > span > a').text();
        result.coverURL = mainSiteHtml('div.series-cover > div.a6-ratio > div.content').attr('style').split("'").at(1);
        result.author = mainSiteHtml('div.series-information > div:nth-child(2) > span.info-value > a').text();
        result.artist = mainSiteHtml('div.series-information > div:nth-child(3) > span.info-value > a').text();
        result.status = mainSiteHtml('div.series-information > div:nth-child(4) > span.info-value > a').text();

        result.follow = Number(mainSiteHtml('#collect > span.block.feature-name').text());
        result.lastUpdate = mainSiteHtml('div.row.statistic-list > div:nth-child(1) > div.statistic-value > time').attr('title');
        result.wordCount = Number(mainSiteHtml('div.row.statistic-list > div:nth-child(2) > div.statistic-value').text().replaceAll('.', ''));
        result.rateCount = Number(mainSiteHtml('div.row.statistic-list > div:nth-child(3) > div.statistic-value').text().replaceAll('.', ''));
        result.viewCount = Number(mainSiteHtml('div.row.statistic-list > div:nth-child(4) > div.statistic-value').text().replaceAll('.', ''));

        result.owner = {
            name: mainSiteHtml('div.series-owner.group-mem > div.series-owner-title > span.series-owner_name > a').text(),
            link: mainSiteHtml('div.series-owner.group-mem > div.series-owner-title > span.series-owner_name > a').attr('href')
        }

        result.helper = [];

        mainSiteHtml('div.series-owner_share > a.ln_info-name').each((index, element) => {
            let tmp = {
                name : mainSiteHtml(element).text(),
                link : mainSiteHtml(element).attr('href')
            }
            result.helper.push(tmp);
        });
        result.group = {
            name: mainSiteHtml('div.fantrans-section > div.fantrans-value > a').text(),
            link: mainSiteHtml('div.fantrans-section > div.fantrans-value > a').attr('href')
        }

        //console.log(result);
        return result;
    } catch (error) {
        throw new Error(error);
    }
}


const getUserInfo = async (ID = undefined, link, config = { summary:false}) => {
    try {
        if (typeof ID != 'undefined') link = `https://ln.hako.vn/thanh-vien/${ID}`;
        console.log(link);
        const mainSiteData = await getSiteData(link);
        const mainSiteHtml = cheerio.load(mainSiteData);
        let result = {};

        result.name = mainSiteHtml('h3.profile-intro_name').text().replaceAll("\n", '');
        result.role = mainSiteHtml('span.profile-intro_role.role-mem').text();
        result.avatarURL = mainSiteHtml('div.profile-ava > img').attr('src');
        result.memberSince = mainSiteHtml('main.sect-body > div:last-child > span.info-value').text();

        result.chapterCount = Number(mainSiteHtml('ul.statistic-top.row > li:nth-child(1) > div.statistic-value').text());
        result.followCount = Number(mainSiteHtml('ul.statistic-top.row > li:nth-child(2) > div.statistic-value').text());

        result.projectCount = Number(mainSiteHtml('#mainpart > div.container > div > div:nth-child(2) > section:nth-child(1) > header > span.number').text());
        result.project = [];
        let projectLinks = [];
        mainSiteHtml('#mainpart > div.container > div > div:nth-child(2) > section:nth-child(1) > div.row > div').each((index, element) => {
            let projectLink = mainSiteHtml(element).find('div.showcase-item > div.row > div:nth-child(2) > div.series-info > h5.series-name > a').attr('href');
            let projectName = mainSiteHtml(element).find('div.showcase-item > div.row > div:nth-child(2) > div.series-info > h5.series-name > a').text();
            projectLinks.push(`${DOMAIN}${projectLink}`);
            let tmp = {
                title : projectName,
                link : projectLink
            }
            result.project.push(tmp);
        });

        if(!config.summary) return result;
        result.summary = await sumProjectStat(projectLinks, config.pjPerPage, config.page);        
        result.subProjectCount = Number(mainSiteHtml('#mainpart > div.container > div > div:nth-child(2) > section:nth-child(2) > header > span.number').text());
        result.subProject = [];
        mainSiteHtml('#mainpart > div.container > div > div:nth-child(2) > section:nth-child(2) > div.row > div').each((index, element) => {
            let projectLink = mainSiteHtml(element).find('div.showcase-item > div.row > div:nth-child(2) > div.series-info > h5.series-name > a').attr('href');
            let projectName = mainSiteHtml(element).find('div.showcase-item > div.row > div:nth-child(2) > div.series-info > h5.series-name > a').text();
            projectLinks.push(`${DOMAIN}${projectLink}`);
            let tmp = {
                title : projectName,
                link : projectLink
            }
            result.subProject.push(tmp);
        });

        return result;
    } catch (error) {
        throw new Error(error);
    }
}


//getProjectInfo(10711);
module.exports.getProjectInfo = getProjectInfo;
module.exports.getUserInfo = getUserInfo;