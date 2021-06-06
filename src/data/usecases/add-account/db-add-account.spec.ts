import { AccountModel, AddAccountModel, Hasher, AddAccountRepository } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

const makeHasherStub = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new HasherStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new AddAccountRepositoryStub()
}

const makeFakeAccount = (): AccountModel => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'hashed_password',
  id: 'valid_id'
})

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'
})

interface SutTypes {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasherStub()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub)

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const {
      sut,
      hasherStub
    } = makeSut()

    const hasherSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(makeFakeAccountData())
    expect(hasherSpy).toBeCalledWith('valid_password')
  })

  test('Should throw if hasher throws', async () => {
    const {
      sut,
      hasherStub
    } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(Promise.reject(new Error())) // simulate a failure in our hash method
    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow() // expect that the promise that we recieved throws a rejection
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const {
      sut,
      addAccountRepositoryStub
    } = makeSut()

    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(makeFakeAccountData())
    expect(addSpy).toBeCalledWith({ // we pass the user with the hashed password to save to db
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const {
      sut,
      addAccountRepositoryStub
    } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error())) // simulate a failure in our hash method
    const promise = sut.add(makeFakeAccountData())
    await expect(promise).rejects.toThrow() // expect that the promise that we recieved throws a rejection
  })

  test('Should return an account on sucess', async () => {
    const {
      sut
    } = makeSut()
    const account = await sut.add(makeFakeAccountData())
    expect(account).toEqual(makeFakeAccount())
  })
})
