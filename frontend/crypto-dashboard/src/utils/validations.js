// utils/validations.js
export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validatePassword(password) {
  // Min 6 chars, al menos 1 letra y 1 número
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
  return regex.test(password);
}

export function validateName(name) {
  const regex = /^[a-zA-Z0-9_]{3,20}$/;
  return regex.test(name);
}
