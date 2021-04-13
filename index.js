require('dotenv').config()
require('./mongo')

const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')
const express = require('express')
const app = express()
const cors = require('cors')
const Project = require('./models/Project')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')

app.use(cors())
app.use(express.json())

Sentry.init({
  dsn: 'https://d9c98ed5a079444db17c836b709421c4@o567572.ingest.sentry.io/5711675',
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ app })
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0
})

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler())
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())

app.get('/', (request, response) => {
  response.send('<h1>Hola Mundo</h1>')
})

app.get('/api/projects', async (request, response) => {
  const projects = await Project.find({})
  response.json(projects)
})

app.get('/api/projects/:id', (request, response, next) => {
  const { id } = request.params

  Project.findById(id).then(project => {
    return project ? response.json(project) : response.status(404).end()
  }).catch(err => {
    next(err)
  })
})

app.put('/api/projects/:id', (request, response, next) => {
  const { id } = request.params
  const project = request.body

  const newProjectInfo = {
    tittle: project.tittle,
    sqr_mts: project.sqr_mts,
    ubication: project.ubication,
    date: project.date,
    details: project.details
  }

  Project.findByIdAndUpdate(id, newProjectInfo, { new: true })
    .then(result => {
      response.json(result)
    }).catch(err => next(err))
})

app.delete('/api/projects/:id', async (request, response, next) => {
  const { id } = request.params
  await Project.findByIdAndRemove(id)
  response.status(204).end()
})

app.post('/api/projects/', async (request, response, next) => {
  const project = request.body

  if (!project || !project.tittle || !project.sqr_mts || !project.ubication || !project.date || !project.details) {
    return response.status(400).json({
      error: 'Datos faltantes del proyecto'
    })
  }

  const newProject = new Project({
    tittle: project.tittle,
    sqr_mts: project.sqr_mts,
    ubication: project.ubication,
    date: project.date,
    details: project.details
  })

  try {
    const savedProject = await newProject.save()
    response.json(savedProject)
  } catch (error) {
    next(error)
  }
})

app.use(notFound)

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler())
app.use(handleErrors)

const PORT = process.env.PORT
const server = app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`)
})

module.exports = { app, server }
