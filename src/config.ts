export const config = {
  // common base configurations for the application
  base: {
    baseUrl: "/api/v1",
  },
  // database configuration for mongodb
  database: {
    port: process.env.PORT || 3000,
    databaseName: process.env.DB_NAME || "test",
    timeOut: Number(process.env.DB_TIMEOUT) || 20000,
    dbURL: process.env.DB_URL || "mongodb://localhost:27017/test",
  },
  // jwt token configuration for authentication
  jwtToken: {
    jwtSecret: process.env.JWT_SECRET_KEY || "secret",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
    jwtRefreshSecret: process.env.JWT_REFRESH_KEY || "secret",
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
};
