// Basic auth validations
export function validateEmail(email) {
  return email && email.includes("@");
}
