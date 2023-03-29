import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

import pm2 from "pm2";

import inquirer from "inquirer";

import chalkAnimation from "chalk-animation";

import jetpack from "fs-jetpack";

import { spawn } from "child_process";

import ora from "ora";

import chalk from "chalk";

import { killPortProcess } from "kill-port-process";

import process from "process";

// solve the issue that pm2 can not recognize the npm command in Windows

const pjson = jetpack.read("package.json", "json");

const spinner = ora();
spinner.spinner = "dots3";
spinner.color = "green";

//////////////////////////////////////////////////////////////////
// ------------------- HELPER FUNCTIONS -----------------------
//////////////////////////////////////////////////////////////////

function convertToEnv(object) {
  let envFile = "";
  for (const key of Object.keys(object)) {
    envFile += `${key}=${object[key]}\n`;
  }
  return envFile;
}

const insertInEnvFile = ({ params }) => {
  let env = {};

  const envFile = jetpack.read(".env");
  const buf = Buffer.from(envFile);
  const parsed = dotenv.parse(buf);

  env = {
    ...params,
  };

  jetpack.file(".env", {
    content: `${convertToEnv({ ...parsed, ...env })}`,
  });
};

function runProcess(config, cb = () => {}) {
  return new Promise((resolve, reject) => {
    pm2.start(config, function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(result);
    });
  });
}

function requireEnv(chainEnv) {
  switch (chainEnv) {
    case "emulator":
      return ".env";
    case "testnet":
      if (process.env.E2E_GITHUB_ACTIONS_JOB) {
        verifySetupTestnetE2E();
        return ".env.testnet.example";
      } else {
        verifySetupTestnet();
        return ".env.testnet";
      }
    default:
      envErr();
  }
}

function stopProcess(name, port) {
  return new Promise((resolve, reject) => {
    pm2.stop(name, function (err, result) {
      if (err) {
        return resolve();
      }
      pm2.delete(name, async function () {
        await killPortProcess(port);
        resolve();
      });
    });
  });
}

//////////////////////////////////////////////////////////////////
// ------------- PROCESS MANAGEMENT ENTRYPOINT -------------------
//////////////////////////////////////////////////////////////////

