const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
        config: {
                name: "pinte",
                version: "1.0.2",
                author: "JVB",
                role: 0,
                countDown: 50,
                shortDescription: {
                        en: "Search for images on Pinterest"
                },
                longDescription: {
                        en: ""
                },
                category: "image",
                guide: {
                        en: "{prefix}pinterest <search query> -<number of images>"
                }
        },

        onStart: async function ({ api, event, args, usersData }) {
                try {
                        const userID = event.senderID;

                        const keySearch = args.join(" ");
                        if (!keySearch.includes("-")) {
                                return api.sendMessage(`Please enter the search query and number of images to return in the format: ${this.config.guide.en}`, event.threadID, event.messageID);
                        }
                        const keySearchs = keySearch.substr(0, keySearch.indexOf('-')).trim();
                        const numberSearch = parseInt(keySearch.split("-").pop().trim()) || 6;

                        const res = await axios.get(`https://hiroshi-rest-api.replit.app/search/pinterest?search=shen%20yue${encodeURIComponent(keySearchs)}`);
                        const data = res.data;

                        if (!data || !Array.isArray(data) || data.length === 0) {
                                return api.sendMessage(`﹝🐰﹞►𝚠𝚊𝚕𝚊 𝚊𝚔𝚘𝚗𝚐 𝚖𝚊𝚑𝚊𝚗𝚊𝚙 𝚗𝚊 𝚛𝚎𝚕𝚊𝚝𝚎𝚍 𝚙𝚒𝚌𝚝𝚞𝚛𝚎 :< "${keySearchs}". 𝚂𝚎𝚊𝚛𝚌𝚑 𝚔𝚊 𝚞𝚕𝚒𝚝 𝚖𝚒😽`, event.threadID, event.messageID);
                        }

                        const imgData = [];

                        for (let i = 0; i < Math.min(numberSearch, data.length); i++) {
                                const imageUrl = data[i].image;

                                try {
                                        const imgResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                                        const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);
                                        await fs.outputFile(imgPath, imgResponse.data);
                                        imgData.push(fs.createReadStream(imgPath));
                                } catch (error) {
                                        console.error(error);
                                        // Handle image fetching errors (skip the problematic image)
                                }
                        }

                        await api.sendMessage({
                                attachment: imgData,
                                body: `Here are the top ${imgData.length} image results for "${keySearchs}":`
                        }, event.threadID, event.messageID);

                        await fs.remove(path.join(__dirname, 'cache'));
                } catch (error) {
                        console.error(error);
                        return api.sendMessage(`﹝🐰﹞► 𝚑𝚊𝚕𝚊𝚊𝚊 𝚖𝚊𝚢 𝚎𝚛𝚛𝚘𝚛 𝚝𝚛𝚢 𝚖𝚘 𝚞𝚕𝚒𝚝 𝚖𝚊𝚖𝚊𝚢𝚊𝚊𝚊𝚊 😽`, event.threadID, event.messageID);
                }
        }
};

