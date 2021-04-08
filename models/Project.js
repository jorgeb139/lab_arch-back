const { Schema, model } = require('mongoose')

const projectSchema = new Schema({
  tittle: String,
  sqr_mts: String,
  ubication: String,
  date: String,
  details: String
})

projectSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Project = model('Project', projectSchema)

// const project = new Project({
//   tittle: 'Proyecto de prueba',
//   sqr_mts: '180 m2',
//   ubication: 'Talagante, Santiago',
//   date: '20/10/2020',
//   detalis: 'Blah Blah blah'
// })

// project.save()
//   .then(result => {
//     console.log(result)
//     mongoose.connection.close()
//   })
//   .catch(err => {
//     console.error(err)
//   })

// Project.find({}).then(result => {
//   console.log(result)
//   mongoose.connection.close()
// })

module.exports = Project
