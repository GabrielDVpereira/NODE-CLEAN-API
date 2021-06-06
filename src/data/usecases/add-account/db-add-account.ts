import { AddAccountRepository } from '../../protocols/db/account/add-account-repository'
import { AccountModel, AddAccount, AddAccountModel, Hasher } from './db-add-account-protocols'

export class DbAddAccount implements AddAccount {
  constructor (private readonly hasher: Hasher, private readonly addAccountRepository: AddAccountRepository) {} // the same as declarating the vars on top of the class and assigning to it in the constructor

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountData.password)
    const account = await this.addAccountRepository.add({ ...accountData, password: hashedPassword })
    return await Promise.resolve(account)
  }
}
