import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountColletion = await MongoHelper.getCollection('accounts')
    const result = await accountColletion.insertOne(accountData) // returns the result of the operation

    const account = result.ops[0] // the result is in the ops array. Since we inserted one, theres only one position

    return MongoHelper.map(account)
  }
}
