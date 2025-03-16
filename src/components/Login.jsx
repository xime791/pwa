import React, { useState, useEffect } from 'react';

const Login = () => {
  const [credentials, setCredentials] = useState({
    correo: '',
    contrasena: '',
  });
  const [error, setError] = useState(null);
  const [notificationPermission, setNotificationPermission] = useState(null);

  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        setNotificationPermission(permission);
      });
    }
  }, []);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Intentando acceder con:', credentials);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Fallo al iniciar sesión');
      }

      const data = await response.json();
      console.log('Acceso exitoso:', data);

      // ✅ Mostrar notificación solo si el usuario ha dado permiso
      if (notificationPermission === "granted") {
        new Notification("Acceso exitoso");
      } else {
        alert("✅ Acceso exitoso");
      }

    } catch (error) {
      console.error('Problema:', error);
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Inicio de Sesión</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} {}
      <input
        type="email"
        name="correo"
        placeholder="Correo electrónico"
        value={credentials.correo}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="contrasena"
        placeholder="Contraseña"
        value={credentials.contrasena}
        onChange={handleChange}
        required
      />
      <button type="submit">Acceder</button>
    </form>
  );
};

export default Login;
