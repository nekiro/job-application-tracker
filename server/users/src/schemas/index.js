const getSchema = async (name) => {
  // this is called from app.use (middleware)
  // so ./ resolves to root directory server/users
  try {
    const { default: schema } = await import(`./${name}`);
    return schema;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export default getSchema;
