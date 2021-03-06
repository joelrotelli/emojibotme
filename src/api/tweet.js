const Twit = require('twit')
const config = require('../config')

const param = config.twitterConfig

const bot = new Twit(config.twitterKeys)

const debug = config.debug

const tweetnow = (text, tweetId) => {

  if(debug == 'true'){
    console.log('Tweet : ' + text  + '(tweetId : '+ tweetId +')')
  }
  else{
    bot.post(
      'statuses/update',
      {
        status : text,
        in_reply_to_status_id: tweetId
      },
      (err, data, response) => {
        if (err) {
          console.log(err)
        } else {
          console.log(text + '(tweetId : '+ tweetId +')')
        }
      }
    )
  }
}

module.exports = tweetnow
