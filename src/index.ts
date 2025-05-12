import dotenv from "dotenv";
import { app } from "@/app";
import { config } from "@/config";
import { dbConnection } from "@/database/dbConnection";

dotenv.config();

const { dbURL, port, databaseName } = config;

(async () => {
  try {
    await dbConnection({ databaseUrl: `${dbURL}/${databaseName}` });
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${port}`)
    );
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
})();
