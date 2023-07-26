import Factory from '@ioc:Adonis/Lucid/Factory'
import User from 'App/Models/User'

export const UserFactory = Factory.define(User, ({ faker }) => {
  return {
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    avatar: faker.internet.url(),
  }
}).build()

//  A Factory é uma classe que é usada para criar instâncias de modelos de banco de dados com dados falsos para testes. No código fornecido, a Factory define um usuário com um nome de usuário, e-mail, senha e avatar falsos usando a biblioteca faker. A função build() é usada para criar a instância do modelo com os dados falsos. A Factory é usada em conjunto com o teste unitário para criar um usuário de teste e verificar se a API funciona corretamente.
