const mongoose = require('mongoose')

const conectionString = process.env.MONGO_DB_URI

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
