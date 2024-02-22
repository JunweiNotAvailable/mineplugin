export const config = {
  api: {
    mongodb: process.env.REACT_APP_API_URL_MONGODB as string,
    s3: process.env.REACT_APP_API_URL_S3 as string,
    codeBuild: process.env.REACT_APP_API_URL_CODE_BUILD as string,
  },
  cognito: {
    region: process.env.REACT_APP_COGNITO_REGION,
    userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
    appClientId: process.env.REACT_APP_COGNITO_APP_CLIENT_ID,
  }
};