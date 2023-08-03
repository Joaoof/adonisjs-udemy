// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Mail from '@ioc:Adonis/Addons/Mail'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class PasswordsController {
  public async forgotPassword({ request, response }: HttpContextContract) {
    const { email, resetPasswordUrl } = request.only([
      'email',
      'resetPasswordUrl',
    ])
    const user = await User.findByOrFail('email', email)
    await Mail.send((message) => {
      message
        .from('joaodeus400@gmail.com')
        .to(email)
        .subject('Adonisjs: Forgot Password')
        .htmlView(
          '/home/joao/Documentos/adonisjs-udemy/resources/email/views/forgotpassword.edge',
          {
            productName: 'Adonisjs',
            name: user.username,
            resetPasswordUrl,
          },
        )
    })
    return response.noContent()
  }
}
