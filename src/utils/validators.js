export function validateField(field, input, rules) {

  const fieldRules = rules[field];

  for (const rule of fieldRules) {
    const {  format, message } = rule;


    if (format && !format.test(input)) {
      return message;
    }
  }

  return null;
}