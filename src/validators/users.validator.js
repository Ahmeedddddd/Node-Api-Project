// filepath: src/validators/users.validator.js

const FIRSTNAME_MAX_LENGTH = 100;
const LASTNAME_MAX_LENGTH = 100;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_NO_DIGITS_REGEX = /^[^0-9]*$/;

export function validateUserPayload(payload) {
  const details = {};

  // Validate firstName
  const rawFirstName = payload?.firstName;
  const firstName = typeof rawFirstName === "string" ? rawFirstName.trim() : "";

  if (!firstName) {
    details.firstName = "First name is required.";
  } else if (firstName.length > FIRSTNAME_MAX_LENGTH) {
    details.firstName = `First name must be at most ${FIRSTNAME_MAX_LENGTH} characters.`;
  } else if (!NAME_NO_DIGITS_REGEX.test(firstName)) {
    details.firstName = "First name must not contain digits.";
  }

  // Validate lastName
  const rawLastName = payload?.lastName;
  const lastName = typeof rawLastName === "string" ? rawLastName.trim() : "";

  if (!lastName) {
    details.lastName = "Last name is required.";
  } else if (lastName.length > LASTNAME_MAX_LENGTH) {
    details.lastName = `Last name must be at most ${LASTNAME_MAX_LENGTH} characters.`;
  } else if (!NAME_NO_DIGITS_REGEX.test(lastName)) {
    details.lastName = "Last name must not contain digits.";
  }

  // Validate email
  const rawEmail = payload?.email;
  const email = typeof rawEmail === "string" ? rawEmail.trim() : "";

  if (!email) {
    details.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(email)) {
    details.email = "Email must be a valid email address.";
  }

  if (Object.keys(details).length > 0) {
    return {
      ok: false,
      error: "ValidationError",
      details,
    };
  }

  return {
    ok: true,
    value: { firstName, lastName, email },
  };
}
