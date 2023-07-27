import Database from '@ioc:Adonis/Lucid/Database' // Importa o módulo Database do Adonis.js para interagir com o banco de dados
import { UserFactory } from 'Database/factories' // importa a classe UserFactory do módulo Database/factories para criar usuários de teste
import test from 'japa' // importa a biblioteca Japa para escrever testes unitários
import supertest from 'supertest' //  importa a biblioteca supertest para fazer requisições HTTP durante os testes.

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
    assert.equal(body.user.avatar, userPayload.avatar)
    assert.notExists(body.user.password, 'Password defined')
  }) // Realiza várias asserções para verificar se o objeto do usuário retornado na resposta possui as propriedades esperadas e se a senha não está presente.

  test('it should return 409 when email is already in use', async (assert) => {
    // Define um teste dentro do grupo "User" que verifica se a API retorna o código 409 (Conflict) quando o e-mail já está em uso.
    const { email } = await UserFactory.create() // API SENDO FEITA PELA FACTORIES. Cria um usuário de teste utilizando a classe UserFactory e armazena o e-mail gerado na variável email
    const { body } = await supertest(BASE_URL)
      .post('/users')
      .send({
        email,
        username: 'teste',
        password: 'teste',
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

  test.only('it should return 409 when username is already in use', async (assert) => {
    const { username } = await UserFactory.create()
    const { body } = await supertest(BASE_URL)
      .post('/users')
      .send({
        email: 'teste@teste.com',
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

  group.beforeEach(async () => {
    await Database.beginGlobalTransaction()
  })

  group.afterEach(async () => {
    await Database.rollbackGlobalTransaction()
  }) // Define hooks que são executados antes e depois de cada teste no grupo. Esses hooks iniciam e revertem uma transação global do banco de dados, garantindo que cada teste seja executado em um ambiente isolado.
})
