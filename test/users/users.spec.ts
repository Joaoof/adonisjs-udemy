import Database from '@ioc:Adonis/Lucid/Database' // Importa o módulo Database do Adonis.js para interagir com o banco de dados
import { UserFactory } from 'Database/factories/index' // importa a classe UserFactory do módulo Database/factories para criar usuários de teste
import test from 'japa' // importa a biblioteca Japa para escrever testes unitários
import supertest from 'supertest' //  importa a biblioteca supertest para fazer requisições HTTP durante os testes
import Hash from '@ioc:Adonis/Core/Hash' // importação de atualização do password do user

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}` // Define a URL base da API com base nas variáveis de ambiente HOST e PORT.
test.group('User', (group) => {
  // Define um grupo de testes chamado "User".
  test('it should create an user!', async (assert) => {
    // Define um teste dentro do grupo "User" que verifica se um usuário é criado corretamente.
    const userPayload = {
      email: 'test@test.com',
      username: 'test',
      password: 'teste',
      avatar: 'https://images.com/image/1',
    } // Define um objeto com os dados do usuário que será criado.
    const { body } = await supertest(BASE_URL)
      .post('/users')
      .send(userPayload)
      .expect(201)
    console.log(body) // Faz uma requisição POST para a rota '/users' da API com os dados do usuário e espera que a resposta tenha o código 201 (Created). O corpo da resposta é armazenado na variável body e é exibido no console.

    assert.exists(body.user, 'User undefined')
    assert.exists(body.user.id, 'Id undefined')
    assert.equal(body.user.email, userPayload.email)
    assert.equal(body.user.username, userPayload.username)
    assert.notExists(body.user.password, 'Password defined')
  }) // Realiza várias asserções para verificar se o objeto do usuário retornado na resposta possui as propriedades esperadas e se a senha não está presente.

  test('it should return 409 when email is already in use', async (assert) => {
    // Define um teste dentro do grupo "User" que verifica se a API retorna o código 409 (Conflict) quando o e-mail já está em uso.
    const { email } = await UserFactory.create() // API SENDO FEITA PELA FACTORIES. Cria um usuário de teste utilizando a classe UserFactory e armazena o e-mail gerado na variável email
    const { body } = await supertest(BASE_URL)
      .post('/users')
      .send({
        email,
        username: 'test',
        password: 'test',
      }) // Faz uma requisição POST para a rota '/users' da API com o e-mail já em uso e espera que a resposta tenha o código 409 (Conflict). O corpo da resposta é armazenado na variável body e é exibido no console.
      .expect(409)
    console.log({ body })
    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.include(body.message, 'email')
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 409)
  }) // Realiza várias asserções para verificar se o corpo da resposta possui as propriedades esperadas e se a mensagem de erro contém a palavra "email".

  test('it should return 409 when username is already in use', async (assert) => {
    const { username } = await UserFactory.create()
    const { body } = await supertest(BASE_URL)
      .post('/users')
      .send({
        email: 'joaoa@fkd.com',
        username,
        password: 'teste',
      })
      .expect(409)

    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.include(body.message, 'username')
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 409)
  })

  test('it should return 422 when required data is not provided', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post('/users')
      .send({}) // logica aplicada em UsersController.ts --> linha 8
      .expect(422)
    console.log({ body })
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('it email is invalid', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post('/users')
      .send({
        email: 'joao@',
        username: 'marcus',
        password: '12345dk',
      })
      .expect(422)
    console.log({ body })
    // assert.exists(body.message)
    // assert.exists(body.code)
    // assert.exists(body.status)
    // assert.equal(body.message, 'email')
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('it password is invalid', async (assert) => {
    const { body } = await supertest(BASE_URL)
      .post('/users')
      .send({
        email: 'joao400@gmail.com',
        username: 'testsded',
        password: 'tes',
      })
      .expect(422)
    // console.log({ body })
    // assert.exists(body.message)
    // assert.exists(body.code)
    // assert.exists(body.status)
    // assert.include(body.message, password')
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('it should update an user!', async (assert) => {
    // Cria um usuário de teste no banco de dados usando a Factory ou inserindo manualmente.
    const { id, password } = await UserFactory.create()
    const email = 'seila@gmail.com'
    const avatar = 'http://github.com/Joaoof.png'

    // Faz uma requisição PUT para a rota de atualização com os dados atualizados do usuário.
    const { body } = await supertest(BASE_URL)
      .put(`/users/${id}`)
      .send({
        id,
        email,
        avatar,
        password,
      })
      .expect(200)

    assert.exists(body.user, 'User undefined') // precisa existir dentro da resposta um objeto user.
    assert.equal(body.user.email, email) // se os valores retornados são iguais aos que eu atualizei
    assert.equal(body.user.avatar, avatar) //  se os valores retornados são iguais aos que eu atualizei
    assert.equal(body.user.id, id) //  se os valores retornados são iguais aos que eu atualizei.
    console.log()
  })

  test('it should update the password of the user', async (assert) => {
    const user = await UserFactory.create()
    const password = 'teste'
    // Faz uma requisição PUT para a rota de atualização com os dados atualizados do usuário.
    const { body } = await supertest(BASE_URL)
      .put(`/users/${user.id}`)
      .send({
        id: user.id,
        email: user.email,
        avatar: user.avatar,
        password,
      })
      .expect(200)

    assert.exists(body.user, 'User undefined') // precisa existir dentro da resposta um objeto user.
    assert.equal(body.user.id, user.id) //  se os valores retornados são iguais aos que eu atualizei.

    await user.refresh() // atualiza a senha no banco de dados, para a nova senha
    assert.isTrue(await Hash.verify(user.password, password))
  })

  test('it should return 422 when required data is not provided', async (assert) => {
    const { id } = await UserFactory.create()
    const { body } = await supertest(BASE_URL)
      .put(`/users/${id}`)
      .send({}) // logica aplicada em UsersController.ts --> linha 8
      .expect(422)
    console.log({ body })
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('User update email is invalid', async (assert) => {
    const { id, avatar, password } = await UserFactory.create()
    const { body } = await supertest(BASE_URL)
      .put(`/users/${id}`)
      .send({
        email: 'o0',
        avatar,
        password,
      }) // logica aplicada em UsersController.ts --> linha 8
      .expect(422)
    console.log({ body })
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('User update password is invalid', async (assert) => {
    const { id, email, avatar } = await UserFactory.create()
    const { body } = await supertest(BASE_URL)
      .put(`/users/${id}`)
      .send({
        email,
        avatar,
        password: 'joaop13223',
      }) // logica aplicada em UsersController.ts --> linha 8
      .expect(422)
    console.log({ body })
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  test('User update avatar is invalid', async (assert) => {
    const { id, email, password } = await UserFactory.create()
    const { body } = await supertest(BASE_URL)
      .put(`/users/${id}`)
      .send({ email, password, avatar: '234' }) // logica aplicada em UsersController.ts --> linha 8
      .expect(422)
    console.log({ body })
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })

  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  }) // Define hooks que são executados antes e depois de cada teste no grupo. Esses hooks iniciam e revertem uma transação global do banco de dados, garantindo que cada teste seja executado em um ambiente isolado.
})
