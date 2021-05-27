import { SignUpController } from '../..//presentation/controllers/signup/signup'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { Controller } from '../../presentation/protocols'
import { LoggerControllerDecorator } from '../decorators/log'
import { makeSignUpValidation } from './signup-validation'

export const makeSignUpController = (): Controller => {
  const salt = 12
  const bcryptAdater = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdater, accountMongoRepository)
  const validationComposite = makeSignUpValidation()
  const signUpController = new SignUpController(dbAddAccount, validationComposite)
  const logErrorRepository = new LogMongoRepository()
  return new LoggerControllerDecorator(signUpController, logErrorRepository) // we use decorator to exteds a controller implementation of handle to use logger functionality
}
