import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import User from 'App/Models/User'

export default class UsersController {
  public async store({ request, response }: HttpContextContract) {
    const userPayload = request.only(['email', 'username', 'password', 'avatar']) // Extrai os dados do usuário da requisição HTTP, incluindo o e-mail, nome de usuário, senha e avatar.
    const userByEmail = await User.findBy('email', userPayload.email) // Procura no banco de dados se já existe um usuário com o mesmo e-mail fornecido na requisição.
    const userByUsername = await User.findBy('username', userPayload.username)

    if (userByEmail) {
      throw new BadRequestException('email already in use', 409) // Se o e-mail já estiver em uso, lança uma exceção BadRequestException com uma mensagem de erro e o código 409 (Conflict).
    }

    if (userByUsername) {
      throw new BadRequestException('username already in use', 409) // Se o e-mail já estiver em uso, lança uma exceção BadRequestException com uma mensagem de erro e o código 409 (Conflict).
    }

    const user = await User.create(userPayload) // Se o e-mail não estiver em uso, cria um novo usuário no banco de dados com os dados fornecidos na requisição.
    return response.created({
      user,
    }) // Retorna uma resposta HTTP com o código 201 (Created) e o objeto do usuário criado.
  }
}
