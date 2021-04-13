const mongoose = require('mongoose')

const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env

const conectionString = NODE_ENV === 'test'
  ? MONGO_DB_URI_TEST
  : MONGO_DB_URI

// Conexión a MongoDB
mongoose.connect(conectionString, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => {
  console.log('Database connected')
}).catch(err => {
  console.error(err)
})

process.on('uncaughtException', () => {
  mongoose.connection.disconnect()
})
