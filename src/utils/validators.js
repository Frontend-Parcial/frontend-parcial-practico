import { registerValidationRules } from './registerRules'

export function validateRegister(fieldName, value) {
  const rules = registerValidationRules[fieldName]
  

  if (!rules) return ''

  for (const rule of rules) {
    const pattern = rule.regExp
    
    if (pattern instanceof RegExp) {
      if (!pattern.test(value)) {
        return rule.message;
      }
    } else {
      console.warn(`El campo ${fieldName} tiene una expresión inválida`, pattern);
    }
  }

  return ''
}