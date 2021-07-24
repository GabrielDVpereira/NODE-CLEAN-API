import { makeLoginValidation } from './login-validation-factory'
import { Controller } from '@/presentation/protocols'
import { LoginController } from '@/presentation/controllers/auth/login/login-controller'
import { makeLogControllerDecorator } from '@/main/factories/decoratos/log-controller-decorator-factory'
import { makeDbAuthentication } from '@/main/factories/usecases/account/authentication/db-authentication-factory'

export const makeLoginController = (): Controller => {
  const dbAuthentication = makeDbAuthentication()
  const validationComposite = makeLoginValidation()
  const loginController = new LoginController(dbAuthentication, validationComposite)
  return makeLogControllerDecorator(loginController)
}
