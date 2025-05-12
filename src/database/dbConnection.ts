import mongoose from "mongoose";

export async function dbConnection({ databaseUrl }: { databaseUrl: string }) {
  try {
    const dbconnection = await mongoose.connect(databaseUrl);
    console.log(`Database connected to ${dbconnection.connection.host}`);
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}
