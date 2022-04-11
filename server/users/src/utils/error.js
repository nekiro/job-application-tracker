const formatError = (message, code) => {
  return {
    error: message,
    errorCode: code,
  };
};

export default formatError;
