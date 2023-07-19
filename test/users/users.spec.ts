import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`
test.group('User', () => {
  test.only('it should create an user!', async () => {
    const user = { email: 'test@test.com', username: 'test', password: 'teste ' }
    await supertest(BASE_URL).post('/users').send(user).expect(201)
  })
})
