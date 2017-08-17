const Twit = require('twit')
const config = require('../config')

const param = config.twitterConfig

const bot = new Twit(config.twitterKeys)

// function: replies to user who followed
const followNewFollower = (event) => {
  // get user's twitter handler/screen name
  let screenName = event.source.screen_name

  if (screenName === config.twitterConfig.username) {
    return
  }

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


module.exports = followNewFollower
