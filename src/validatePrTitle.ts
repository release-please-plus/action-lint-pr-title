import lint from '@commitlint/lint'
import * as config from '../commitlint.config'

export async function validatePrTitle(prTitle) {
  const result = await lint(prTitle, config.rules)

  if (!result.valid) {
    const errorMessages = result.errors.map(error => error.message)
    throw new Error(errorMessages.join('; '))
  }
}
