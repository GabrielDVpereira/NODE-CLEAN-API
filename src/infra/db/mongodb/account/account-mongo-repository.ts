import { AddAccountRepository } from '../../../../data/protocols/db/add-account-repository'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/update-access-token-respitory'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/usecases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountColletion = await MongoHelper.getCollection('accounts')
    const result = await accountColletion.insertOne(accountData) // returns the result of the operation

    const account = result.ops[0] // the result is in the ops array. Since we inserted one, theres only one position

    return MongoHelper.map(account)
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountColletion = await MongoHelper.getCollection('accounts')
    const account = await accountColletion.findOne({ email })
    if (account) {
      return MongoHelper.map(account)
    }
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountColletion = await MongoHelper.getCollection('accounts')
    await accountColletion.updateOne({
      _id: id
    }, {
      $set: {
        accessToken: token
      }
    })
  }
}