class InvalidRoleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidRoleError';
  }
}

export default InvalidRoleError;
