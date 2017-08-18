
const emoji = require('node-emoji')
const unique = require('unique-random-array')

// Return a random emoji from a keyword
const randomEmojiFromKeyword = (keyword) => {

  let output, randomEmoji

  /**
      @TODO Constituer une base de données de mot clé => emoji aléatoire :
      Un fichier txt par theme ? vacances.txt :
      "vacances, plage, soleil, beach : emoji1, emoji2, emoji3, ..."
  */
  if(keyword == 'vacances' || keyword == 'holidays'){
    const randomEmoji = unique(["sunglasses","dark_sunglasses", "beach_with_umbrella"])
    output = emoji.get(randomEmoji())
  }

  if(keyword == 'triste' || keyword == 'tristesse' || keyword == 'sad' || keyword == 'sadness' || keyword == 'pleurer' || keyword == 'pleure' || keyword ==  'cry'){

      const randomEmoji = unique(["cry","crying_cat_face", "sleepy", "sob", "disappointed_relieved"])
      output = emoji.get(randomEmoji())
  }

  if(keyword == 'peur'){
    const randomEmoji = unique(["scream", "flushed", "worried", "pray", ])
    output = emoji.get(randomEmoji())
  }


  return output
}

module.exports = randomEmojiFromKeyword
