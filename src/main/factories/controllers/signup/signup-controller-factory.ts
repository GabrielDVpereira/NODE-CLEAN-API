import { SignUpController } from '../../../../presentation/controllers/auth/signup/signup-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeSignUpValidation } from './signup-validation-factory'
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory'
import { makeDbAddAccount } from '../../usecases/add-account/db-add-account-factory'
import { makeLogControllerDecorator } from '../../decoratos/log-controller-decorator-factory'

export const makeSignUpController = (): Controller => {
  const dbAddAccount = makeDbAddAccount()
  const validationComposite = makeSignUpValidation()
  const dbAuthentication = makeDbAuthentication()
  const signUpController = new SignUpController(dbAddAccount, validationComposite, dbAuthentication)
  return makeLogControllerDecorator(signUpController) // we use decorator to exteds a controller implementation of handle to use logger functionality
}
