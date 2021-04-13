const supertest = require('supertest')

const { app } = require('../index')

const api = supertest(app)

const initialProjects = [
  {
    tittle: 'Proyecto 1',
    sqr_mts: '200 m2',
    ubication: 'Pueblo Llano',
    date: '13-02-2021',
    details: 'Lorem ipsum situnLorem ipsum dolor sit amet, consectetur adipiscing elit. In a. dolorem'
  },
  {
    tittle: 'Proyecto 2',
    sqr_mts: '100 m2',
    ubication: 'Santiago de Chile',
    date: '20-08-2020',
    details: 'Lorem ipsum situnLorem ipsum dolor sit amet, consectetur adipiscing elit. In a. dolorem'
  }
]

const getAllTittleFromProjects = async () => {
  const response = await api.get('/api/projects')
  return {
    tittles: response.body.map(project => project.tittle),
    response
  }
}

const getAllUbicationsFromProjects = async () => {
  const response = await api.get('/api/projects')
  return {
    ubications: response.body.map(project => project.ubication),
    response
  }
}

module.exports = {
  api,
  initialProjects,
  getAllTittleFromProjects,
  getAllUbicationsFromProjects
}
