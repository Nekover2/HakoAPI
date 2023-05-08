const superagent = require('superagent');
const cheerio = require('cheerio');



module.exports = class Project {
    #link = "https://ln.hako.vn/truyen/ID";
    #id = "ID";
    #name = "Undefined";
    #coverURL = "https://ln.hako.vn/img/nocover.jpg";
    #author = "Undefined";
    #illustrator = "Undefined";
    #status = "Đang tiến hành";

    #owner = {
        name: "Unknown",
        link: "Unknown"
    }
    #helpers = [];

    #totalFollows = 0;
    #lastUpdate = new Date();
    #totalWords = 0;
    #rating = 0;
    #totalViews = 0;
    
    #chapters = [
        {
            name: 'init',
            link: 'https://ln.hako.vn/sth...',
            releaseDate: 'init',
        }
    ]

    #volumes = [
        {
            name: 'init',
            link: 'https://ln.hako.vn/sth...',
            coverUrl : 'https://ln.hako.vn/img/nocover.jpg',
            chapters: [
                {
                    name: 'init',
                    link: 'https://ln.hako.vn/sth...',
                    releaseDate: 'init',
                }
            ]
        }
    ];

    /**
     * 
     * @param {string} ID ID or link of the project 
     * @returns {Promise<Project>}
     */
    static async get(ID) {
        let destinationLink = "";
        if (ID.startsWith("https://") || ID.startsWith("ln.hako.vn") || ID.startsWith("docln.net")) destinationLink = ID;
        else destinationLink = `https://ln.hako.vn${ID}`;

        const projectSite = await superagent.get(destinationLink);
        //check if the project exists
        if (projectSite.status !== 200) throw new Error(`Cannot find project with link: ${ID}`);
        let cheerioData = cheerio.load(projectSite.text);

        let resultProject = new Project();

        resultProject.#name = cheerioData('div.series-name-group > span > a').text();
        resultProject.#id = cheerioData('div.series-name-group > span > a').attr('href').split('/').at(-1).split('-').at(0);
        resultProject.#link = `https://ln.hako.vn${cheerioData('span.series-name > a').attr('href')}`;
        resultProject.#coverURL = cheerioData('div.series-cover > div.a6-ratio > div.content').attr('style').split("'").at(1);

        resultProject.#author = cheerioData('div.series-information > div:nth-child(2) > span.info-value > a').text();
        resultProject.#illustrator = cheerioData('div.series-information > div:nth-child(3) > span.info-value > a').text();
        resultProject.#status = cheerioData('div.series-information > div:last-child > span.info-value > a').text();

        if(resultProject.#illustrator === resultProject.#status) resultProject.#illustrator = "None";

        resultProject.#owner = {
            name: cheerioData('div.series-owner.group-mem > div.series-owner-title > span.series-owner_name > a').text(),
            link: cheerioData('div.series-owner.group-mem > div.series-owner-title > span.series-owner_name > a').attr('href')
        }

        cheerioData('div.series-owner_share > a.ln_info-name').each((index, element) => {
            let tmp = {
                name: cheerioData(element).text(),
                link: cheerioData(element).attr('href')
            }
            resultProject.#helpers.push(tmp);
        });
        resultProject.#totalFollows = Number(cheerioData('#collect > span.block.feature-name').text());
        resultProject.#lastUpdate = new Date(cheerioData('div.row.statistic-list > div:nth-child(1) > div.statistic-value > time').attr('datetime'));
        resultProject.#totalWords = Number(cheerioData('div.row.statistic-list > div:nth-child(2) > div.statistic-value').text().replaceAll('.', ''));
        resultProject.#rating = cheerioData('div.row.statistic-list > div:nth-child(3) > div.statistic-value').text().replaceAll('.', '');
        resultProject.#totalViews = Number(cheerioData('div.row.statistic-list > div:nth-child(4) > div.statistic-value').text().replaceAll('.', ''));

        //volumes

        let volumeBlocks = cheerioData('section.volume-list.at-series').toArray();

        resultProject.#volumes = [];
        resultProject.#chapters = [];
        for(const volumeBlock of volumeBlocks) {
            let volume = {
                name: cheerioData(volumeBlock).find('header > span.sect-title').text().replaceAll('\n', ''),
                link: 'https://ln.hako.vn' + cheerioData(volumeBlock).find('div.volume-cover > a').attr('href'),
                coverUrl : cheerioData(volumeBlock).find('div.content.img-in-ratio').attr('style').split('url(').at(1).split(')').at(0),
                chapters: []
            }

            let chapterBlocks = cheerioData(volumeBlock).find('ul.list-chapters > li').toArray();
            for(const chapterBlock of chapterBlocks) {
                let chapter = {
                    id: cheerioData(chapterBlock).find('div.chapter-name > a').attr('href').split("/").at(-1).split("-").shift(),
                    name: cheerioData(chapterBlock).find('div.chapter-name > a').text(),
                    link: 'https://ln.hako.vn' +  cheerioData(chapterBlock).find('div.chapter-name > a').attr('href'),
                    releaseDate: cheerioData(chapterBlock).find('div.chapter-time').text(),
                }
                volume.chapters.push(chapter);
                resultProject.#chapters.push(chapter);
            }
            resultProject.#volumes.push(volume);
        }

        return resultProject;
    }

    getName() {
        return this.#name;
    }

    getID() {
        return this.#id;
    }

    getCoverURL() {
        return this.#coverURL;
    }

    getAuthor() {
        return this.#author;
    }

    getIllustrator() {
        return this.#illustrator;
    }

    getStatus() {
        return this.#status;
    }

    getOwner() {
        return this.#owner;
    }

    getHelpers() {
        return this.#helpers;
    }

    getTotalFollows() {
        return this.#totalFollows;
    }

    getLastUpdate() {
        return this.#lastUpdate;
    }

    getTotalWords() {
        return this.#totalWords;
    }

    getRating() {
        return this.#rating;
    }

    getTotalViews() {
        return this.#totalViews;
    }
    getLink() {
        return this.#link;
    }

    getVolumes() {
        return this.#volumes;
    }

    getChapters() { 
        return this.#chapters;
    }

    toString() {
        return `Name: ${this.#name}\nLink: ${this.#link}\nId: ${this.#id}\nCoverURL: ${this.#coverURL}\nAuthor: ${this.#author}\nIllustrator: ${this.#illustrator}\nStatus: ${this.#status}\nOwner: ${this.#owner.name}\nHelpers: ${this.#helpers.map(helper => helper.name).join(', ')}\nTotalFollows: ${this.#totalFollows}\nLastUpdate: ${this.#lastUpdate}\nTotalWords: ${this.#totalWords}\nRating: ${this.#rating}\nTotalViews: ${this.#totalViews}\nVolumes: ${this.#volumes.length}\nChapters: ${this.#chapters.length}`
    }
}