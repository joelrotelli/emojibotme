const Twit = require('twit')
const unique = require('unique-random-array')
const fs = require('fs')
const config = require('../config')

const param = config.twitterConfig
const randomReply =  unique(fs.readFileSync('src/data/answersNewFollowers.txt').toString().split("\n"));


const bot = new Twit(config.twitterKeys)



// function: tweets back to user who followed
function tweetNow(text) {
  let tweet = {
    status: text
  }

  bot.post('statuses/update', tweet, (err, data, response) => {
    if (err) {
      console.log('ERRORDERP Reply', err)
    }
    console.log('SUCCESS: Replied: ', text)
  })
}

// function: replies to user who followed
const replyToNewFollower = (event) => {
  // get user's twitter handler/screen name
  let screenName = event.source.screen_name

  if (screenName === config.twitterConfig.username) {
    return
  }
  const response = randomReply()

  const res = response.replace('${screenName}', screenName)

  tweetNow(res)
}


module.exports = replyToNewFollower
