export const config = {
  api: {
    s3: process.env.REACT_APP_API_URL_S3,
    codeBuild: process.env.REACT_APP_API_URL_CODE_BUILD,
  },
  cognito: {
    region: process.env.REACT_APP_COGNITO_REGION,
    userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
    appClientId: process.env.REACT_APP_COGNITO_APP_CLIENT_ID,
  }
};