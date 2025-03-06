import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import keys from './keys.json';
import { BrowserRouter } from 'react-router-dom';

// Registrar el Service Worker y gestionar la suscripción a notificaciones push
navigator.serviceWorker.register('./sw.js', { type: 'module' })
  .then(registro => {
    console.log("Service Worker registrado");
    // Verificar si se ha concedido permiso para notificaciones
    if (Notification.permission === 'denied' || Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        // Si se concede permiso, suscribir al usuario
        if (permission === 'granted') {
          registro.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: keys.publicKey
          })
          .then(res => res.toJSON())
          .then(async json => { // json tiene la suscripción
            console.log("Suscripción exitosa:", json);
            // Almacenar la suscripción en localStorage para usarla en el registro
            localStorage.setItem('subscription', JSON.stringify(json));
          });
        }
      });
    }
  })
  .catch(error => console.error('Error al registrar el Service Worker:', error));

// Configuración de IndexedDB
let db = window.indexedDB.open('database');
db.onupgradeneeded = event => {
  let result = event.target.result;
  result.createObjectStore('libros', { autoIncrement: true });
};

// Renderizar la aplicación
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
