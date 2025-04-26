const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const app = express();


// Configuración de la aplicación

app.set('port', 3443);


// Middlewares

app.use(express.json());

app.use(express.urlencoded({ extended: false }));


// Datos de ejemplo (en una base de datos real, se almacenarían aquí los datos)

const horarios = [

  { hora: "09:00", estado: "reservada" },

  { hora: "10:00", estado: "disponible" },

  { hora: "11:00", estado: "reservada" },

  { hora: "12:00", estado: "disponible" }

];


// Rutas


// Ruta para obtener el calendario de horas disponibles y reservadas

app.get('/api/calendario', (req, res) => {

  res.status(200).json({ horarios });

});


app.post('/api/reserva', (req, res) => {
  const { nombre, email, telefono, motivo } = req.body;

  // Validación simple de los datos recibidos
  if (!nombre || !email || !telefono || !motivo) {
    return res.status(400).json({
      mensaje: "Faltan datos. Todos los campos son obligatorios.",
      estado: "400"
    });
  }

  // Simulación de guardado
  const reservaHecha = { // Creamos un objeto con los datos recibidos
      nombre: nombre,
      email: email,
      telefono: telefono,
      motivo: motivo
  };

  console.log("Datos de reserva recibidos:", reservaHecha); // Opcional: para ver en consola

  // Devolvemos un mensaje y también los datos de la reserva
  res.status(200).json({
    mensaje: "Reserva realizada con éxito",
    estado: "200",
    reserva: reservaHecha // Añadimos los datos aquí
  });
});


// Iniciar el servidor HTTP

//app.listen(app.get('port'), () => {

//  console.log(`Servidor iniciado en http://localhost:${app.get('port')}`);

//}); 

const sslServer = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))

  },
  app
);

sslServer.listen(app.get('port'),()=> console.log(`Servidor iniciado en http://localhost:${app.get('port')}`))
