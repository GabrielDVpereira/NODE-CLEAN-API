import { AccountModel } from '@/domain/models/account'

export type AddAccountModel = Omit<AccountModel, 'id'>

export interface AddAccount {
  add: (account: AddAccountModel) => Promise<AccountModel> // AccountModel is database related, so we dont use it inside domain
}
