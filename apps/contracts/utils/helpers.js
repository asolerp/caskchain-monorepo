const dotenv = require("dotenv");
const jetpack = require("fs-jetpack");

function convertToEnv(object) {
  let envFile = "";
  for (const key of Object.keys(object)) {
    envFile += `${key}=${object[key]}\n`;
  }
  return envFile;
}

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
  insertInEnvFile,
};
