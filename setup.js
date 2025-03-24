const { exec } = require("child_process");
const path = require("path");

const isWindows = process.platform === "win32";
const backendPath = path.join(__dirname, "backend");
const frontendPath = path.join(__dirname, "frontend");

// Function to run commands
const runCommand = (command, cwd) => {
  return new Promise((resolve, reject) => {
    const process = exec(command, { cwd });

    process.stdout.on("data", (data) => console.log(data));
    process.stderr.on("data", (data) => console.error(data));

    process.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Command failed: ${command}`));
    });
  });
};

// Main function to setup and start the project
const startProject = async () => {
  try {
    console.log("📦 Installing backend dependencies...");
    await runCommand("npm install", backendPath);

    console.log("🚀 Starting backend...");
    const backendCommand = isWindows ? "npm run start" : "npm run start &";
    runCommand(backendCommand, backendPath);

    console.log("📦 Installing frontend dependencies...");
    await runCommand("npm install", frontendPath);

    console.log("🌍 Starting frontend...");
    await runCommand("npm run dev", frontendPath);
    
    console.log("✅ Project started successfully!");
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

startProject();
