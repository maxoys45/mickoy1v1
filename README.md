# Mickoy's 1v1
App for keeping track of how bad chubbylove is with AWP.

# DB commands
1. Go onto Atlas and click 'Clusters' then 'Connect', select Shell, then use the connect command:
2. mongo "mongodb+srv://mouspong-v85w0.mongodb.net/[COLLECTION]"  --username [USERNAME]
3. Password is saved in MongoURI in .env

# rename collection
db.[collection].renameCollection("[newname]", false) (false keeps previous data intact)

# mass update users
db.users.update({}, { $set: { "elo.current" : 1000, "elo.previous" : [] }}, false, true)
db.users.update({}, { $unset: { "stats" : "" }}, false, true)

// TODOS:
// add fav map to leaderboard maybe?
// page some times has browser loading spinner, requires manual reload to sort.