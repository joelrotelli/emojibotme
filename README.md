# Emojibot Me

### Update Emoji database :

1. Mettre à jour le dépot git de node-emoji
cd src/emojis; git pull

2. Mettre à jour le fichier json des emojis
node src/emojis/lib/emojiparse  

3. Mettre à jour la base de données mongo
node src/api/updateEmojiDB.js   


### Mettre en production
prod.sh

### Mettre à jour la base de données
updatedb.sh
