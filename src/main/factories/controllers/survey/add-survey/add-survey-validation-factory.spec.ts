
import { Validation } from '@/presentation/protocols/validation'
import { ValidationComposite, RequiredFieldValidation } from '@/validation/validators'
import { makeAddSurveyValidation } from './add-survey-validation-factory'

jest.mock('@/validation/validators/validation-composite') // we mock this path, so when anyone calls this, will get a mocked result

describe('AddSurveyValidation factory', () => {
  test('Should call validation composite with all validations', () => {
    makeAddSurveyValidation()
    const validations: Validation[] = []

    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
