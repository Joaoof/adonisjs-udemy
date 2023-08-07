import Database from '@ioc:Adonis/Lucid/Database'
import { UserFactory } from 'Database/factories'
import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('Session', (group) => {
  test.only('it should autenticate an user', async (assert) => {
    const plainPassword = 'test' // senha em texto puro
    const { id, email } = await UserFactory.merge({
      password: plainPassword,
    }).create()
    const { body } = await supertest(BASE_URL)
      .post('/sessions')
      .send({ email, password: plainPassword })
      .expect(201)

    assert.isDefined(body.user, 'User undefined')
    assert.equal(body.user.id, id)
  })

  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })

  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })
})