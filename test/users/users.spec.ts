import test from 'japa'
import supertest from 'supertest'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`
test.group('User', () => {
  test.only('it should create an user!', async (assert) => {
    const user = {
      email: 'test@test.com',
      username: 'test',
      password: 'teste',
      avatar: 'https://images.com/image/1',
    }
    const { body } = await supertest(BASE_URL).post('/users').send(user).expect(201)
    assert.exists(body.user, 'User undefined')
    assert.exists(body.user.id, 'Id undefined')
    assert.equal(body.user.email, user.email)
    assert.equal(body.user.username, user.username)
    assert.equal(body.user.avatar, user.avatar)
    assert.equal(body.user.password, user.password)
  })
})
