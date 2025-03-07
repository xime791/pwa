import React, { useState } from 'react';

const Register = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        contrasena: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const insertIndexedDB = (data) => {
        let request = indexedDB.open("database", 1);

        request.onupgradeneeded = event => {
            let db = event.target.result;
            if (!db.objectStoreNames.contains("libros")) {
                db.createObjectStore("libros", { autoIncrement: true });
            }
        };

        request.onsuccess = event => {
            let db = event.target.result;
            let transaction = db.transaction("libros", "readwrite");
            let store = transaction.objectStore("libros");

            let resultado = store.add(data);
            resultado.onsuccess = () => {
                console.log("Usuario guardado en IndexedDB (sin conexión):", data);
            };
            resultado.onerror = event2 => {
                console.error("Error al insertar en IndexedDB:", event2.target.error);
            };
        };

        request.onerror = event => {
            console.error("Error al abrir IndexedDB:", event.target.error);
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Datos de registro:', formData);

        // Se recupera la suscripción guardada en localStorage
        const subscription = localStorage.getItem('subscription')
            ? JSON.parse(localStorage.getItem('subscription'))
            : null;

        const userData = { ...formData, subscription }; // Agregar la suscripción al usuario

        try {
            const response = await fetch('/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                console.log('Usuario creado en MongoDB');
            } else {
                console.error('Error al registrar el usuario');
            }
        } catch (error) {
            console.error('No hay conexión a internet. Guardando en IndexedDB.');
            insertIndexedDB(userData);

            if ('serviceWorker' in navigator && 'SyncManager' in window) {
                navigator.serviceWorker.ready.then(sw => {
                    sw.sync.register("syncUsers");
                });
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Crear cuenta</h2>
            <input
                type="text"
                name="nombre"
                placeholder="Nombre completo"
                value={formData.nombre}
                onChange={handleChange}
                required
            />
            <input
                type="email"
                name="correo"
                placeholder="Correo electrónico"
                value={formData.correo}
                onChange={handleChange}
                required
            />
            <input
                type="password"
                name="contrasena"
                placeholder="Contraseña"
                value={formData.contrasena}
                onChange={handleChange}
                required
            />
            <button type="submit">Crear cuenta</button>
        </form>
    );
};

export default Register;
