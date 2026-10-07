// Configuración de PM2 para el servidor (Google Cloud).
// Levanta los tres servicios del monorepo. Instalar PM2 con: npm i -g pm2
module.exports = {
  apps: [
    {
      name: "itm-backend",
      cwd: "./backend",
      script: "npm",
      args: "run start:prod",
      env: { NODE_ENV: "production" }
    },
    {
      // Sirve en el puerto 3000 (definido en su script "start": next start -p 3000)
      name: "itm-public",
      cwd: "./frontend-public",
      script: "npm",
      args: "run start",
      env: { NODE_ENV: "production" }
    },
    {
      // Sirve en el puerto 3001 (definido en su script "start": next start -p 3001)
      name: "itm-manager",
      cwd: "./frontend-manager",
      script: "npm",
      args: "run start",
      env: { NODE_ENV: "production" }
    }
  ]
};
