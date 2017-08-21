const Twit = require('twit')
const unique = require('unique-random-array')
const fs = require('fs');
const config = require('../config')
const mongo = require('mongodb')
const mongoose = require('mongoose')
const mongooseRandom = require('mongoose-simple-random')
const emoji = require('node-emoji')
const retweet = require('./retweet')
const favorite = require('./favorite')
const tweetnow = require('./tweet')
const follow = require('./follow')
const tweet = require('./tweet')
const randomEmojiFromKeyword = require('./emoji')
const param = config.twitterConfig
const bot = new Twit(config.twitterKeys)
const debug = config.debug

mongoose.connect('mongodb://localhost/emojibotme',
  {
    useMongoClient: true
  }
);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

const emojiSchema = new mongoose.Schema({
  name: String,
  keywords: String
});

emojiSchema.plugin(mongooseRandom);

const Emojis = mongoose.model('emojis', emojiSchema);


//Call functions
const replyToKeywords = (event) => {
  Emojis.findOneRandom({}, function(err, result) {
    if (!err) {
      console.log('result ' + result); // 1 element
      emojiReply = emoji.get(result.name)
      keywords = result.keywords
      randomKeyword = unique(keywords.split(';'))()

      bot.get(
        'search/tweets',
        {
          q: randomKeyword,
          result_type: 'mixed',
          //lang: param.language,
          filter: 'safe',
          count: param.searchCount
        },
        (err, data, response) => {
          if (err) {
            console.log('Cannot Search Tweet!, Description here: ', err)
          } else {
            // grab tweet ID
            const random = Math.floor(Math.random() * param.searchCount) + 1
            let tweet, tweetId, user, text, url
            try {

              tweetId = data.statuses[random].id_str

              //If retweeted, get original tweet
              if(data.statuses[random].retweeted_status){
                tweet = data.statuses[random].retweeted_status

                console.log('retweeted ')
              }
              else{
                tweet = data.statuses[random]
              }

              tweetId = tweet.id_str
              user = tweet.user
              text = tweet.text
              url = tweet.url

            } catch (e) {
              console.log('No tweet found :(')
              return
            }


            let output, randomEmoji

            //Randomly reply or quote
            var randomBool = Math.random()<.5
            let responseTweet

            if(randomBool === true){
              responseTweet = emojiReply + ' https://twitter.com/'+user.screen_name+'/status/'+tweetId
            }
            else{
              responseTweet = '@' + user.screen_name + ' '+ emojiReply
            }

            if(debug == 'true'){
              console.log('debug')
              //console.log(data.statuses[random])
              //console.log(user)
              console.log("Tweet : " + text)
              console.log("Response : " + responseTweet)

            }
            else{
              console.log('not debug');

              favorite(tweetId)
              follow(user.screen_name)
              tweetnow(responseTweet, tweetId)

            }

          }
        }
      )
    }
  })
}

module.exports = replyToKeywords
