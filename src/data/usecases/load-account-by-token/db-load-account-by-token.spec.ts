import { Decrypter } from '../../protocols/criptography/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter

}
const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypterStub()
  const sut = new DbLoadAccountByToken(decrypterStub)

  return {
    sut,
    decrypterStub
  }
}

const makeDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return Promise.resolve('any_value')
    }
  }
  return new DecrypterStub()
}
describe('DbLoadAccountByToken', () => {
  test('Should call Decrypter with correct values', async () => {
    const { decrypterStub, sut } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_token')

    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
})