require("dotenv").config();const{SESSION_ID:SESSION_ID}=process.env,{getMessageByJid:getMessageByJid,getMessageForDeleteInGroupByJid:getMessageForDeleteInGroupByJid,getMessageForDeleteByJid:getMessageForDeleteByJid,getLastMessages:getLastMessages}=require("../db.repository/messages.repository"),onArchiveChatHandler=async(e,s)=>{const a=JSON.parse(e),{sessionId:t,phoneNumber:o}=a;if(t===SESSION_ID)if(o)try{const e=await getMessageByJid(o),a=JSON.parse(e);await s.chatModify({archive:!0,lastMessages:[a]},o)}catch(e){console.log(`ex: ${e}`)}else try{const e=await getLastMessages();for(const a of e){const e=JSON.parse(a.message);e.key.fromMe||await s.chatModify({archive:!0,lastMessages:[e]},a.jid)}}catch(e){console.log(`ex: ${e}`)}},onDeleteChatHandler=async(e,s)=>{const a=JSON.parse(e),{sessionId:t,phoneNumber:o}=a;if(t===SESSION_ID)if(o)try{const e=await getMessageForDeleteByJid(o),a=JSON.parse(e);a&&await s.chatModify({delete:!0,lastMessages:[{key:a.key,messageTimestamp:a.messageTimestamp}]},o)}catch(e){console.log(`ex: ${e}`)}else try{const e=await getLastMessages();for(const a of e){const e=JSON.parse(a.message);e&&(console.log(`message: ${JSON.stringify(e)}`),await s.chatModify({delete:!0,lastMessages:[{key:e.key,messageTimestamp:e.messageTimestamp}]},e.key.remoteJid))}}catch(e){console.log(`ex: ${e}`)}},onMarkReadChatHandler=async(e,s)=>{const a=JSON.parse(e),{sessionId:t,phoneNumber:o}=a;if(t===SESSION_ID&&o)try{const e=await getMessageByJid(o),a=JSON.parse(e);await s.chatModify({markRead:!0,lastMessages:[a]},o),console.log(`incomingMsg: ${JSON.stringify(a)}`),console.log(`remoteJid: ${o}`)}catch(e){console.log(`ex: ${e}`)}},onDeleteMessageHandler=async(e,s)=>{const a=JSON.parse(e),{sessionId:t,groupId:o,participant:n}=a;if(t===SESSION_ID)try{const e=await getMessageForDeleteInGroupByJid(o),a=JSON.parse(e);if(a&&a.key.participant===n)await s.sendMessage(a.key.remoteJid,{delete:a.key})}catch(e){console.log(`ex: ${e}`)}};module.exports={onArchiveChatHandler:onArchiveChatHandler,onDeleteChatHandler:onDeleteChatHandler,onMarkReadChatHandler:onMarkReadChatHandler,onDeleteMessageHandler:onDeleteMessageHandler};