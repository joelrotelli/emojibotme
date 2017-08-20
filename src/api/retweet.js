const Twit = require('twit')
const config = require('../config')

const param = config.twitterConfig

const bot = new Twit(config.twitterKeys)

const debug = config.debug

const retweet = (tweetId) => {

  if(debug == 'true'){
    console.log('RT: ' ,  tweetId)
  }
  else{
    bot.post(
      'statuses/retweet/:id',
      {
        id: tweetId
      },
      (err, response) => {
        if (err) {
          console.log('ERRORDERP: Retweet!')
        }
        console.log('SUCCESS: RT: ' ,  tweetId)
      }
    )
  }



}

module.exports = retweet
