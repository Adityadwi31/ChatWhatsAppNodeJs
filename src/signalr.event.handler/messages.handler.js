require("dotenv").config();const{SESSION_ID:SESSION_ID}=process.env,{isUrl:isUrl,isImage:isImage,isVideo:isVideo,isAudio:isAudio,keyExist:keyExist,findVal:findVal,msgContent:msgContent,vcardToJSON:vcardToJSON}=require("../common/common.util"),{LegacyMessageTypes:LegacyMessageTypes,getLegacyMessageType:getLegacyMessageType}=require("../common/message.type"),MessageMedia=require("../common/message.media"),{getAllMessageByContactId:getAllMessageByContactId,getUnreadMessage:getUnreadMessage}=require("../db.repository/messages.repository"),{getContactById:getContactById}=require("../db.repository/contacts.repository"),onSetStatusHandler=async(e,s)=>{const t=JSON.parse(e),{sessionId:a,send_to:n,message:i,type:o,attachmentOrUrl:d,backgroundColor:g,font:S,contacts:c}=t;if(a===SESSION_ID)try{if("text"===o)await s.sendMessage(n,{text:i},{backgroundColor:g,font:S,statusJidList:c});else if("image"===o)await s.sendMessage(n,{image:{url:d},caption:i||void 0},{backgroundColor:g,font:S,statusJidList:c})}catch(e){console.log(`onSetStatusHandler::ex: ${e}`)}},onSendMessageHandler=async(e,s)=>{const{sendContactAsync:t,sendTextAsync:a,replyAsync:n,replyStickerAsync:i,sendStickerAsync:o,sendImageAsync:d,sendGifAsync:g,sendVideoAsync:S,sendAudioAsync:c,sendDocumentAsync:r,sendLocationAsync:u,sendListAsync:l,sendButtonAsync:m,sendButtonCTAAsync:y}=require("../common/sock.util"),{signalRClient:I,serverHub:f}=require("../signalr/signalr.util"),p=JSON.parse(e),{sessionId:N,send_to:M,message:O,type:_,attachmentOrUrl:A,quotedMessageId:E,mentions:v}=p;if(N!==SESSION_ID)return;let T=void 0;if(A){T=(isUrl(A)?await MessageMedia.fromUrl(A):MessageMedia.fromFilePath(A)).mimetype}if("image"===_){let e=void 0;if(T){isImage(T)?e=await d(M,A,O,v,s):isVideo(T)?e=await S(M,A,O,v,s):isAudio(T)&&(e=await c(M,A,O,v,s));const t=e.toString().split("_"),[a,n,i,o]=t;"false"===a&&I.connection.hub.invoke(f,"SendMessageStatus",JSON.stringify({messageStatus:{status:a,send_to:n,message:i,messageId:o},sessionId:SESSION_ID}))}}else if("gif"===_){if(T&&isVideo(T)){const e=(await g(M,A,O,v,s)).toString().split("_"),[t,a,n,i]=e;"false"===t&&I.connection.hub.invoke(f,"SendMessageStatus",JSON.stringify({messageStatus:{status:t,send_to:a,message:n,messageId:i},sessionId:SESSION_ID}))}}else if("sticker"===_){const e=JSON.parse(O);let t="";const a=(t=E?await i(M,e,E,s):await o(M,e,s)).toString().split("_"),[n,d,g,S]=a;"false"===n&&I.connection.hub.invoke(f,"SendMessageStatus",JSON.stringify({messageStatus:{status:n,send_to:d,message:g,messageId:S},sessionId:SESSION_ID}))}else if("videoAudio"===_){let e=void 0;if(T){isVideo(T)?e=await S(M,A,O,v,s):isAudio(T)&&(e=await c(M,A,O,v,s));const t=e.toString().split("_"),[a,n,i,o]=t;"false"===a&&I.connection.hub.invoke(f,"SendMessageStatus",JSON.stringify({messageStatus:{status:a,send_to:n,message:i,messageId:o},sessionId:SESSION_ID}))}}else if("file"===_){const e=(await r(M,A,O,v,s)).toString().split("_"),[t,a,n,i]=e;"false"===t&&I.connection.hub.invoke(f,"SendMessageStatus",JSON.stringify({messageStatus:{status:t,send_to:a,message:n,messageId:i},sessionId:SESSION_ID}))}else if("url"===_){let e=void 0;if(T){const t=(e=isImage(T)?await d(M,A,O,v,s):isVideo(T)?await S(M,A,O,v,s):isAudio(T)?await c(M,A,O,v,s):await r(M,A,O,v,s)).toString().split("_"),[a,n,i,o]=t;"false"===a&&I.connection.hub.invoke(f,"SendMessageStatus",JSON.stringify({messageStatus:{status:a,send_to:n,message:i,messageId:o},sessionId:SESSION_ID}))}}else if("location"===_){const e=JSON.parse(O),t={degreesLatitude:e.latitude,degreesLongitude:e.longitude,name:e.description},a=(await u(M,t,v,s)).toString().split("_"),[n,i,o,d]=a;"false"===n&&I.connection.hub.invoke(f,"SendMessageStatus",JSON.stringify({messageStatus:{status:n,send_to:i,message:o,messageId:d},sessionId:SESSION_ID}))}else if("list"===_){const e=JSON.parse(O),t=(await l(M,e,s)).toString().split("_"),[a,n,i,o]=t;"false"===a&&I.connection.hub.invoke(f,"SendMessageStatus",JSON.stringify({messageStatus:{status:a,send_to:n,message:i,messageId:o},sessionId:SESSION_ID}))}else if("button"===_){const e=JSON.parse(O);let t=void 0;const a=(t=keyExist(e,"urlButton")||keyExist(e,"callButton")||keyExist(e,"quickReplyButton")?await y(M,e,A,s):await m(M,e,A,s)).toString().split("_"),[n,i,o,d]=a;"false"===n&&I.connection.hub.invoke(f,"SendMessageStatus",JSON.stringify({messageStatus:{status:n,send_to:i,message:o,messageId:d},sessionId:SESSION_ID}))}else if("vcard"===_){const e=JSON.parse(O),a=(await t(M,e,s)).toString().split("_"),[n,i,o,d]=a;"false"===n&&I.connection.hub.invoke(f,"SendMessageStatus",JSON.stringify({messageStatus:{status:n,send_to:i,message:o,messageId:d},sessionId:SESSION_ID}))}else{let e="";const t=(e=E?await n(M,O,E,s):await a(M,O,v,s)).toString().split("_"),[i,o,d,g]=t;"false"===i&&I.connection.hub.invoke(f,"SendMessageStatus",JSON.stringify({messageStatus:{status:i,send_to:o,message:d,messageId:g},sessionId:SESSION_ID}))}},onBroadcastMessageHandler=async(e,s,t)=>{const{sendTextAsync:a,sendContactAsync:n,sendStickerAsync:i,sendImageAsync:o,sendVideoAsync:d,sendAudioAsync:g,sendGifAsync:S,sendDocumentAsync:c,sendLocationAsync:r,sendListAsync:u,sendButtonAsync:l,sendButtonCTAAsync:m}=require("../common/sock.util"),{signalRClient:y,serverHub:I}=require("../signalr/signalr.util"),{asyncForEach:f,waitFor:p}=require("../common/common.util"),N=JSON.parse(e);await f(N,async e=>{const{sessionId:f,send_to:N,message:M,type:O,attachmentOrUrl:_,mentions:A}=e;if(f===SESSION_ID){let e=void 0;if(_){e=(isUrl(_)?await MessageMedia.fromUrl(_):MessageMedia.fromFilePath(_)).mimetype}if("image"===O){let s=void 0;isImage(e)?s=await o(N,_,M,A,t):isVideo(e)?s=await d(N,_,M,A,t):isAudio(e)&&(s=await g(N,_,M,A,t));const a=s.toString().split("_"),[n,i,S,c]=a;"false"===n&&y.connection.hub.invoke(I,"SendMessageStatus",JSON.stringify({messageStatus:{status:n,send_to:i,message:S,messageId:c},sessionId:SESSION_ID}))}else if("videoAudio"===O){let s=void 0;isVideo(e)?s=await d(N,_,M,A,t):isAudio(e)&&(s=await g(N,_,M,A,t));const a=s.toString().split("_"),[n,i,o,S]=a;"false"===n&&y.connection.hub.invoke(I,"SendMessageStatus",JSON.stringify({messageStatus:{status:n,send_to:i,message:o,messageId:S},sessionId:SESSION_ID}))}else if("gif"===O){if(isVideo(e)){const e=(await S(N,_,M,A,t)).toString().split("_"),[s,a,n,i]=e;"false"===s&&y.connection.hub.invoke(I,"SendMessageStatus",JSON.stringify({messageStatus:{status:s,send_to:a,message:n,messageId:i},sessionId:SESSION_ID}))}}else if("sticker"===O){const e=JSON.parse(M),s=(await i(N,e,t)).toString().split("_"),[a,n,o,d]=s;"false"===a&&y.connection.hub.invoke(I,"SendMessageStatus",JSON.stringify({messageStatus:{status:a,send_to:n,message:o,messageId:d},sessionId:SESSION_ID}))}else if("file"===O){const e=(await c(N,_,M,A,t)).toString().split("_"),[s,a,n,i]=e;"false"===s&&y.connection.hub.invoke(I,"SendMessageStatus",JSON.stringify({messageStatus:{status:s,send_to:a,message:n,messageId:i},sessionId:SESSION_ID}))}else if("url"===O){let s=void 0;const a=(s=isImage(e)?await o(N,_,M,A,t):isVideo(e)?await d(N,_,M,A,t):isAudio(e)?await g(N,_,M,A,t):await c(N,_,M,A,t)).toString().split("_"),[n,i,S,r]=a;"false"===n&&y.connection.hub.invoke(I,"SendMessageStatus",JSON.stringify({messageStatus:{status:n,send_to:i,message:S,messageId:r},sessionId:SESSION_ID}))}else if("location"===O){const e=JSON.parse(M),s={degreesLatitude:e.latitude,degreesLongitude:e.longitude,name:e.description},a=(await r(N,s,A,t)).toString().split("_"),[n,i,o,d]=a;"false"===n&&y.connection.hub.invoke(I,"SendMessageStatus",JSON.stringify({messageStatus:{status:n,send_to:i,message:o,messageId:d},sessionId:SESSION_ID}))}else if("vcard"===O){const e=JSON.parse(M),s=(await n(N,e,t)).toString().split("_"),[a,i,o,d]=s;"false"===a&&y.connection.hub.invoke(I,"SendMessageStatus",JSON.stringify({messageStatus:{status:a,send_to:i,message:o,messageId:d},sessionId:SESSION_ID}))}else if("list"===O){const e=JSON.parse(M),s=(await u(N,e,t)).toString().split("_"),[a,n,i,o]=s;"false"===a&&y.connection.hub.invoke(I,"SendMessageStatus",JSON.stringify({messageStatus:{status:a,send_to:n,message:i,messageId:o},sessionId:SESSION_ID}))}else if("button"===O){const e=JSON.parse(M);let s=void 0;const a=(s=keyExist(e,"urlButton")||keyExist(e,"callButton")||keyExist(e,"quickReplyButton")?await m(N,e,_,t):await l(N,e,_,t)).toString().split("_"),[n,i,o,d]=a;"false"===n&&y.connection.hub.invoke(I,"SendMessageStatus",JSON.stringify({messageStatus:{status:n,send_to:i,message:o,messageId:d},sessionId:SESSION_ID}))}else{const e=(await a(N,M,A,t)).toString().split("_"),[s,n,i,o]=e;"false"===s&&y.connection.hub.invoke(I,"SendMessageStatus",JSON.stringify({messageStatus:{status:s,send_to:n,message:i,messageId:o},sessionId:SESSION_ID}))}await p(s)}})},onGetUnreadMessageHandler=async(e,s,t)=>{const{signalRClient:a,serverHub:n}=require("../signalr/signalr.util"),i=JSON.parse(e),{sessionId:o,limit:d}=i;if(o!==SESSION_ID)return;let g=[];const S=await getUnreadMessage(d||100);for(const e of S){const i=JSON.parse(e.message);if(!i.message)continue;if(i.key&&"status@broadcast"==i.key.remoteJid)continue;const o=i.key.fromMe,d=getLegacyMessageType(i),S=i.key.remoteJid.endsWith("@g.us");if(!o&&!S)try{await t.chatModify({markRead:!0,lastMessages:[i]},i.key.remoteJid)}catch(e){console.log(`markRead::ex: ${e}`)}const c=findVal(i,"messageTimestamp"),r=msgContent(d,i),u=i.key.remoteJid;let l=void 0;try{l=await getContactById(u)}catch(e){console.log(`getContactById::ex: ${e}`)}let m=void 0,y=void 0;if(S){try{m=await getContactById(i.key.participant)}catch(e){console.log(`getContactById::ex: ${e}`)}const e=await t.groupMetadata(u);e&&(y={id:e.id?e.id:"",name:e.subject?e.subject:""})}let I=void 0;if(d===LegacyMessageTypes.LOCATION_MESSAGE){const{locationMessage:e}=i.message;I={latitude:e.degreesLatitude,longitude:e.degreesLongitude,description:e.name}}let f=void 0,p=void 0;d===LegacyMessageTypes.BUTTONS_RESPONSE_MESSAGE?f=findVal(i,"selectedButtonId"):d===LegacyMessageTypes.LIST_RESPONSE_MESSAGE&&(p=findVal(i,"selectedRowId"));let N=s,M=u;o||(N=u,M=s);const O={id:i.key.id,sessionId:SESSION_ID,content:r||"",type:d||"",from:N||"",to:M||"",sender:S?void 0:{id:l.id?l.id:"",name:l.name?l.name:"",shortName:"",pushname:l.pushName?l.pushName:""},group:S?{id:y.id?y.id:"",name:y.name?y.name:"",sender:{id:m.id?m.id:"",name:m.name?m.name:"",shortName:"",pushname:m.pushName?m.pushName:""}}:void 0,unixTimestamp:c||0,filename:"",location:I,vcards:d===LegacyMessageTypes.CONTACT_MESSAGE||d===LegacyMessageTypes.CONTACTS_ARRAY_MESSAGE?[]:void 0,selectedButtonId:f,selectedRowId:p};if(d===LegacyMessageTypes.CONTACT_MESSAGE||d===LegacyMessageTypes.CONTACTS_ARRAY_MESSAGE||d===LegacyMessageTypes.LOCATION_MESSAGE){findVal(i,"quotedMessage")||(O.content="")}if(d===LegacyMessageTypes.CONTACT_MESSAGE){const{vcard:e}=i.message.contactMessage;O.vcards.push(vcardToJSON(e))}if(d===LegacyMessageTypes.CONTACTS_ARRAY_MESSAGE){const{contacts:e}=i.message.contactsArrayMessage;for(const s of e)O.vcards.push(vcardToJSON(s.vcard))}g.push(O),50===g.length&&(a.connection.hub.invoke(n,"ReceiveMessages",JSON.stringify({messages:g,sessionId:SESSION_ID})),g=[])}g.push({id:"status@broadcast",type:"chat",content:"",sessionId:SESSION_ID}),g.length>0&&(a.connection.hub.invoke(n,"ReceiveMessages",JSON.stringify({messages:g,sessionId:SESSION_ID})),g=[])},onGetAllMessageHandler=async(e,s)=>{const{signalRClient:t,serverHub:a}=require("../signalr/signalr.util"),n=JSON.parse(e),{sessionId:i,phoneNumber:o,limit:d}=n;if(i!==SESSION_ID)return;let g=[];if(o){const e=await getAllMessageByContactId(o,d);for(const n of e){const e=JSON.parse(n.message);if(!e.message)continue;if(e.key&&"status@broadcast"==e.key.remoteJid)continue;const i=e.key.fromMe,o=getLegacyMessageType(e),d=e.key.remoteJid.endsWith("@g.us"),S=findVal(e,"messageTimestamp"),c=msgContent(o,e),r=e.key.remoteJid;let u=void 0;try{u=await getContactById(r)}catch(e){console.log(`getContactById::ex: ${e}`)}let l=void 0,m=void 0;if(d){try{l=await getContactById(e.key.participant)}catch(e){console.log(`getContactById::ex: ${e}`)}const s=await sock.groupMetadata(r);s&&(m={id:s.id?s.id:"",name:s.subject?s.subject:""})}let y=void 0;if(o===LegacyMessageTypes.LOCATION_MESSAGE){const{locationMessage:s}=e.message;y={latitude:s.degreesLatitude,longitude:s.degreesLongitude,description:s.name}}let I=void 0,f=void 0;o===LegacyMessageTypes.BUTTONS_RESPONSE_MESSAGE?I=findVal(e,"selectedButtonId"):o===LegacyMessageTypes.LIST_RESPONSE_MESSAGE&&(f=findVal(e,"selectedRowId"));let p=s,N=r;i||(p=r,N=s);const M={id:e.key.id,sessionId:SESSION_ID,content:c||"",type:o||"",from:p||"",to:N||"",sender:d?void 0:{id:u.id?u.id:"",name:u.name?u.name:"",shortName:"",pushname:u.pushName?u.pushName:""},group:d?{id:m.id?m.id:"",name:m.name?m.name:"",sender:{id:l.id?l.id:"",name:l.name?l.name:"",shortName:"",pushname:l.pushName?l.pushName:""}}:void 0,unixTimestamp:S||0,filename:"",location:y,vcards:o===LegacyMessageTypes.CONTACT_MESSAGE||o===LegacyMessageTypes.CONTACTS_ARRAY_MESSAGE?[]:void 0,selectedButtonId:I,selectedRowId:f};if(o===LegacyMessageTypes.CONTACT_MESSAGE||o===LegacyMessageTypes.CONTACTS_ARRAY_MESSAGE||o===LegacyMessageTypes.LOCATION_MESSAGE){findVal(e,"quotedMessage")||(M.content="")}if(o===LegacyMessageTypes.CONTACT_MESSAGE){const{vcard:s}=e.message.contactMessage;M.vcards.push(vcardToJSON(s))}if(o===LegacyMessageTypes.CONTACTS_ARRAY_MESSAGE){const{contacts:s}=e.message.contactsArrayMessage;for(const e of s)M.vcards.push(vcardToJSON(e.vcard))}g.push(M),50===g.length&&(t.connection.hub.invoke(a,"ReceiveMessages",JSON.stringify({messages:g,sessionId:SESSION_ID})),g=[])}g.push({id:"status@broadcast",type:"chat",content:"",sessionId:SESSION_ID}),g.length>0&&(t.connection.hub.invoke(a,"ReceiveMessages",JSON.stringify({messages:g,sessionId:SESSION_ID})),g=[])}};module.exports={onSetStatusHandler:onSetStatusHandler,onSendMessageHandler:onSendMessageHandler,onBroadcastMessageHandler:onBroadcastMessageHandler,onGetUnreadMessageHandler:onGetUnreadMessageHandler,onGetAllMessageHandler:onGetAllMessageHandler};