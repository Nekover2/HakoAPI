const getSiteData = require('../functions/getSiteData');
const cheerio = require('cheerio');
const DOMAIN = "https://ln.hako.vn";

const sumProjectStat = async (projectLinks) => {
    try {
        let result = {
            totalWord: 0,
            totalFollow: 0,
            totalView: 0
        }
        for (const projectLink of projectLinks) {
            let projectInfo = await getProjectInfo(undefined, projectLink);
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
 * @param {String} ID ID or Link to the hako user
 * @returns General info of this user
 */
let getUserGeneralInfo = async (ID) => {
    try {
        //                 Define user input
        let destinationLink = "";
        if (ID.toLowerCase().startsWith("http://") || ID.toLowerCase().startsWith("ln.hako.vn") || ID.toLowerCase().startsWith("docln.net")) destinationLink = ID;
        else destinationLink = `https://ln.hako.vn/thanh-vien/${ID}`;

        //                 Crawl site data
        let responseHtml = await getSiteData(destinationLink);
        const mainSiteHtml = cheerio.load(responseHtml);
        let result = {};
        
        //                  Process site data
        result.link = destinationLink;
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
                title: projectName,
                link: projectLink
            }
            result.project.push(tmp);
        });
       
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
        return new Error(error);
    }
}


/**
 * 
 * @param {String} ID ID or link to the hako user
 * @returns Caculate sum of all the user's own projects' some properties
 */
let getUserMainProjectSummary = async (ID) => {
    const userGeneralInfo = await getUserGeneralInfo(ID);
    userGeneralInfo.mainProjectSummary = await sumProjectStat(userGeneralInfo.project);
    return userGeneralInfo;
}


/**
 * 
 * @param {String} ID ID or link to the hako user
 * @returns Caculate sum of all the user's side projects' some properties
 */
let getUserSubProjectSummary = async (ID) => {
    const userGeneralInfo = await getUserGeneralInfo(ID);
    userGeneralInfo.mainProjectSummary = await sumProjectStat(userGeneralInfo.subProject);
    return userGeneralInfo;
}

module.exports = {
    getUserGeneralInfo : getUserGeneralInfo,
    getUserMainProjectSummary : getUserMainProjectSummary,
    getUserSubProjectSummary : getUserSubProjectSummary
}