
const Twit = require('twit')
const unique = require('unique-random-array')
const fs = require('fs');
const config = require('../config')

const mongo = require('mongodb')
const mongoose = require('mongoose')
const mongooseRandom = require('mongoose-simple-random')
const emoji = require('node-emoji')

const param = config.twitterConfig

const randomEmojiFromKeyword = require('./emoji')
const randomKeyword =  unique(fs.readFileSync('src/data/keywords.txt').toString().split("\n"));

const bot = new Twit(config.twitterKeys)

const debug = config.debug


// function: replies to a user from a keyword
const replyToKeywords = () => {

  const keyword = randomKeyword()

  console.log("keyword : " + keyword);

 if(keyword){
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
          console.log('ERRORDERP: Cannot assign tweetId')
          return
        }

        //TODO REPLACER TOUT CA DANS UN MODULE A PART : Probleme : wait for reponse de mongo...
        mongoose.connect('mongodb://localhost/emojibotme',
          {
            useMongoClient: true
          }
        );

        const db = mongoose.connection;

        db.on('error', console.error.bind(console, 'connection error:'));


        let output, randomEmoji

        db.once('open', function() {

          const emojiSchema = new mongoose.Schema({
            name: String
          });

          emojiSchema.plugin(mongooseRandom);

          const Emojis = mongoose.model('emojis', emojiSchema);

          Emojis.findOneRandom({"keywords" : { '$regex' : keyword }}, function(err, result) {

            if (!err) {
              emojiReply = emoji.get(result.name)

              if(!emojiReply){
                console.log('No emoji found')
                return
              }

              const responseTweet = emojiReply + ' https://twitter.com/'+user.screen_name+'/status/'+tweetId

              if(debug == 'true'){
                console.log('debug')
                //console.log(data.statuses[random])
                //console.log(user)
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
          });

        });




      }
    }
  )

}


}

module.exports = replyToKeywords
