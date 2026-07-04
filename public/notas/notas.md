# Notas de Comandos

## Puertos

- Comando: `sudo ss -tulpn`
  Descripción: Se utiliza para ver qué aplicaciones están usando qué puertos activamente.


## Networking

- El puerto 3000 está actualmente desactivado en la aplicación de Eero, pero la configuración está preparada y se usará para hacer pruebas.

## Node.js

- Comando: `node [nombre del archivo]`
  Descripción: Se utiliza para ejecutar un archivo de Node.js.

  *Nota adicional*: También se puede usar `npm start` si estás dentro de la carpeta donde está el archivo.

- Express es un framework para Node.js que facilita la creación de aplicaciones web y APIs.

- Generador de claves VAPID

  Comando:

  ```bash
  node -e "const webpush=require('web-push'); console.log(JSON.stringify(webpush.generateVAPIDKeys(),null,2));"
  ```

  Descripción: Genera un nuevo par de claves VAPID (clave pública y clave privada) para utilizar con notificaciones push web.

## Corriendo archivos

- Comando: `node [nombre del archivo]`
  Descripción: Se utiliza para ejecutar un archivo de Node.js.

  *Nota adicional*: También se puede usar `npm start` si estás dentro de la carpeta donde está el archivo.

## Systemctl

- Comando: `journalctl -u <nombre-del-servicio> -b`
  Descripción: Se utiliza para ver los logs completos de una aplicación gestionada por systemd.

## Proyecto de antena

- Usar este tutorial para instalar y configurar Meshtastic en Raspberry Pi:

  https://www.loraitalia.it/wiki/installare-e-configurare-meshtastic-su-raspberry-pi/

  *Nota adicional*: El tutorial cubre la instalación de `meshtasticd` y la configuración inicial de la región LoRa.

## MariaDB
- Se usa para darle los permisos de una DataBase a un usuario especifico:

`GRANT ALL PRIVILEGES ON [YourDataBase].* to 'your_user'@'%' IDENTIFIED BY 'your_password';
flush privileges;`

- se usa para ver las cosas que hay en una tabla 
`SELECT * FROM <nombre de la tabla>;` 
