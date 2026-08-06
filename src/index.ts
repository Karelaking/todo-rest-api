import  {app}  from "./app.ts";
import { config } from "./config.ts";
import { dbConnection } from "./database/dbConnection.ts";


const { database } = config;

(async () => {
  try {
    await dbConnection({
      databaseUrl: `${database.dbURL}/${database.databaseName}`,
    });
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${database.port}`)
    ).timeout = config.database.timeOut as number;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
})();
