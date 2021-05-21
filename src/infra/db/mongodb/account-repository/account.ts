import { AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountColletion = MongoHelper.getCollection('accounts')
    const result = await accountColletion.insertOne(accountData) // returns the result of the operation

    const account = result.ops[0] // the result is in the ops array. Since we inserted one, theres only one position

    const { _id, ...accountWithoutId } = account // we define our id to have only "id" and not "_id". So we will remove the _id and insert the new id

    return { ...accountWithoutId, id: _id }
  }
}
