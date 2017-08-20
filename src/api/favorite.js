const Twit = require('twit')
const config = require('../config')

const param = config.twitterConfig

const bot = new Twit(config.twitterKeys)

const debug = config.debug

const favorite = (tweetId) => {

  if(debug == 'true'){
    console.log('FAV: ' ,  tweetId)
  }
  else{
    bot.post('favorites/create', {
      id: tweetId
    }, (err, data, response) => {
      if (err) {
        console.log(err)
      } else {
        console.log(tweetId +' liked!')
      }
    })
  }



}

module.exports = favorite
