const Twit = require('twit')
const unique = require('unique-random-array')
const fs = require('fs');
const config = require('../config')

const mongo = require('mongodb')
const mongoose = require('mongoose')
const mongooseRandom = require('mongoose-simple-random')
const emoji = require('node-emoji')

const retweet = require('./retweet')

const param = config.twitterConfig

const randomEmojiFromKeyword = require('./emoji')

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



const replyToKeywords = (event) => {
  getRandomKeyword(Emojis, getReply);
}

// function: replies to a user from a keyword
function getReply(randomKeyword){

  console.log("3. keyword : " + randomKeyword);

 if(randomKeyword){
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

        //TODO REPLACER TOUT CA DANS UN MODULE A PART : Probleme : wait for reponse de mongo : voir soluton asynchrone utilisée dans updateEmojiDB


        let output, randomEmoji

        //db.once('open', function() {

          console.log('laa', randomKeyword)
          Emojis.findOneRandom({"keywords" : { '$regex' : randomKeyword }}, function(err, result) {

            if (!err) {
              console.log('result ' + result); // 1 element
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
                retweet(tweetId)
              }
              else{
                console.log('not debug');

                retweet(tweetId)

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

        //});




      }
    }
  )

}


}


//Get a random keyword from all keywobrds in emojis collection (for search)
function getRandomKeyword(Schema, next){
  console.log('1. getRandomKeyword')

  let random
  let keywords
  var i = 0
  Schema.find({}, function(err, results) {
    if (!err) {
      results.forEach(function(result){
         keywords += ',' + result.keywords.split(';')
      })

      random = unique(keywords.split(','))()
      console.log('2. random search : ', random)
      next(random)
    }
  })
}


module.exports = replyToKeywords
