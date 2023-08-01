import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequest from 'App/Exceptions/BadRequestException'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import UpdateValidator from 'App/Validators/UpdateValidator'

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
    const userPayload = await request.validate(CreateUserValidator) // validação da criação do usuario, logica aplicada pelo validator (CreateUserValidator.ts), que serve em users.spec.ts linha 73

    console.log(userPayload)

    const userByEmail = await User.findBy('email', userPayload.email) // Procura no banco de dados se já existe um usuário com o mesmo e-mail fornecido na requisição.

    const userByUsername = await User.findBy('username', userPayload.username) // procura no db se já existe algum usuário com o mesmo username

    if (userByEmail) {
      throw new BadRequest('email already in use', 409) // Se o e-mail já estiver em uso, lança uma exceção BadRequestException com uma mensagem de erro e o código 409 (Conflict).
    }

    if (userByUsername) {
      throw new BadRequest('username already in use', 409) // Se o e-mail já estiver em uso, lança uma exceção BadRequestException com uma mensagem de erro e o código 409 (Conflict).
    }

    const user = await User.create(userPayload) // Se o e-mail não estiver em uso, cria um novo usuário no banco de dados com os dados fornecidos na requisição.

    return response.created({
      user,
    }) // Retorna uma resposta HTTP com o código 201 (Created) e o objeto do usuário criado.
  }

  public async show({ params }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    return user
  }

  public async update({ request, response }: HttpContextContract) {
    const { id, email, password, username } = await request.validate(
      UpdateValidator,
    )

    const user = await User.findOrFail(id)

    user.merge({ email, password, username })

    await user.save()

    return response.ok({ message: 'OK' })
  }
}
