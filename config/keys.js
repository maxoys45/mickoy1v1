const db = 'mongodb+srv://maxoys45:Mongoys2k20@mouspong-v85w0.mongodb.net/1v1_dev?retryWrites=true&w=majority'
// const db = 'mongodb://localhost:27017/mouspong_delete'

module.exports = process.env.MONGODB_URL || db
