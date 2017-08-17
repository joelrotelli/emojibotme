const Twit = require('twit')
const unique = require('unique-random-array')
const config = require('../config')

const param = config.twitterConfig
const randomReply = unique(param.randomReply.split('|'))

const bot = new Twit(config.twitterKeys)

const emoji = require('node-emoji')



// function: replies to a user from a keyword
const replyToKeywords = (keyword) => {
console.log(keyword);

  bot.get(
    'search/tweets',
    {
      q: keyword,
      result_type: param.resultType,
      lang: param.language,
      filter: 'safe',
      count: param.searchCount
    },
    (err, data, response) => {
      if (err) {
        console.log('ERRORDERP: Cannot Search Tweet!, Description here: ', err)
      } else {
        // grab tweet ID
        const random = Math.floor(Math.random() * param.searchCount) + 1
        let tweetId
        try {
          tweetId = data.statuses[random].id_str
        } catch (e) {
          console.log('ERRORDERP: Cannot assign tweetId')
          return
        }

        const user = data.statuses[random].user

        //console.log(data.statuses[random])
        //console.log(user)

        const response = '@' + user.screen_name + ' '+ emoji.get('sunglasses')
        //console.log(response);
        console.log( tweetId);
        bot.post(
          'statuses/update',
          {
            status : response,
            in_reply_to_status_id: tweetId
          },
          (err, data, response) => {
            if (err) {
              console.log(err)
            } else {
              console.log(response + ' tweeted to @' + user.screen_name)
            }
          }
        )

      }
    }
  )


}

module.exports = replyToKeywords
