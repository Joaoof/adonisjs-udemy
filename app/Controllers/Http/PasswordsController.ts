// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Mail from '@ioc:Adonis/Addons/Mail'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { promisify } from 'util'
import { randomBytes } from 'crypto'
import ForgotPasswordValidator from 'App/Validators/ForgotPasswordValidator'
import ResetPasswordValidator from 'App/Validators/ResetPasswordValidator'
import TokenExpiredException from 'App/Exceptions/TokenExpiredException'

export default class PasswordsController {
  public async forgotPassword({ request, response }: HttpContextContract) {
    const { email, resetPasswordUrl } = await request.validate(
      ForgotPasswordValidator,
    )
    const user = await User.findByOrFail('email', email)

    const random = await promisify(randomBytes)(24)
    const token = random.toString('hex')
    await user.related('tokens').updateOrCreate(
      { userId: user.id },
      {
        token,
      },
    )

    const resetPasswordUrlWithToken = `${resetPasswordUrl}?token=${token}`
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
            resetPasswordUrl: resetPasswordUrlWithToken,
          },
        )
    })
    return response.noContent()
  }

  public async resetPassword({ request, response }: HttpContextContract) {
    const { token, password } = await request.validate(ResetPasswordValidator)
    const userByToken = await User.query()
      .whereHas('tokens', (query) => {
        query.where('token', token)
      })
      .preload('tokens')
      .firstOrFail() //  "Retorne os registros da tabela 'User' que possuem relacionamentos com a tabela 'tokens' e que tenham um registro correspondente na tabela 'tokens' onde o campo 'token' seja igual ao valor da variável 'token'".
    const tokenAge = Math.abs(
      userByToken.tokens[0].createdAt.diffNow('hours').hours,
    )
    if (tokenAge > 2) throw new TokenExpiredException()
    console.log(userByToken)
    userByToken.password = password
    await userByToken.save()
    await userByToken.tokens[0].delete()
    return response.noContent()
  }
}
