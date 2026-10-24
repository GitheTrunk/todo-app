export function getAuthSecrets() {
  const accessTokenSecret = process.env.JWT_SECRET;
  const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;

  if (!accessTokenSecret || !refreshTokenSecret) {
    throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must both be configured');
  }
  if (accessTokenSecret === refreshTokenSecret) {
    throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be different');
  }

  return { accessTokenSecret, refreshTokenSecret };
}
