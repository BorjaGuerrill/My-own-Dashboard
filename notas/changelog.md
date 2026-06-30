# Changelog
<p>No suelo hacer changelogs, pero para Hackclub me parece que es necesario, y sera una buena costumbre para el futuro</p>

---

I don't use to make changelogs, but for Hackclub i believe it is necesary, and i guess it will be a good habit for the future


## 8/6/2026
- Me estoy enfocando mas en lograr tener HTTPS en mi pagina publica en vez de tratar de tener "workaround" temporales
- Empeze investigando sobre encripcion y PGP (mas que nada por curiosidad)
- Introduccion a HTTPS (la mayoria cosas que ya sabia) [aca](https://www.geeksforgeeks.org/html/explain-working-of-https/)
- Pense que podia "**self encrypt**". Puedo, los browsers no lo reconocen, mejor [conseguir un certificado](https://linuxcapable.com/how-to-secure-apache-with-lets-encrypt-on-debian-linux/) de LetsEncrypt usando Certbot
    1. El tipico sudo apt update, sudo apt upgrade
    2. Al instalar **Certbot** descubri que ya lo tenia, me lo esperaba, a ver si ahora si lo uso bien
    3. Me instalo la integracion de Certbot con **Apache** que usa **Python3**
    4. Instale el certificado con `sudo certbot --apache --agree-tos --non-interactive --no-eff-email --redirect --key-type ecdsa --email webmaster@aristoteles.cl -d aristoteles.cl`
    5. Al certificar si se habia instalado correctamente con `sudo certbot certificates`, note que Certbot ya se habia utilizado para **instalarlo en mi servidor de email (aparentemente ya disfuncional, lo tengo que ver) mail.aristoteles.cl**, pero en cualquier caso el para mi pagina web confirme que existe, aqui esta:

      Certificate Name: aristoteles.cl
      Serial Number: 6b9f0f86cc809c3be9605f77f74b59acafb
      Key Type: ECDSA
      Domains: aristoteles.cl
      Expiry Date: 2026-09-06 23:38:27+00:00 (VALID: 89 days)
      Certificate Path: /etc/letsencrypt/live/aristoteles.cl/fullchain.pem
      Private Key Path: /etc/letsencrypt/live/aristoteles.cl/privkey.pem
    6. Revise puertos abiertos con `sudo lsof -i -P -n`, el puerto 443 (el usado por SSL) esta abierto y funcionando igualmente que el 80 localmente, pero aparentemente, el port-forwarding no esta hecho, lo hare mañana.
### *NOTAS DE FINALIZACION*

Al terminar note que ya no me podia meter a aristoteles.cl, ni por un dispositivo conectado al mismo wifi, ni por alguno conectado a otro. Ademas, al tratar de meterme me redirigia a https://aristoteles.cl. Como ultimo, al tratar de meterme usando el ip local me dejo, y al tratar con https://[ip-local] me dejo, pero me dijo que el certificado era insegruo, pero reconocio que era emitido por **LetsEncrypt** y no self signed como ayer trate.
---
## 10/6/2026

### Descubrimiento continuando con el dia anterior:
La razon (espero) por la cual al meterme a https://[ip-local] me confirma que el certificado es de LetsEncrypt pero me dice que es inseguro es porque el certificado esta atado a cierto dominio, y al meterme por mi ip y no mi dominio el certificado no correspondia.
- Node.JS tiene que correr independientemente para funcionar (aparentemente, no lo he podido probar porque no se puede conectar a mi certificado SSL)
- Buscare formas de hacer que corra con Apache asi puedo usar el mismo certificado y facilito desarrollo futuro.
---
## 11/6/2026
- Correre server.js en el puerto 3000 y con un proxy de apache hare que apache saque la pagina de Node.js
- [Estas](https://www.insightforgeeks.com/configuring-apache-for-nodejs-a-stepbystep-guide-ymj2wvkfon8p) son las instrucciones que segui
---
## 14/6/2026
AL FINNN, no estuve registrando mucho porque no he avanzado en nada tratando de hacer que enviar un mensaje simple se pueda, pero ahora al fin se puede. Con este comando: `curl -X POST http://localhost:3000/api/send-notification   -H "Content-Type: application/json"   -d '{"title":"TITULO AQUI","message":"MENSAJE AQUI"}'`

## 19/6/2026
Hoy me enfoco en hacer un **MongoDB** para guardar la informacion de las subscripciones en vez de guardarlas en una array que se guarda en la memoria temporal, aqui es donde se guarda ahora: `const subscriptions = [];`. 
### Estos dias
Menciono rapidamente que estos dias añadi algunos widgets simples para empezar a darle forma a la pagina. Tambien trabje para que la clave **VAPID** y el codigo del back-end este realmente oculto del publico.