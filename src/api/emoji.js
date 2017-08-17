
const emoji = require('node-emoji')

// Return a random emoji from a keyword
const randomEmojiFromKeyword = (keyword) => {

  let output
  /**
      @TODO Constituer une base de données de mot clé => emoji aléatoire :
      Un fichier txt par theme ? vacances.txt :
      "vacances, plage, soleil, beach : emoji1, emoji2, emoji3, ..."
  */
  if(keyword == 'vacances' || keyword == 'holidays'){
    output = emoji.get('sunglasses');
  }

  return output
}

module.exports = randomEmojiFromKeyword
