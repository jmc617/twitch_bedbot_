require('dotenv').config()
const tmi = require('tmi.js');
const msgLimit = 5;
let msgCount = 0;
const insertedMsg = '...in bed ;-)'
const linkRegex = /([\w+]+\:\/\/)?([\w\d-]+\.)*[\w-]+[\.\:]\w+([\/\?\=\&\#.]?[\w-]+)*\/?/gm
//storage for db user info
let channelsToJoin = [];
let ignoreList = [];
let channelListForClient = [];

//pull all channels from api and put them in channelsToJoin with name/interval
//pull ignore list from api and add usernames them to ignoreList
// pull channel names only and put in channel list for client

//twitch credentials
const botUsername = process.env.TWITCH_BOT_USERNAME
const token = process.env.TWITCH_OAUTH_TOKEN
//twitch client info
const client = new tmi.Client({
  connection: {
    reconnect: true
  },
  identity: {
		username: botUsername,
		password: token
	},
  //spread channelListForClient in channels
	channels: [ 'jess617', 'shellieface' ]
});

//pull all channels from api and put them in channelsToJoin with name/interval
//pull ignore list from api and add usernames them to ignoreList

client.connect().catch(console.error);

client.on('message', (channel, tags, message, self) => {
//TODO: ignore messages with urls (might trigger moderation bots)
// test and regex info: https://careerkarma.com/blog/javascript-string-contains/ https://www.cluemediator.com/find-urls-in-string-and-make-a-link-using-javascript
//TODO: ignore messages that are too long 
//set dynamic variables for users counter and msglimit from channel array
  //if the message is not from the bot, is not longer than 140 characters and does not contain a link...
  if( !self && message.length < 140 && !linkRegex.test(message)) {

    if ( message.toLowerCase() === 'bedbot no!' || message.toLowerCase() === '@bedbot_ no!' ) {

      client.say(channel, `no regrets ;-)`)

    } else if ( message.toLowerCase() === 'bedbot yes!' || message.toLowerCase() === '@bedbot_ yes!' ) {

      client.say(channel, `just doing my job ;-)`)  

    } else if ( message === '!bed join' && channel === botUsername ) {
      //join channel of person using the command
      //add them to database with default values or update if already present 
      //add them to channel array
      client.join(tags.username)
        .then((data) => {
          // data returns [channel]
          client.say(channel, `I have joined your channel, ${tags.username}`) 
        }).catch((err) => {
          console.log(err)
        }); 

    } else if ( message === '!bed leave' && channel === botUsername ) {
      //leave channel of person using the command
      //remove them from database or update if canBedify is false
      //remove them from channel array
      client.part(tags.username)
        .then((data) => {
          // data returns [channel]
          client.say(channel, `I have left your channel, ${tags.username}`) 
        }).catch((err) => {
          console.log(err)
        }); 
 
        //else if command is !bed ignore add to ignore array, save to DB with canBedify = false
        //else if command is !bed stopignore remove from ignore array, update to DB with canBedify = false if joinChannel = true else delete from database

    
    //after n messages resend previous message with inserted message at the end
     
    } else if ( msgCount >= msgLimit ) {
     
      client.say(channel, `${message} ${insertedMsg}`)
      msgCount = 0;
      
    } else {
      
      msgCount++;

    }
  }
	
  //logs chat messages
  // console.log(`${channel}'s Chat ${msgCount} ${tags['display-name']}: ${message}`);


});