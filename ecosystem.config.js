module.exports = {
  apps: [
    {
      name: "hireconnect-frontend",
      script: "node_modules/.bin/next",
      args: ["start"],
      cwd: ".",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
}
