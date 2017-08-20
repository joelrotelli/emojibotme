const Twit = require('twit')
const config = require('../config')

const param = config.twitterConfig

const bot = new Twit(config.twitterKeys)

const debug = config.debug

const follow = (screenName) => {

  if(debug == 'true'){
    console.log('Follow: ' ,  tweetId)
  }
  else{
    bot.post('friendships/create', {
      screen_name: screenName
     }, (err, data, response) => {
      if (err) {
        console.log(err)
      } else {
        console.log('@' + screenName + ' followed !')
      }
    })
  }



}

module.exports = follow
