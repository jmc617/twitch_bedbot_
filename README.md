# Bedbot
## Description
[Twitch](https://www.twitch.tv/) chatbot client created using [Tmi.js](https://tmijs.com/). Listens to chat and re-sends user messages with a humorous ending at set intervals. 
Created as a gift for [Shellieface](https://www.twitch.tv/shellieface). Will be updated to use the [bedbot API](https://github.com/jmc617/bedbot-api) to save user data and join multiple chat streams.

## Functions

<img src="https://user-images.githubusercontent.com/38439541/177021310-71d357c4-2d1f-4f0a-b9fe-2fb626a799d6.png" 
     alt="screenshot of two twitch messages, one from a chatter and one from the bot. The chatter says 'happy little accidents' and 'the bot replies, 'happy little accidents ...in bed ;-)'" 
     width=50%></img>


![bedbot_triggers_2 (2)](https://github.com/jmc617/twitch_bedbot_/assets/38439541/e4a38db4-893c-41bd-9fd1-b885808716cd)

     
## Getting Started

### Dependencies
- [tmi.js](https://www.npmjs.com/package/tmi.js)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [@google-cloud/firestore](https://www.npmjs.com/package/@google-cloud/firestore)
- [sleep-promise](https://www.npmjs.com/package/sleep-promise)


### Installing & Running in Development Environment

1. Fork, clone or download code
2. Initialize node 
```
npm init
```
3. Install dependencies
```
npm i tmi.js dotenv
```
4. Create twitch account for your bot at [twitch.tv](https://www.twitch.tv/) and then create the .env file with twitch bot credentials (``TWITCH_BOT_USERNAME`` and ``TWITCH_OAUTH_TOKEN``) more information can be found here: [Twitch Developer Authentication docs](https://dev.twitch.tv/docs/authentication)
5. Change channels to connect bot to in the ``channels`` property in the ``client`` variable.
5. Launch app on localhost
```
npm start
```
                                                                                                               

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
