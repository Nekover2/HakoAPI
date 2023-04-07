const { default: axios } = require('axios');
const cheerio = require('cheerio');

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

module.exports = getSiteData;