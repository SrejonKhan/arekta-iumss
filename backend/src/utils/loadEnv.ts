import * as fs from "fs";
import { resolve, join } from "path";
import { config as dotenvConfig } from "dotenv";

export const loadEnv = (env: string) => {
  const folder = resolve(__dirname, "../../");
  const envPath = join(folder, `.env.${env}`);
  console.log(envPath);
  // check if the env file exists
  if (!fs.existsSync(envPath)) {
    throw new Error(`${envPath} file does not exist`);
  }
  dotenvConfig({ path: envPath });
  console.log("Loaded env file: ", envPath);
  console.log(process.env);
};
// if called by itself, load the .env file
if (require.main === module) {
  loadEnv(process.env.NODE_ENV || "development");
}

// the command for running this script is:
// ts-node src/utils/loadEnv.ts

export default loadEnv;
