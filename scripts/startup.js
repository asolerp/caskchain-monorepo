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

  const envFile = jetpack.read(".env.base");
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

  await stopProcess("api", [4000]);
  await stopProcess("web", [3000]);

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

  if (environment.selected === "local") {
    let emulator = await inquirer.prompt({
      type: "list",
      name: "selected",
      message: `Do you need to run the emulator?`,
      default: "Yes",
      choices: ["Yes", "No"],
    });

    if (emulator.selected === "Yes") {
      spinner.start("Emulating Ethereum Network");
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
    }

    const envFileGanache = jetpack.read(".env.ganache");
    const buf = Buffer.from(envFileGanache);
    const parsed = dotenv.parse(buf);

    insertInEnvFile({ params: { ...parsed } });
  } else {
    const envFileMumbai = jetpack.read(".env.mumbai");
    const buf = Buffer.from(envFileMumbai);
    const parsed = dotenv.parse(buf);

    insertInEnvFile({ params: { ...parsed } });
  }

  let deployment = await inquirer.prompt({
    type: "list",
    name: "selected",
    message: `Do you want to deploy contracts?`,
    default: "Yes",
    choices: ["Yes", "No"],
  });

  if (deployment.selected === "Yes") {
    await jetpack.removeAsync("./apps/contracts/build");
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
  } else {
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
});
