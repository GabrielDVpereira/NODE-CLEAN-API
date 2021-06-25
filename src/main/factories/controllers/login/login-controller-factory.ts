import { makeLoginValidation } from './login-validation-factory'
import { Controller } from '../../../../presentation/protocols'
import { LoginController } from '../../../../presentation/controllers/auth/login/login-controller'
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory'
import { makeLogControllerDecorator } from '../../decoratos/log-controller-decorator-factory'

export const makeLoginController = (): Controller => {
  const dbAuthentication = makeDbAuthentication()
  const validationComposite = makeLoginValidation()
  const loginController = new LoginController(dbAuthentication, validationComposite)
  return makeLogControllerDecorator(loginController)
}
