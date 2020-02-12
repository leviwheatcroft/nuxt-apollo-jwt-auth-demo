// tokens are signed / verified (encrypted / decrypted) on the Token GraphQl
// type

// for the demo these are set to very brief expiries so you can see the
// expiry behaviour in real time. production settings are subjective, but
// 30 minutes for accessToken and 1 week for refreshToken might be appropriate
const JWT_ACCESS_TOKEN_EXPIRY = process.env.JWT_ACCESS_TOKEN_EXPIRY
const JWT_REFRESH_TOKEN_EXPIRY = process.env.JWT_REFRESH_TOKEN_EXPIRY

function getAccessToken (user) {
  return {
    userId: user._id,
    expiresAt: Date.now() + parseInt(JWT_ACCESS_TOKEN_EXPIRY)
  }
}
function getRefreshToken (user) {
  return {
    userId: user._id,
    expiresAt: Date.now() + parseInt(JWT_REFRESH_TOKEN_EXPIRY)
  }
}
function getTokens (user) {
  return {
    accessToken: getAccessToken(user),
    refreshToken: getRefreshToken(user)
  }
}

module.exports = {
  getAccessToken,
  getRefreshToken,
  getTokens
}
