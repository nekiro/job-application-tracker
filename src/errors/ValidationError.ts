class ValidationError extends Error {
  what: any[];

  constructor(what: any) {
    super('');
    this.what = what.details;
    this.name = 'ValidationError';
  }
}

export default ValidationError;
