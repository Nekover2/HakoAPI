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
