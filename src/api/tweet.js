const Twit = require('twit')
const config = require('../config')

const param = config.twitterConfig

const bot = new Twit(config.twitterKeys)

const debug = config.debug

const follow = (action, text, tweetId) => {

  if(debug == 'true'){
    console.log('Tweet : ' + text  + '(tweetId : '+ tweetId +')')
  }
  else{
    bot.post(
      action,
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

module.exports = follow
