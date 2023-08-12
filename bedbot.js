require('dotenv').config()
const tmi = require('tmi.js');
const sleep = require('sleep-promise');
const fs = require('./firestore');
const r = require('./utils');

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
  // , 'shellieface' 

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

//TODO: create, delete, and read actions for ignore db
//add user to ignore array and database
//remove user from array and database
//on startup, retrieve list of ignored users and insert into ignore array
//in message listener, if !ignore, then add to list
// if !bedme remove from list
//add condition that message sender is not in array

//if raid occurs, pause bedbot for 5 minutes
client.on("raided", (channel, username, viewers) => {
  
  console.log("raid")
  paused = true;
  sleep(raidSleepInt).then(()=> {
    paused = false;
    console.log(`timer ended`);

  });
  
});

client.on("cheer", (channel, tags, message) => {
  console.log(`bits sent`);
  if (tags.bits === '122'){
    console.log(`122 "I want you" bitties recieved!`)
    client.say(channel, `/me smacks @${tags['display-name']}'s booty shelli7Smirk`).catch(console.error);

  }
});

client.on("messagedeleted", (channel, username, deletedMessage, userstate) => {
  client.say(channel, `ERROR 406: NOT ACCEPTABLE`).catch(console.error);
});

client.on('message', (channel, tags, message, self) => {
// test and regex info: https://careerkarma.com/blog/javascript-string-contains/ https://www.cluemediator.com/find-urls-in-string-and-make-a-link-using-javascript

  //if ignored or if paused or message too long or has a link, return?

  

  //if the bot is not paused, message is not from the bot, is not longer than 140 characters and does not contain a url...
  if( !paused && !self && message.length < 140 && !linkRegex.test(message)) {

    if ( message.toLowerCase() === '!pause' ) {

      paused = true;
      console.log('paused');
      sleep(pauseSleepInt).then(()=> {
        paused = false;
        console.log(`timer ended`);
        client.say(channel, `I'm back! shelli7Smirk`).catch(console.error);
      });

    } else if (tags['display-name'] === 'SamateurHour' && specialReactionPaused === false && bedbotRegex.test(message)) {
      console.log('S detected')
      client.say(channel, `Hi Sam, shelli7Shy I love you`).catch(console.error);
      specialReactionPaused = true;
      sleep(specialReactionInt).then(()=> {
        specialReactionPaused = false;
        console.log(`timer ended, ready for more special reactions`);
        
      });

    } else if ( message.toLowerCase() === 'bedbot no!' || message.toLowerCase() === '@bedbot_ no!' ) {

      client.say(channel, `no regrets ;-)`).catch(console.error);
      // console.log('bed no command detected')

    } else if ( message.toLowerCase() === 'bedbot yes!' || message.toLowerCase() === '@bedbot_ yes!' ) {

      client.say(channel, `just doing my job ;-)`).catch(console.error);
      // console.log('bed yes command detected') 

    } else if ( msgCount >= msgLimit ) {
     
      client.say(channel, `${message} ${insertedMsg}`).catch(console.error);
      msgCount = 0;
      //set msg limit to random num in array to prevent folks from spamming/counting
      msgLimit = r.random(msgLimitRangeArr);

      
    } else if (message.toLowerCase() === '!ignore' && !ignoreList.some(user => user.id == tags['user-id'] )) {

      user = tags['display-name']
      id = tags['user-id']

      console.log(ignoreList, "before")

      fs.addUsertoIgnoreList(user, id, ignoreList);

      //add confimation msg

    } else if (message.toLowerCase() === '!unignore' && ignoreList.some(user => user.id == tags['user-id'] )) {

      id = tags['user-id']
      
      fs.removeUserFromIgnoreList( id )
      .then(() => {

        const newIgnoreList = ignoreList.filter(user => {
          return user.id !== parseInt(id) ;
        });

        ignoreList = newIgnoreList;
        console.log(ignoreList, 'after deletion');

      })
      .catch(error => {
        console.log(error);
      });

      //add confimation msg

    } else {
      
      msgCount++;

    }
  }
	
  //logs chat messages
  // console.log(`${channel}'s Chat ${msgCount} ${tags['display-name']}: ${message}`);


});