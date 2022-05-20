export const excludeKeys = (fields: any, omit: string[]) => {
  const result = { ...fields };
  for (const key in fields) {
    if (omit.includes(key)) {
      delete result[key];
    }
  }

  return result;
};

export const formatSuccess = (message: string) => {
  return { message };
};
