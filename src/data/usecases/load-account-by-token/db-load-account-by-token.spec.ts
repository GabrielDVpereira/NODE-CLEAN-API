import { Decrypter } from '@/data/protocols/criptography/decrypter'
import { AccountModel } from '@/data/usecases/add-account/db-add-account-protocols'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRositoryStub: LoadAccountByTokenRepository

}
const makeSut = (): SutTypes => {
  const loadAccountByTokenRositoryStub = makeLoadAccountByTokenRepository()
  const decrypterStub = makeDecrypterStub()
  const sut = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRositoryStub)

  return {
    sut,
    decrypterStub,
    loadAccountByTokenRositoryStub
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

const makeLoadAccountByTokenRepository = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<AccountModel> {
      return Promise.resolve(makeFakeAccount())
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

const makeFakeAccount = (): AccountModel => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'hashed_password',
  id: 'valid_id'
})
describe('DbLoadAccountByToken', () => {
  test('Should call Decrypter with correct values', async () => {
    const { decrypterStub, sut } = makeSut()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any_token', 'any_role')

    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should return null if Decrypter return null', async () => {
    const { decrypterStub, sut } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.load('any_token', 'any_role')

    expect(response).toBeNull()
  })

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { loadAccountByTokenRositoryStub, sut } = makeSut()
    const laodByTokenSpy = jest.spyOn(loadAccountByTokenRositoryStub, 'loadByToken')
    await sut.load('any_token', 'any_role')

    expect(laodByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })

  test('Should return null if LoadAccountByTokenRepository return null', async () => {
    const { loadAccountByTokenRositoryStub, sut } = makeSut()
    jest.spyOn(loadAccountByTokenRositoryStub, 'loadByToken').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.load('any_token', 'any_role')

    expect(response).toBeNull()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()
    const account = await sut.load('any_token', 'any_role')

    expect(account).toEqual(makeFakeAccount())
  })

  test('Should throw if Decrypter throws', async () => {
    const { decrypterStub, sut } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValue(Promise.reject(new Error()))

    const response = sut.load('any_token', 'any_role')
    await expect(response).rejects.toThrow()
  })

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { loadAccountByTokenRositoryStub, sut } = makeSut()
    jest.spyOn(loadAccountByTokenRositoryStub, 'loadByToken').mockReturnValue(Promise.reject(new Error()))

    const response = sut.load('any_token', 'any_role')
    await expect(response).rejects.toThrow()
  })
})
