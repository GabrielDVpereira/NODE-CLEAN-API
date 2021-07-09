
import { AccountModel } from '../models/account'

export interface LoadAccountByToken {
  load: (accessToken: string, role?: string) => Promise<AccountModel> // AccountModel is database related, so we dont use it inside domain
}
