const dotenv = require("dotenv");
const jetpack = require("fs-jetpack");
const fs = require("fs");

function convertToEnv(object) {
  let envFile = "";
  for (const key of Object.keys(object)) {
    envFile += `${key}=${object[key]}\n`;
  }
  return envFile;
}

const convertEnvToVercel = (envFilePath, vercelFilePath) => {
  // Cargar el archivo .env
  const envConfig = dotenv.parse(fs.readFileSync(envFilePath));

  // Preparar la estructura de vercel.json
  const vercelConfig = {
    env: envConfig,
  };

  // Escribir la configuración en el archivo vercel.json
  fs.writeFileSync(vercelFilePath, JSON.stringify(vercelConfig, null, 2));
};

const insertInEnvFile = ({ params, route }) => {
  let env = {};

  const envFile = jetpack.read(route);

  const buf = Buffer.from(envFile);
  const parsed = dotenv.parse(buf);

  env = {
    ...params,
  };

  jetpack.file(route, {
    content: `${convertToEnv({ ...parsed, ...env })}`,
  });
};

module.exports = {
  convertEnvToVercel,
  insertInEnvFile,
};
