const express = require('express')
const cors = require('cors')

const app = express()

const logger = require('./modules/loggerMiddleware')
app.use(cors())
app.use(express.json())

app.use(logger)

let projects = [
  {
    id: 1,
    tittle: 'Proyecto 1',
    sqr_mts: '120 m2',
    ubication: 'La Serena',
    date: '25-01-2020',
    details: 'Lorem ipsum situnLorem ipsum dolor sit amet, consectetur adipiscing elit. In a. dolorem'
  },
  {
    id: 2,
    tittle: 'Proyecto 2',
    sqr_mts: '200 m2',
    ubication: 'Santiago',
    date: '10-03-2020',
    details: 'Lorem ipsum situnLorem ipsum dolor sit amet, consectetur adipiscing elit. In a. dolorem'
  },
  {
    id: 3,
    tittle: 'Proyecto 3',
    sqr_mts: '185 m2',
    ubication: 'Mérida',
    date: '10-01-2021',
    details: 'Lorem ipsum situnLorem ipsum dolor sit amet, consectetur adipiscing elit. In a. dolorem'
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hola Mundo</h1>')
})

app.get('/api/projects', (request, response) => {
  response.json(projects)
})

app.get('/api/projects/:id', (request, response) => {
  const id = Number(request.params.id)
  const project = projects.find(project => project.id === id)

  if (project) {
    response.json(project)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/projects/:id', (request, response) => {
  const id = Number(request.params.id)
  projects = projects.filter(project => project.id !== id)
  response.status(204).end()
})

app.post('/api/projects/', (request, response) => {
  const project = request.body

  if (!project || !project.tittle || !project.sqr_mts || !project.ubication || !project.date || !project.details) {
    return response.status(400).json({
      error: 'Datos faltantes del proyecto'
    })
  }

  const ids = projects.map(project => project.id)
  const maxId = Math.max(...ids)

  const newProject = {
    id: maxId + 1,
    tittle: project.tittle,
    sqr_mts: project.sqr_mts,
    ubication: project.ubication,
    date: project.date,
    details: project.details
  }

  projects = [...projects, newProject]

  response.json(newProject)
})

app.use((request, response) => {
  response.status(404).json({
    error: 'Página no encontrada'
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running in port ${PORT}`)
})
