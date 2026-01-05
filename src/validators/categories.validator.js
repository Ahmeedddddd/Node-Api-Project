// filepath: src/validators/categories.validator.js

const NAME_MAX_LENGTH = 100;
const NAME_NO_DIGITS_REGEX = /^[^0-9]*$/;

export function validateCategoryPayload(payload) {
  const details = {};
  const rawName = payload?.name;
  const name = typeof rawName === "string" ? rawName.trim() : "";

  if (!name) {
    details.name = "Name is required.";
  } else {
    if (name.length > NAME_MAX_LENGTH) {
      details.name = `Name must be at most ${NAME_MAX_LENGTH} characters.`;
    } else if (!NAME_NO_DIGITS_REGEX.test(name)) {
      details.name = "Name must not contain digits.";
    }
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
    value: { name },
  };
}
