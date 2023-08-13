require('dotenv').config()
const tmi = require('tmi.js');
const sleep = require('sleep-promise');
const fs = require('./firestore');
const u = require('./utils');

let msgLimit = 35;
let msgCount = 0;
const msgLimitRangeArr = [35,36,37,38,39,40];
const insertedMsg = '...in bed shelli7Smirk'
const linkRegex = /([\w+]+\:\/\/)?([\w\d-]+\.)*[\w-]+[\.\:]\w+([\/\?\=\&\#.]?[\w-]+)*\/?/
const bedbotRegex = /(.*bedbot.*)/ig
let paused = false;
//5 minutes pause
const raidSleepInt = 300000;
const pauseSleepInt = 300000;

let specialReactionPaused = false;
const specialReactionInt = 300000;
let ignoreList = [];

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
  , 'shellieface' 

  ]
});


client.connect().catch(console.error);

client.on('connected', () => {
  
  console.log('Bedbot is connected to Twitch')
  fs.getAllIgnoredUsers(ignoreList);

});

// //ping test after connected to twitch
// client.on('connected', () => setTimeout(pingLoop, 200));
// async function pingLoop() {
//         await client.ping().then(console.log);
//         setTimeout(pingLoop, 200);
// }



//if raid occurs, pause bedbot for 5 minutes
client.on("raided", (channel, username, viewers) => {
  
  paused = true;
  sleep(raidSleepInt).then(()=> {

    paused = false;

  });
  
});

client.on("cheer", (channel, tags, message) => {

  if (tags.bits === '122'){

    client.say(channel, `/me smacks @${tags['display-name']}'s booty shelli7Smirk`).catch(console.error);

  }
});

client.on("messagedeleted", (channel, username, deletedMessage, userstate) => {
  client.say(channel, `ERROR 406: NOT ACCEPTABLE`).catch(console.error);
});

client.on('message', (channel, tags, message, self) => {
// test and regex info: https://careerkarma.com/blog/javascript-string-contains/ https://www.cluemediator.com/find-urls-in-string-and-make-a-link-using-javascript

  
    if (message.toLowerCase() === '!unignore' && ignoreList.some(user => user.id == tags['user-id'] )) {

    id = tags['user-id']
    
    fs.removeUserFromIgnoreList( id )
    .then(() => {

      const newIgnoreList = ignoreList.filter(user => {
        return user.id !== parseInt(id) ;
      });

      ignoreList = newIgnoreList;
 
      client.say(channel, `I missed you @${tags['display-name']} shelli7Shy`).catch(console.error);

    })
    .catch(error => {
      console.log(error);
    });



  //else if the user is not on the ignore list, bot is not paused, message is not from the bot, is not longer than 140 characters and does not contain a url...
  } else if ( !ignoreList.some(user => user.id == tags['user-id']) && !paused && !self && message.length < 140 && !linkRegex.test(message)) {

    if ( message.toLowerCase() === '!pause' ) {

      paused = true;

      sleep(pauseSleepInt).then(()=> {
        paused = false;

        client.say(channel, `I'm back! shelli7Smirk`).catch(console.error);
      });

    } else if (tags['display-name'] === 'SamateurHour' && specialReactionPaused === false && bedbotRegex.test(message)) {

      client.say(channel, `Hi Sam, shelli7Shy I love you`).catch(console.error);
      specialReactionPaused = true;
      sleep(specialReactionInt).then(()=> {

        specialReactionPaused = false;

        
      });

    } else if ( message.toLowerCase() === 'bedbot no!' || message.toLowerCase() === '@bedbot_ no!' ) {

      client.say(channel, `no regrets ;-)`).catch(console.error);
      // console.log('bed no command detected')

    } else if ( message.toLowerCase() === 'bedbot yes!' || message.toLowerCase() === '@bedbot_ yes!' ) {

      client.say(channel, `just doing my job ;-)`).catch(console.error);
      // console.log('bed yes command detected') 

    } else if (message.toLowerCase() === '!ignore' && !ignoreList.some(user => user.id == tags['user-id'] )) {

      user = tags['display-name']
      id = tags['user-id']

      fs.addUsertoIgnoreList(user, id, ignoreList);

      client.say(channel, `I'll miss you @${tags['display-name']} shelli7Sadgers`).catch(console.error);

    } else if ( msgCount >= msgLimit ) {
     
      client.say(channel, `${message} ${insertedMsg}`).catch(console.error);
      msgCount = 0;
      //set msg limit to random num in array to prevent folks from spamming/counting
      msgLimit = u.random(msgLimitRangeArr); 

    } else {
      
      msgCount++;

    }
  }
	
  //logs chat messages
  // console.log(`${channel}'s Chat ${msgCount} ${tags['display-name']}: ${message}`);


});