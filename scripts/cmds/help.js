const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const doNotDelete = "﹝ 🐰| 𝚂𝙸𝚂𝙸 𝙰𝙸  ﹞"; // changing this wont change the goatbot V2 of list cmd it is just a decoyy

module.exports = {
  config: {
    name: "help",
    version: "1.17",
    author: "aminulsordar", // original author Kshitiz 
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "View command usage and list all commands directly",
    },
    longDescription: {
      en: "View command usage and list all commands directly",
    },
    category: "info",
    guide: {
      en: "{pn} / help cmdName ",
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    const prefix = getPrefix(threadID);

    if (args.length === 0) {
      const categories = {};
      let msg = "";

      msg += ``──────▄▀▄─────▄▀▄\n─────▄█░░▀▀▀▀▀░░█▄\n─▄▄──█░░░░░░░░░░░█──▄▄\n█▄▄█─█░░▀░░┬░░▀░░█─█▄▄█\n\n░██████╗██╗░██████╗██╗\n██╔════╝██║██╔════╝██║\n╚█████╗░██║╚█████╗░██║\n░╚═══██╗██║░╚═══██╗██║\n██████╔╝██║██████╔╝██║\n╚═════╝░╚═╝╚═════╝░╚═╝\n\n﹝ 🐰| 𝚂𝙸𝚂𝙸 𝙰𝙸  ﹞`; // replace with your name 

      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;

        const category = value.config.category || "Uncategorized";
        categories[category] = categories[category] || { commands: [] };
        categories[category].commands.push(name);
      }

      Object.keys(categories).forEach((category) => {
        if (category !== "info") {
          msg += `\n╭───────────〘🐰〙\n│ 『  ${category.toUpperCase()}  』`;


          const names = categories[category].commands.sort();
          for (let i = 0; i < names.length; i += 3) {
            const cmds = names.slice(i, i + 3).map((item) => `🍥${item}`);
            msg += `\n│ ${cmds.join(" ".repeat(Math.max(1, 10 - cmds.join("").length)))}`;
          }

          msg += `\n╰────────────〘🐰〙`;
        }
      });

      const totalCommands = commands.size;
      msg += `\n𝙲𝚄𝚁𝚁𝙴𝙽𝚃𝙻𝚈, 𝙸 𝙷𝙰𝚅𝙴 ${totalCommands} 𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝚂 𝚃𝙷𝙰𝚃 𝙲𝙰𝙽 𝙱𝙴 𝚄𝚂𝙴\n`;
      msg += `〘🐰〙 𝚃𝚈𝙿𝙴 ${prefix} 𝚑𝚎𝚕𝚙 𝚌𝚖𝚍𝙽𝙰𝙼𝙴 𝚃𝙾 𝚅𝙸𝙴𝚆 𝚃𝙷𝙴 𝙳𝙴𝚃𝙰𝙸𝙻𝚂 𝙾𝙵 𝚃𝙷𝙴 𝙲𝙾𝙼𝙼𝙰𝙽𝙳\n╰┈〘🐰〙𝗗𝗘𝗩 : 〘 𝗬𝗢𝗬𝗔 | 𝗔𝗬𝗠𝗜 〙\n╰┈〘🐰〙 𝗠𝗦𝗚 𝗠𝗬 𝗠𝗔𝗦𝗧𝗘𝗥 𝗛𝗘𝗥𝗘 : 𝗠𝗲𝘀𝘀𝗲𝗻𝗴𝗲𝗿 :https://m.me/yoyalegit`;
      msg += `🐰`; // its not decoy so change it if you want 

      const helpListImages = [
        "https://imgur.com/gallery/TDDqbi2.gif", // add image link here
       
        // Add more image links as needed
      ];

      const helpListImage = helpListImages[Math.floor(Math.random() * helpListImages.length)];

      await message.reply({
        body: msg,
        attachment: await global.utils.getStreamFromURL(helpListImage),
      });
    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`Command "${commandName}" not found.`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const author = configCommand.author || "Unknown";

        const longDescription = configCommand.longDescription ? configCommand.longDescription.en || "No description" : "No description";

        const guideBody = configCommand.guide?.en || "No guide available.";
        const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);

        const response = `╭── 〘🐰𝗡𝗔𝗠𝗘🐰〙 ────🍥✨
  │ 〘${configCommand.name}〙
  ├── 〘🐰𝗜𝗡𝗙𝗢🐰〙
  │ ✨🍥𝙳𝙴𝚂𝙲𝚁𝙸𝙿𝚃𝙸𝙾𝙽: ${longDescription}
  │ ✨🍥𝙾𝚃𝙷𝙴𝚁 𝙽𝙰𝙼𝙴: ${configCommand.aliases ? configCommand.aliases.join(", ") : "𝗱𝗼 𝗻𝗼𝘁 𝗵𝗮𝘃𝗲"}
  │ ✨🍥𝙾𝚃𝙷𝙴𝚁 𝙽𝙰𝙼𝙴𝚂 𝙸𝙽 𝚈𝙾𝚄𝚁 𝙶𝚁𝙾𝚄𝙿: 𝗱𝗼 𝗻𝗼𝘁 𝗵𝗮𝘃𝗲
  │ ✨🍥𝚅𝙴𝚁𝚂𝙸𝙾𝙽: ${configCommand.version || "1.0"}
  │ ✨🍥𝚁𝙾𝙻𝙴: ${roleText}
  │ ✨🍥𝚃𝙸𝙼𝙴 𝙿𝙴𝚁 𝙲𝙾𝙼𝙼𝙰𝙽𝙳: ${configCommand.countDown || 1}s
  │ 〘🐰𝙰𝚄𝚃𝙷𝙾𝚁🐰〙: ${author}
  ├── 〘🐰𝗨𝗦𝗔𝗚𝗘🐰〙
  │ 〘${usage}〙
  ├── 〘🐰𝗡𝗢𝗧𝗘𝗦🐰〙
  │ 𝖳𝗁𝖾 𝖼𝗈𝗇𝗍𝖾𝗇𝗍 𝗂𝗇𝗌𝗂𝖽𝖾 <XXXXX> 𝖼𝖺𝗇 𝖻𝖾 𝖼𝗁𝖺𝗇𝗀𝖾𝖽
  │ 𝖳𝗁𝖾 𝖼𝗈𝗇𝗍𝖾𝗇𝗍 𝗂𝗇𝗌𝗂𝖽𝖾 [𝖺|𝖻|𝖼] 𝗂𝗌 a 𝗈𝗋 𝖻 𝗈𝗋 𝖼
  ╰━━━━━━━〘🐰〙`;

        await message.reply(response);
      }
    }
  },
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0:
      return "0 (All users)";
    case 1:
      return "1 (Group administrators)";
    case 2:
      return "2 (Admin bot)";
    default:
      return "Unknown role";
  }
}