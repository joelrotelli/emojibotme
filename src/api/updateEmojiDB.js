// parse emojifile.js and insert into emojis collection if not exist

const mongo = require('mongodb')
const mongoose = require('mongoose')

const fs = require('fs'),
    path = require('path'),
    emoji = require('../../src/emojis/lib/emojifile').data;

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
    name: String,
    keywords: String
  });


  const Emojis = mongoose.model('emojis', emojiSchema);


  for (var key in emoji) {
    if (emoji.hasOwnProperty(key)) {
      var names = emoji[key][3];
      names = names.constructor === Array ? names : [names];
      var emoji_char = emoji[key][0][0];
      for (var emojiName of names) {
        //Check if emoji exist and insert if not
        getEmoji(Emojis, emojiName, insertEmoji);
      }
    }
  }

  return

})

//Fonction appelée initialement dans la boucle
function getEmoji(schema, emojiName, next ) {
  schema.findOne({"name" : emojiName}, {safe:true}, function(err, result) {
    if (!err) {
      if(!result){
        //console.log('next insert ' + emojiName)

        return next(err, schema, emojiName)
      }
    }
  })

}

//Fonction appelées en callback de getEmoji
function insertEmoji(err, schema, emojiName) {

   //console.log('insert ' + emojiName);

   let keyword = emojiName

   if(emojiName.indexOf('flag-') === -1){
     keyword = keyword.replace(/_/g, ' ')
     keyword = keyword.replace(/-/g, ' ')
   }


   var newEmojiData = {
     name: emojiName,
     keywords: keyword
   }

   var newEmoji = new schema(newEmojiData);

   newEmoji.save( function(error, data){
       if(error){
           console.log(error)
       }
       else{
            console.log(keyword)
       }
   });

}
