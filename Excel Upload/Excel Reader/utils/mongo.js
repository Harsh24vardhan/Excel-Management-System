import mongoose from "mongoose";
let mongoConnectionGlobal = null;
async function mongoConnection() {
  if (mongoConnectionGlobal) {
    return mongoConnectionGlobal.connection;
  }

  const { connection } = mongoose;

  connection
    .on("connected", () => {
      console.info("[mongooseConnector][connected]");
    })
    .on("disconnected", () => {
      console.info("[mongooseConnector][disconnected]");
    })
    .on("error", (error) => {
      console.info(
        `[mongooseConnector][error]: ${error.message}, ${connectionString}}`,
        error
      );
    })
    .once("open", () => {
      console.info("[mongooseConnector][open]");
    });

  const mongoConnection = await mongoose.connect(
    "mongodb://localhost/upload_excel_project",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  mongoConnectionGlobal = mongoConnection;
  return mongoConnectionGlobal.connection;
}

export default { mongoConnection };