pm2.connect(false, async function (err) {
  if (err) {
    console.log("PM2 ERROR", err);
    pm2.disconnect();
    process.exit(2);
  }

  pm2.flush();

  spinner.info(`Stopping previously launched processes...${"\n"}`);

  await jetpack.removeAsync("./apps/contracts/build");

  await stopProcess("api", [4000]);
  await stopProcess("web", [3000]);
  await stopProcess("emulator", [8085, 8085]);

  // ------------------------------------------------------------
  // ------------- CHECK FOR CORRECT NODE VERSION ---------------

  const parseVersion = (nodeVersionString) => {
    const majorVersion = nodeVersionString.split(".")[0];
    const majorVersionIntOnly = majorVersion.replace(/[^0-9]/g, "");

    return parseInt(majorVersionIntOnly);
  };

  const processNodeVersion = parseVersion(process.version);
  const engineNodeRequirement = parseVersion(pjson.engines.node);

  if (processNodeVersion < engineNodeRequirement) {
    spinner.warn(
      `This project requires Node version ${chalk.yellow(
        pjson.engines.node
      )} or higher. Please install Node.js and try again.${"\n"}`
    );
    pm2.disconnect();
    return;
  }

  // ------------------------------------------------------------
  // ------------- ENVIRONMENT STARTUP -----------------

  let environment = await inquirer.prompt({
    type: "list",
    name: "selected",
    message: `Where would you like to run the proyect?`,
    default: "local",
    choices: ["local", "polygon testnet"],
  });

  spinner.start("Emulating Ethereum Network");

  if (environment.selected === "local") {
    await runProcess({
      name: "emulator",
      script: "ganache",
      args: "--networkId 4447 --acctKeys ganache-accounts.json",
      wait_ready: true,
    });

    spinner.succeed(chalk.greenBright("Emulator started"));

    spinner.info(
      `Ethereum Emulator is running at: ${chalk.yellow(
        "http://localhost:8545"
      )}`
    );
    spinner.info(
      `View log output: ${chalk.cyanBright("npx pm2 logs emulator")}${"\n"}`
    );

    const accountsKeys = jetpack.read("./ganache-accounts.json");
    const parsedAccountsKeys = JSON.parse(accountsKeys);

    console.log(parsedAccountsKeys);

    const [address, privateKey] = Object.entries(
      parsedAccountsKeys.private_keys
    )[0];

    insertInEnvFile({
      params: {
        PUBLIC_KEY: address,
        PRIVATE_KEY: privateKey,
        NETWORK_ID: 4447,
        TARGET_CHAIN_ID: 1337,
        BLOCKCHAIN_URL: "http://127.0.0.1:8545",
        BLOCKCHAIN_WS_URL: "ws://127.0.0.1:8545",
      },
    });
  } else {
    const envFileMumbai = jetpack.read(".env.mumbai");
    const buf = Buffer.from(envFileMumbai);
    const parsed = dotenv.parse(buf);

    insertInEnvFile({ params: { ...parsed } });
  }

  spinner.start("Deploying contracts to the selected network");

  await runProcess({
    name: `truffle-migrate`,
    cwd: "./apps/contracts",
    script: "truffle",
    args:
      environment.selected === "local"
        ? "migrage --reset"
        : "migrate --network mumbai --reset",
    watch: false,
    wait_ready: true,
    autorestart: false,
  });

  spinner.succeed(chalk.greenBright("Contracts deployed"));

  const checkTime = 1000;

  spinner.start("Creating contracts interfaces");

  const timerId = setInterval(async () => {
    const isExists = await jetpack.existsAsync("./apps/contracts/build");
    if (isExists) {
      clearInterval(timerId);
      spinner.succeed(chalk.greenBright("Contracts created"));

      dotenv.config({
        path: requireEnv(process.env.CHAIN_ENV),
      });

      // spinner.start("Starting API server");

      // await runProcess({
      //   name: `api`,
      //   cwd: "./api",
      //   script: "npm",
      //   args: "run dev:serve",
      //   watch: false,
      //   wait_ready: true,
      // });

      // spinner.succeed(chalk.greenBright("API server started"));

      // spinner.info(
      //   `CaskChain API is running at: ${chalk.yellow("http://localhost:4000")}`
      // );
      // spinner.info(
      //   `View log output: ${chalk.cyanBright(`npx pm2 logs api`)}${"\n"}`
      // );

      // spinner.start("Starting storefront web app");

      // await runProcess({
      //   name: `web`,
      //   cwd: "./web",
      //   script: "npm",
      //   args: "run start:dev",
      //   watch: false,
      //   wait_ready: true,
      //   autorestart: false,
      // });

      // spinner.succeed(chalk.greenBright("Storefront web app started"));

      // spinner.info(
      //   `ChaskChain Web App is running at: ${chalk.yellow(
      //     "http://localhost:3000"
      //   )}`
      // );
      // spinner.info(
      //   `View log output: ${chalk.cyanBright(`npx pm2 logs web`)}${"\n"}`
      // );

      // spinner.start("Runing init Truffle Script");

      // await runProcess({
      //   name: `truffle-script`,
      //   cwd: "./ethereum",
      //   script: "truffle",
      //   args:
      //     environment.selected === "local"
      //       ? "exec scripts/truffle-init.js"
      //       : "exec scripts/truffle-init.js --network mumbai",
      //   watch: false,
      //   wait_ready: true,
      //   autorestart: false,
      // });

      // spinner.succeed(chalk.greenBright("Truffle initializated"));

      //   // ------------------------------------------------------------
      //   // --------------------- DONE -------------------------------

      const rainbow = chalkAnimation.rainbow("CASK CHAIN HAS STARTED");

      setTimeout(async () => {
        rainbow.stop();

        console.log("\n");
        console.log(`${chalk.cyanBright("Visit")}: http://localhost:3000`);
        console.log("\n");

        let logs = await inquirer.prompt({
          type: "confirm",
          name: "confirm",
          message: `Would you like to view the logs for all processes?`,
          default: true,
        });

        if (logs.confirm) {
          console.log("\n");
          const ps = spawn("npx", ["pm2", "logs", "--no-daemon"], {
            shell: true,
            stdio: "inherit",
          });
          ps.stdout?.on("data", (data) => {
            console.log(data.toString().trim());
          });
          process.on("SIGINT", () => {
            process.exit(0);
          }); // CTRL+C
        } else {
          spinner.info(
            `View log output for all processes: ${chalk.cyanBright(
              `npx pm2 logs`
            )}${"\n"}`
          );
        }
        pm2.disconnect();
        spinner.stop();
      }, 3000);
    }
  }, checkTime);
});
