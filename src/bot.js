// bot features
// due to the Twitter ToS automation of likes
// is no longer allowed, so:
const Twit = require('twit')
const config = require('./config')

const bot = new Twit(config.twitterKeys)

//const retweet = require('./api/retweet')
const replyToNewFollower = require('./api/replyToNewFollower')
const replyToKeywords = require('./api/replyToKeywords')
const followNewFollower = require('./api/followNewFollower')


replyToKeywords()
setInterval(replyToKeywords, config.twitterConfig.reply)

const userStream = bot.stream('user')

//Answser to a query
userStream.on()

//Follow a new follower
userStream.on('follow', followNewFollower)

// reply to new follower
//userStream.on('follow', replyToNewFollower)
