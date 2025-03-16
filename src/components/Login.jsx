import React, { useState } from 'react';

const Login = () => {
  const [credentials, setCredentials] = useState({
    correo: '',
    contrasena: '',
  });
  const [error, setError] = useState(null); // Para manejar errores

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
      alert("Acceso exitoso"); // ✅ Se reemplazó el console.log por un alert
    } catch (error) {
      console.error('Problema:', error);
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Inicio de Sesión</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
