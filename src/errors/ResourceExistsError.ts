class ResourceExistsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ResourceExistsError';
  }
}

export default ResourceExistsError;
