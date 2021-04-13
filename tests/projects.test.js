const { mongoose } = require('mongoose')
const { server } = require('../index')

const Project = require('../models/Project')
const { initialProjects, api, getAllTittleFromProjects, getAllUbicationsFromProjects } = require('./helpers')

beforeEach(async () => {
  await (Project.deleteMany({}))

  for (const project of initialProjects) {
    const projectObject = new Project(project)
    await projectObject.save()
  }
})

describe('GET all projects', () => {
  test('Projects are returned as json', async () => {
    await api
      .get('/api/projects')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('There are 2 projects', async () => {
    const response = await api.get('/api/projects')
    expect(response.body).toHaveLength(initialProjects.length)
  })

  test('One project is on Pueblo Llano', async () => {
    const {
      ubications
    } = await getAllUbicationsFromProjects()

    expect(ubications).toContain('Pueblo Llano')
  })
})

describe('Create a project', () => {
  test('Is possible with a valid format', async () => {
    const newProject = {
      tittle: 'Proyecto test',
      sqr_mts: '50 m2',
      ubication: 'San Miguel',
      date: '01-08-2020',
      details: 'Lorem ipsum situnLorem ipsum dolor sit amet, consectetur adipiscing elit. In a. dolorem'
    }

    await api
      .post('api/projects')
      .send(newProject)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const { tittles, response } = await getAllTittleFromProjects()

    expect(response.body).toHaveLength(initialProjects.length + 1)
    expect(tittles).toContain('Proyecto test')
  })

  test("Isn't possible with a valid format", async () => {
    const newProject = {
      tittle: 'Proyecto test',
      ubication: 'San Miguel',
      date: '01-08-2020',
      details: 'Lorem ipsum situnLorem ipsum dolor sit amet, consectetur adipiscing elit. In a. dolorem'
    }

    await api
      .post('api/projects')
      .send(newProject)
      .expect(400)

    const response = await api.get('/api/projects')

    expect(response.body).toHaveLength(initialProjects.length)
  })
})

describe('Delete projects', () => {
  test('A note can be deleted', async () => {
    const { response } = await getAllTittleFromProjects()
    const { body: projects } = response
    const projectToDelete = projects[0]

    await api
      .delete(`api/projects/${projectToDelete}`)
      .expect(204)

    const { tittles, response: secondResponse } = await getAllTittleFromProjects()
    expect(secondResponse.body).toHaveLength(initialProjects.length - 1)

    expect(tittles).not.toContain(projectToDelete.tittle)
  })

  test("A note that don't exist can't be deleted", async () => {
    await api
      .delete('api/projects/15415')
      .expect(400)

    const { response } = await getAllTittleFromProjects()
    expect(response.body).toHaveLength(initialProjects.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
