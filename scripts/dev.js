const { spawn } = require("node:child_process");

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

const commands = [
  { name: "server", args: ["run", "dev:server"] },
  { name: "client", args: ["run", "dev:client"] },
];

const children = commands.map(({ name, args }) => {
  const child = spawn(`${npmCommand} ${args.join(" ")}`, {
    cwd: process.cwd(),
    env: process.env,
    shell: true,
    stdio: "inherit",
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      console.log(`${name} stopped with signal ${signal}`);
      return;
    }

    if (code !== 0) {
      console.error(`${name} exited with code ${code}`);
      shutdown(code);
    }
  });

  return child;
});

let shuttingDown = false;

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  children.forEach((child) => {
    if (!child.killed) {
      child.kill();
    }
  });

  process.exit(code);
}

process.on("SIGINT", () => shutdown());
process.on("SIGTERM", () => shutdown());
