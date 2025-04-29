const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3443; // Puerto definido directamente
const host = '0.0.0.0'; // Escuchar en todas las interfaces

// --- Este bloque inicial no se usaba y tenía errores, se elimina ---
// const server = https.createServer((req, res)=> {
//       rest.statusCode = 200; // Typo: res
//       rest.setHeader = ('Content-Type', 'text/plain'); // Uso incorrecto
//       rest.end('Hola desde Node.js desde la maquina!\n'); // Typo: res
// });
// --------------------------------------------------------------------

// Configuración del puerto (opcional si ya definiste la variable port)
// app.set('port', port); // Puedes mantenerlo o usar la variable 'port' directamente

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Datos de ejemplo
const horarios = [
  { hora: "09:00", estado: "reservada" },
  { hora: "10:00", estado: "disponible" },
  { hora: "11:00", estado: "reservada" },
  { hora: "12:00", estado: "disponible" }
];

// Rutas
app.get('/api/calendario', (req, res) => {
  res.status(200).json({ horarios });
});

app.post('/api/reserva', (req, res) => {
  const { nombre, email, telefono, motivo } = req.body;

  if (!nombre || !email || !telefono || !motivo) {
    return res.status(400).json({
      mensaje: "Faltan datos. Todos los campos son obligatorios.",
      estado: "400"
    });
  }

  const reservaHecha = { nombre, email, telefono, motivo };
  console.log("Datos de reserva recibidos:", reservaHecha);

  res.status(200).json({
    mensaje: "Reserva realizada con éxito",
    estado: "200",
    reserva: reservaHecha
  });
});

// Opciones para el servidor HTTPS (los archivos deben existir)
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
};

// Crear el servidor HTTPS usando las opciones y la app Express
const sslServer = https.createServer(sslOptions, app);

// Iniciar el servidor HTTPS escuchando en el host y puerto correctos
sslServer.listen(port, host, () => {
  // Usar las variables 'host' y 'port' directamente en el log
  console.log(`Servidor HTTPS iniciado en https://${host}:${port}`);
  console.log(`Accesible (si la red/firewall lo permiten) por ej: https://<IP_DE_LA_VM>:${port}`);
  console.log(`O si usas NAT+PortForwarding: https://localhost:<PUERTO_ANFITRION>`);
});

// --- El app.listen() comentado estaba bien comentado, ya que usamos sslServer.listen ---
// app.listen(app.get('port'), () => {
// console.log(`Servidor iniciado en http://localhost:${app.get('port')}`);
// });
// ---------------------------------------------------------------------------------------
