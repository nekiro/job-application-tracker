export const excludeKeys = (fields, omit) => {
  const result = { ...fields };
  for (const key in fields) {
    if (omit.includes(key)) {
      delete result[key];
    }
  }

  return result;
};

export const formatSuccess = (message) => {
  return { message };
};
