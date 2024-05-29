const axios = require('axios');
const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, '../config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

module.exports = {
    description: "Ask the GPT4o a question (realtime web search)",
    role: "user",
    cooldown: 8,
    execute: async function (api, event, args, commands) {
        if (args.length === 0) {
            api.sendMessage(`🫧 | 𝖧𝗂! 𝖳𝗁𝗂𝗌 𝗂𝗌 𝖠𝗇𝗒𝖺 𝗒𝗈𝗎𝗋 𝗁𝖾𝗅𝗉𝖿𝗎𝗅 𝖠𝖨 𝖿𝗋𝗂𝖾𝗇𝖽,𝗃𝗎𝗌𝗍 𝗎𝗌𝖾 : \n ${config.PREFIX}𝖺𝗇𝗒𝖺 𝗐𝗁𝖺𝗍 𝗂𝗌 𝗅𝗈𝗏𝖾?`, event.threadID);
            return;
        }

        const question = args.join(" ");
        const apiUrl = `https://hiroshi-rest-api.replit.app/ai/gpt4o?ask=${encodeURIComponent(question)}`;

        api.sendMessage('Generating•••', event.threadID, event.messageID);

        try {
            const response = await axios.get(apiUrl);
            const data = response.data;
            const message = data.response || "Sorry, I couldn't understand the question.";

            setTimeout(() => {
                api.sendMessage(message, event.threadID, event.messageID);
            }, 3000);
        } catch (error) {
            console.error('Error:', error);
            api.sendMessage(" Sorry, an error occurred while professing your request.", event.threadID);
        }
    }
};