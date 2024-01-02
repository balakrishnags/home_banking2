export const ENVDATA = {
    baseUrl: process.env.REACT_APP_BASE_URL,
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY_ID,
    region: process.env.REACT_APP_S3_BUCKET_REGION,
    bucketName: process.env.REACT_APP_AWS_BUCKET,
    environment: process.env.REACT_APP_ENV
}

export const s3BucketConfig = {
    bucketName: process.env.REACT_APP_AWS_BUCKET,
    region: process.env.REACT_APP_S3_BUCKET_REGION,
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY_ID,
};