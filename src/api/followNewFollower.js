const Twit = require('twit')
const config = require('../config')

const param = config.twitterConfig

const bot = new Twit(config.twitterKeys)

const follow = require('./follow')

// function: replies to user who followed
const followNewFollower = (event) => {
  // get user's twitter handler/screen name
  let screenName = event.source.screen_name

  if (screenName === config.twitterConfig.username) {
    return
  }
  
  follow(screenName)
}


module.exports = followNewFollower
