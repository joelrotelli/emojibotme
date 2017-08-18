
const emoji = require('node-emoji')
const unique = require('unique-random-array')

// Return a random emoji from a keyword
const randomEmojiFromKeyword = (keyword) => {

  let output
  /**
      @TODO Constituer une base de données de mot clé => emoji aléatoire :
      Un fichier txt par theme ? vacances.txt :
      "vacances, plage, soleil, beach : emoji1, emoji2, emoji3, ..."
  */
  if(keyword == 'vacances' || keyword == 'holidays'){
    const randomEmoji = unique(["sunglasses","dark_sunglasses", "beach_with_umbrella"])
    output = emoji.get(randomEmoji())
  }

  return output
}

module.exports = randomEmojiFromKeyword
