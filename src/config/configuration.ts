/* eslint-disable prettier/prettier */
export default () => ({
  port: process.env.PORT,
  postgres: {
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '123456789**Mm',
    database: 'E-commerce',
  },
  session: {
    secret: "process.env.SESSION_SECRET",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
  uploadPath: process.env.UPLOAD_PATH,
  nodeEnv: process.env.NODE_ENV,
  admin: {
    email: 'admin@test.local',
    password: 'test1234',
  },
});
