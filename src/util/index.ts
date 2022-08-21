export const excludeKeys = (fields: Record<string, any>, omit: string[]) => {
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

export const dev = process.env.NODE_ENV !== 'production';

interface AnyObject {
  [name: string]: any;
}

export const deepSetProperties = (obj: AnyObject): AnyObject => {
  const result = {} as AnyObject;

  for (const objectPath in obj) {
    const parts = objectPath.split('.');

    let target = result;
    while (parts.length > 1) {
      const part = parts.shift();
      if (part) {
        target = target[part] = target[part] || {};
      }
    }

    target[parts[0]] = obj[objectPath];
  }

  return result;
};
