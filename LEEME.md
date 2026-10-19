# VIP Room de Kikoxx (con servidor)

## Probarlo en tu ordenador
1. Instala Node.js (versión 18 o más): https://nodejs.org
2. En esta carpeta ejecuta:
   - Windows (PowerShell):  `$env:ADMIN_KEY="pon-aqui-tu-clave"; node server.js`
   - Mac / Linux:           `ADMIN_KEY=pon-aqui-tu-clave node server.js`
3. Abre http://localhost:3000

La clave ADMIN_KEY la eliges tú (mínimo 8 caracteres). Sin ella no se puede crear ningún VIP.

## Subirlo a internet (Render, gratis)
1. Sube esta carpeta a un repositorio de GitHub.
2. En https://render.com: New > Web Service > elige tu repositorio.
3. Runtime: Node · Build Command: (vacío) · Start Command: `node server.js`
4. En Environment añade `ADMIN_KEY` con tu clave secreta.
5. Cuando termine te da un enlace tipo https://tu-app.onrender.com. Ese es tu enlace.

Aviso: en el plan gratis de Render el disco se borra al reiniciar o redesplegar y la app se duerme si nadie entra
(tarda ~50 s en despertar). Se pierden las salas VIP y los historiales. Para que se guarden de forma permanente
añade un Disco (Disk) de pago, móntalo en /data y pon la variable `DATA_DIR=/data`.

## VIPs ya creados
La página principal (`/`) es la de dados normal, igual para todo el mundo. Las salas VIP solo aparecen al meter el código en ⭐ SALA VIP:
- **Kikoxx** -> `VIP-KK9X-4M7R`
- **RojitoJuega** -> `VIP-RJ7K-4MXP`
- **kevinsitoo_oficial** -> `VIP-KV5N-8H2W`

Vienen con su foto y se vuelven a crear solos cada vez que arranca el servidor (así no se pierden en Render gratis).
Si borras alguno desde la administración y reinicias, vuelve a aparecer.

## Cómo se usa
- Página de dados: `/` (normal para todos; arriba a la derecha el botón ⭐ SALA VIP).
- Crear VIPs: `/admin.html` -> entras con tu ADMIN_KEY -> nombre + foto -> te da un código `VIP-XXXX-XXXX`.
  Se lo pasas a esa persona. Al meterlo en ⭐ SALA VIP ve los mismos dados, pero con su foto junto al título y de fondo.
- Ver historial en directo: `/ver.html`. Se mete el código `ID` de 10 letras y números (por ejemplo `voSDwj7EMk`) que sale en la página de dados
  (o se usa el botón «Copiar enlace» / el enlace «Verificar»).
- Las tiradas las genera el servidor, no el navegador, así que el historial no se puede falsear.

## Código de seguridad (firma)
Junto al ID sale una firma de 8 caracteres con el candado 🔒. La calcula el servidor con una clave secreta
(se guarda en `secret.key`, o pon tu propia clave en la variable `SIGN_SECRET`). Quien verifique puede escribir
el ID y la firma juntos (`voSDwj7EMk 7FK2QMXA`); si la firma no coincide con la del servidor, la página avisa.

## Novedades
- **Contacto** (botón ✉ abajo a la derecha): quien visite la página elige Problema técnico, Fraude o Solicitar VIP y deja su Discord/TikTok.
  Los mensajes solo los ves tú, en `/admin.html` -> «Mensajes recibidos» (se actualizan solos cada 30 s).
- **Anuncio en directo**: en `/admin.html` escribes un mensaje y aparece arriba, al instante, a todos los que tengan la página abierta.
- **Streamers VIP**: tabla en la página principal con todos los VIPs. Pone 🔴 EN VIVO mientras tengan abierta la página con su código VIP.
- **Mi fondo**: en el selector de tema, «📷 Mi fondo» deja subir cualquier imagen como fondo (se guarda solo en el navegador de cada persona).
- **Sonido de dados** sintetizado en el navegador (no se copia el audio de ninguna otra web).
- Los mensajes y anuncios se guardan en `messages.json` y `news.json` (carpeta `DATA_DIR`).

## Cambios de la última versión
- **Panel de admin dentro de tu sala VIP (Kikoxx):** al entrar con tu código VIP aparece «👑 Panel de admin». Pide tu `ADMIN_KEY`
  (solo se recuerda mientras la pestaña esté abierta). Desde ahí: mensaje a todos (sale arriba, dentro del recuadro de los dados,
  con «ADMIN» en amarillo), mensajes recibidos y estado de los streamers. `/admin.html` queda solo para crear y borrar VIPs.
- **Streamers y TikTok:** Rojito Juega está vinculado a https://www.tiktok.com/@roojitojuega. Sale 🔴 EN VIVO si tiene la página abierta
  con su código VIP, o si el servidor detecta su directo en TikTok (se comprueba cada 45 s). Al pulsar su fila se abre su directo en TikTok.
  La detección de TikTok es un intento "a mejor esfuerzo": TikTok puede bloquearla o cambiar su página sin avisar. Si falla, en el panel de admin
  puedes forzar «🔴 En vivo» / «⚫ Off» / «Auto». Para vincular a otro VIP, ponle su TikTok al crearlo en `/admin.html`.
- **Sonido de dados:** la página usa `public/sounds/roll.mp3` si existe (pon el tuyo, propio o libre de derechos). Si no, genera uno.

## Última tanda
- Logo **Brainrot Dice España** (con bandera) arriba. La tabla de **Streamers VIP** va a la izquierda de los dados (en el móvil queda debajo).
- Cuando hablas desde el panel de admin suena un "ding" agradable en las pantallas de los que tienen la página abierta
  (se respeta el botón de sonido de cada persona; el navegador solo deja sonar si la persona ya tocó la página).
- Kikoxx vinculado a https://www.tiktok.com/@user1.11123 (y Rojito Juega a @roojitojuega). El servidor prueba primero la API
  de TikTok y luego la página del directo. Si falla, fuerza el estado en tu panel de admin (Auto / En vivo / Off).
- Sonido al tirar: pon un `public/sounds/roll.mp3` propio o libre de derechos para que suene idéntico a lo que quieras.

## Sorteo de códigos (canjear)
- En tu panel de admin: «🎁 Sorteo de códigos» -> pones cuántos (1-50) y un premio opcional -> «Generar códigos».
- Cada código tiene su botón «📢 Enviar al chat» (sale como mensaje de ADMIN con sonido) y «Copiar». También «Copiar todos».
- Los visitantes tienen un botón redondo 🎁: escriben el código y **su usuario de Discord o TikTok**. Gana quien lo canjee primero
  (la hora la pone el servidor, al milisegundo). Cada código solo se puede canjear una vez.
- En el panel ves, por cada código: libre, o ✅ nº de orden, usuario, hora exacta y una marca 🌐 de su conexión (las mismas 6 letras = mismo dispositivo/red).
- Cada usuario solo puede ganar un código por sorteo (así nadie se lleva todos). «📢 Anunciar ganadores» publica la lista en el chat.
- Se guarda en `codes.json`.

## Colores de cada sala VIP
Cada sala usa los colores de la foto de su dueño en los bordes, botones, brillos y tarjetas: Kikoxx morado/azul, Rojito Juega rojo,
kevinsitoo_oficial verde (el gorro) y azul (el fondo). Cuando creas un VIP nuevo en `/admin.html`, la página saca sola el color
dominante de su foto y monta el tema con él.
Streamers: el servidor mira TikTok cada 20 s (mirar cada segundo haría que TikTok bloquee el servidor). Cuando cambia el estado,
se actualiza al instante en todas las pantallas.
