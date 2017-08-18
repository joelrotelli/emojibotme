
const Twit = require('twit')
const unique = require('unique-random-array')
const config = require('../config')

const param = config.twitterConfig

const randomEmojiFromKeyword = require('./emoji')
const randomKeyword = unique(param.keywordsList.split(';'))


const bot = new Twit(config.twitterKeys)


// function: replies to a user from a keyword
const replyToKeywords = () => {

  const keyword = randomKeyword()

  console.log("keyword : " + keyword);

  bot.get(
    'search/tweets',
    {
      q: keyword,
      result_type: 'popular',
      //lang: param.language,
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
        const emojiReply = randomEmojiFromKeyword(keyword)

        if(!emojiReply){
          console.log('No emoji found')
          return
        }

        //console.log(data.statuses[random])
        //console.log(user)

        const response = '@' + user.screen_name + ' '+ emojiReply
        console.log(response)

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
              console.log(response + ' tweeted to @' + user.screen_name + '(tweetId : '+ tweetId +')')
            }
          }
        )

      }
    }
  )


}

module.exports = replyToKeywords
