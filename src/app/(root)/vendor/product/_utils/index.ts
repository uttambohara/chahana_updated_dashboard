export function validateProductData(data: any) {
  const errors = [];

  // 1. Check for required fields
  const requiredFields = [
    "name",
    "description",
    "sku",
    "salesPrice",
    "category_id",
    "sub_category_id",
    "colors",
    "sizes",
    "quantity",
    "productImgs",
  ]; // Replace with your actual required field names

  for (const field of requiredFields) {
    if (isFalsy(data[field])) {
      errors.push(`${field.toUpperCase()} is not selected!`);
    } else if (data[field]) {
      // Array check
      if (Array.isArray(data[field]) && data[field].length === 0) {
        errors.push(`${field.toUpperCase()} not assigned!`);
      } else if (
        // string check
        typeof data[field] === "string" &&
        data[field].trim().length === 0
      ) {
        errors.push(`${field.toUpperCase()} cannot be an empty string.`);
      }
    }
  }

  return errors;
}

// Helper function to check for falsy values (including undefined and null)
function isFalsy(value: any): boolean {
  return value === undefined || value === null || Boolean(value) === false;
}
