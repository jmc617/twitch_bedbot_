require('dotenv').config()
const tmi = require('tmi.js');
const msgLimit = 2;
let msgCount = 0;
const insertedMsg = '...in bed ;-)'
const linkRegex = /([\w+]+\:\/\/)?([\w\d-]+\.)*[\w-]+[\.\:]\w+([\/\?\=\&\#.]?[\w-]+)*\/?/
let paused = false;
let ignoreList = [];
//TODO:6/24 
//implement pause command
//raid pause 5 mins
//implement local and db ignore list
// emotes? shelli7Brows shelli7Wink shelli7Smirk

//twitch credentials
const botUsername = process.env.TWITCH_BOT_USERNAME
const token = process.env.TWITCH_OAUTH_TOKEN
//twitch client info
const client = new tmi.Client({
  // //logs events for debugging
  // options: { 
  //   debug: true 
  // },
  connection: {
    reconnect: true
  },
  identity: {
		username: botUsername,
		password: token
	},
	channels: [ 'jesskidding617', 'bedbot_'
  // , 'shellieface' 
]
});


client.connect().catch(console.error);
client.on('connected', () => {
  console.log('Bedbot is connected to Twitch')
});

// //ping test after connected to twitch
// client.on('connected', () => setTimeout(pingLoop, 200));
// async function pingLoop() {
//         await client.ping().then(console.log);
//         setTimeout(pingLoop, 200);
// }

//if raid occurs, pause bedbot for 5 minutes
client.on("raided", (channel, username, viewers) => {
  client.say(channel, `welcome raiders`).catch(console.error);
  console.log("raid")
});

client.on('message', (channel, tags, message, self) => {
// test and regex info: https://careerkarma.com/blog/javascript-string-contains/ https://www.cluemediator.com/find-urls-in-string-and-make-a-link-using-javascript

  
  

  //if the message is not from the bot, is not longer than 140 characters and does not contain a url...
  if( !self && message.length < 140 && !linkRegex.test(message)) {

    if ( message.toLowerCase() === 'bedbot no!' || message.toLowerCase() === '@bedbot_ no!' ) {

      client.say(channel, `no regrets ;-)`).catch(console.error);
      console.log('bed no command detected')

    } else if ( message.toLowerCase() === 'bedbot yes!' || message.toLowerCase() === '@bedbot_ yes!' ) {

      client.say(channel, `just doing my job ;-)`).catch(console.error);
      console.log('bed yes command detected') 

    } else if ( msgCount >= msgLimit ) {
     
      client.say(channel, `${message} ${insertedMsg}`).catch(console.error);
      msgCount = 0;
      
    } else {
      
      msgCount++;

    }
  }
	
  //logs chat messages
  console.log(`${channel}'s Chat ${msgCount} ${tags['display-name']}: ${message}`);


});