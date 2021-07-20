require('dotenv').config()
const mysql = require('mysql');
const tmi = require('tmi.js');
const msgLimit = 5;
let msgCount = 0;
const insertedMsg = '...in bed ;-)'
//twitch credentials
const botUsername = process.env.TWITCH_BOT_USERNAME
const token = process.env.TWITCH_OAUTH_TOKEN
//database credentials
const host = process.env.DB_HOST
const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const database = process.env.DB_NAME
//twitch client info
const client = new tmi.Client({
  connection: {
    reconnect: true
  },
  identity: {
		username: botUsername,
		password: token
	},
	channels: [ 'jess617', 'shellieface' ]
});
//msql db connection info
const connection = mysql.createConnection({
  host     : host,
  user     : user,
  password : password,
  database : database
});

client.connect().catch(console.error);

client.on('message', (channel, tags, message, self) => {
	//remove below if self works
  // const isNotBot = tags.username.toLowerCase() !== process.env.TWITCH_BOT_USERNAME
  

  if( !self ) {

    if ( message.toLowerCase() === 'bedbot no!' || message.toLowerCase() === '@bedbot_ no!' ) {

      client.say(channel, `no regrets ;-)`)

    } else if ( message.toLowerCase() === 'bedbot yes!' || message.toLowerCase() === '@bedbot_ yes!' ) {

      client.say(channel, `just doing my job ;-)`)  

    } else if ( message === '!bed join' && channel === botUsername ) {
      //join channel of person using the command
      //add them to database with default values
      client.join(tags.username)
        .then((data) => {
          // data returns [channel]
          client.say(channel, `I have joined your channel, ${tags.username}`) 
        }).catch((err) => {
          console.log(err)
        }); 

    } else if ( message === '!bed leave' && channel === botUsername ) {
      //leave channel of person using the command
      //remove them from database
      client.part(tags.username)
        .then((data) => {
          // data returns [channel]
          client.say(channel, `I have left your channel, ${tags.username}`) 
        }).catch((err) => {
          console.log(err)
        }); 
    
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

//sample mysql connection for later
// connection.connect();

//sample mysql query
// connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is: ', results[0].solution);
// });

// connection.end();