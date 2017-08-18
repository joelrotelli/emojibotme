
const Twit = require('twit')
const unique = require('unique-random-array')
const fs = require('fs');
const config = require('../config')

const param = config.twitterConfig

const randomEmojiFromKeyword = require('./emoji')
const randomKeyword =  unique(fs.readFileSync('src/data/keywords.txt').toString().split("\n"));

const bot = new Twit(config.twitterKeys)

const debug = config.debug


// function: replies to a user from a keyword
const replyToKeywords = () => {

  const keyword = randomKeyword()

  console.log("keyword : " + keyword);

  bot.get(
    'search/tweets',
    {
      q: keyword,
      result_type: 'mixed',
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
        let tweetId, user
        try {
          tweetId = data.statuses[random].id_str

          //If retweeted, get original tweet user
          if(data.statuses[random].retweeted_status){
            tweetId = data.statuses[random].retweeted_status.id_str
            user = data.statuses[random].retweeted_status.user
            text = data.statuses[random].retweeted_status.text

            console.log('retweeted ')
            console.log(tweetId + ' au lieu de  ' + data.statuses[random].id_str)
            console.log(user.screen_name + ' au lieu de  ' + data.statuses[random].user.screen_name)
          }
          else{
            tweetId = data.statuses[random].id_str
            user = data.statuses[random].user
            text = data.statuses[random].text
          }

        } catch (e) {
          console.log('ERRORDERP: Cannot assign tweetId')
          return
        }

        const emojiReply = randomEmojiFromKeyword(keyword)

        if(!emojiReply){
          console.log('No emoji found')
          return
        }

        const responseTweet = emojiReply + ' RT @' + user.screen_name + ' '+ text

        if(debug == 'true'){
          console.log('debug')
          //console.log(data.statuses[random])
          console.log(user)
          console.log(responseTweet)
        }
        else{
          console.log('not debug');
          bot.post(
            'statuses/update',
            {
              status : responseTweet,
              in_reply_to_status_id: tweetId
            },
            (err, data, response) => {
              if (err) {
                console.log(err)
              } else {
                console.log(responseTweet + ' tweeted to @' + user.screen_name + '(tweetId : '+ tweetId +')')
              }
            }
          )
        }



      }
    }
  )


}

module.exports = replyToKeywords
