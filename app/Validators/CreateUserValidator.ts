import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CustomMessages, rules, schema } from '@ioc:Adonis/Core/Validator'

export default class CreateUserValidator {
  // eslint-disable-next-line no-useless-constructor
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({}, [rules.email(), rules.required()]),
    username: schema.string({}, [rules.required()]),
    avatar: schema.string.optional({}),
    password: schema.string({}, [rules.minLength(4), rules.required()]),
  })

  /**
   * Custom messages for validation failures.
   */
  public messages: CustomMessages = {
    'email.required': 'The email field is required.',
    'email.email': 'Please enter a valid email address.',
    'email.unique': 'This email is already in use.',

    'username.required': 'The username field is required.',
    'username.unique': 'This username is already in use.',

    'password.minLength': 'The password must be at least 4 characters long.',

    // Add more custom messages for other rules, if needed
    // 'username.alpha': 'The username must only contain letters.',
    // 'email.maxlength': 'The email must not exceed 255 characters.',
    // ...
  }
}
