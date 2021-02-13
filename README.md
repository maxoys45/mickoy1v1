# MousPong
Ping pong app for keeping track of everyones matches at Mous.

# DB commands
Go onto Atlas and click 'Clusters' then 'Connect', select Shell, then use the connect command:
mongo "mongodb+srv://mouspong-v85w0.mongodb.net/[COLLECTION]"  --username [USERNAME]

db.users.update({}, { $set: { "elo.current" : 1000, "elo.previous" : [] }}, false, true)
db.users.update({}, { $unset: { "stats" : "" }}, false, true)

// TODO: sort out shortNames (probably dont need)
// add map to match history
// add fav map to leaderboard maybe?
// sort out gulp watch not working (new gulp4.0 issue possibly)
