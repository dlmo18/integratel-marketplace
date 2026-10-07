#!/usr/bin/env bash
# Preparación del servidor (Google Cloud, Debian/Ubuntu) para desplegar
# Ecommerce detrás de un Apache2 que YA tiene otras webs.
#
# Es idempotente: se puede correr varias veces. NO modifica los VirtualHost
# existentes; solo agrega el de este proyecto.
#
# Uso:
#   sudo bash deploy/setup-server.sh
set -euo pipefail

DEPLOY_PATH="${DEPLOY_PATH:-/opt/ecommerce}"
CONF_SRC="$DEPLOY_PATH/deploy/apache/ecommerce.conf"
CONF_DST="/etc/apache2/sites-available/ecommerce.conf"

echo "==> 1. Node.js 20 y herramientas"
if ! command -v node >/dev/null 2>&1 || [ "$(node -v | cut -d. -f1 | tr -d v)" -lt 20 ]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
apt-get install -y rsync git

echo "==> 2. PM2 (gestor de procesos Node)"
npm i -g pm2 >/dev/null 2>&1 || true

echo "==> 3. Apache2 y módulos de proxy (no reinstala si ya existe)"
apt-get install -y apache2
a2enmod proxy proxy_http headers rewrite >/dev/null

echo "==> 4. Carpeta de despliegue"
mkdir -p "$DEPLOY_PATH"

echo "==> 5. VirtualHost del proyecto (sin tocar otros sites)"
if [ -f "$CONF_SRC" ]; then
  cp "$CONF_SRC" "$CONF_DST"
  a2ensite ecommerce >/dev/null
  if apache2ctl configtest; then
    systemctl reload apache2
    echo "    VirtualHost habilitado y Apache recargado."
  else
    echo "    ERROR en configtest. Revisa $CONF_DST antes de recargar."
    exit 1
  fi
else
  echo "    Aún no existe $CONF_SRC (sincroniza el código primero con el deploy)."
fi

echo "==> Listo. Sites activos:"
apache2ctl -S 2>/dev/null | grep -i "port 80" || true
echo "Recuerda: ajustar el ServerName en $CONF_DST y configurar HTTPS con certbot."
