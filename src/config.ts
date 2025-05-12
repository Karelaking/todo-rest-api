export const config = {
  baseUrl: "/api/v1",
  port: process.env.PORT || 3000,
  databaseName: process.env.DB_NAME || "test",
  jwtSecret: process.env.JWT_SECRET_KEY || "secret",
  jwtRefreshSecret: process.env.JWT_REFRESH_KEY || "secret",
  dbURL: process.env.DB_URL || "mongodb://localhost:27017/test",
};
