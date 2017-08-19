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
    name: String
  });


  const Emojis = mongoose.model('emojis', emojiSchema);


  for (var key in emoji) {
    if (emoji.hasOwnProperty(key)) {
      var names = emoji[key][3];
      names = names.constructor === Array ? names : [names];
      var emoji_char = emoji[key][0][0];
      for (var emojiName of names) {

        getEmoji(Emojis, emojiName, insertEmoji);

        //Insert if not exists
        /*Emojis.findOne({"name" : emojiName}, {safe:true}, function(err, result) {
          if (!err) {
            if(!result){
              console.log('insert ' + emojiName)

              var newEmojiData = {
                name: emojiName
              }

              var newEmoji = new Emojis(newEmojiData);

              /*newEmoji.save( function(error, data){
                  if(error){
                      console.log(error)
                  }
                  else{
                      console.log(emojiName + ' inserted')
                  }
              });
            }
          }
          else{
            console.log(err)
          }


        })
        */
      }
    }
  }

  return

})


function getEmoji(schema, emojiName, next ) {
  schema.findOne({"name" : emojiName}, {safe:true}, function(err, result) {
    if (!err) {
      if(!result){
        console.log('next insert ' + emojiName)

        return next(err, schema, emojiName)
      }
    }
  })

}

function insertEmoji(err, schema, emojiName) {

   console.log('insert ' + emojiName);

   var newEmojiData = {
     name: emojiName
   }

   var newEmoji = new schema(newEmojiData);

   newEmoji.save( function(error, data){
       if(error){
           console.log(error)
       }
       else{
           console.log(emojiName + ' inserted')
       }
   });

}
