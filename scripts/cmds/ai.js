const axios=require('axios');module.exports={config:{name:"sisi",version:1.0,author:"coffee",longDescription:"AI",category:"ai",guide:{en:"{p} questions"}},onStart:async()=>{},onChat:async({api,event,args,message})=>{try{const{body}=event;if(!(body&&body.toLowerCase().startsWith("ai"))){return;}const prompt=body.substring(2).trim();if(!prompt){await message.reply("𝖧𝗂! 𝖠𝗌𝗄 𝗆𝖾 𝖺𝗇𝗒𝗍𝗁𝗂𝗇𝗀!");return;}const response=await axios.get(`https://sandipapi.onrender.com/gpt?prompt=${encodeURIComponent(prompt)}`);if(response.status===200){const answer=response.data.answer;await message.reply(`${answer}`);}else{throw new Error(`Failed to fetch data. Status: ${response.status}`);}}catch(error){console.error("Error:",error.message);}}};