const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Datos para probar 
let clientes = [
    {id: 0, nombre: "Juan Pérez", telefono: "6142165051"},
    {id: 1, nombre: "María García", telefono: "6421404693"}
];

// Ver todos los clientes
app.get('/clientes', (req, res) => {
    res.json({
        success: true,
        message: "Lista de clientes",
        total: clientes.length,
        data: clientes
    });
});

// POST para crear nuevo cliente
app.post('/clientes', (req, res) => {
    const nuevoCliente = {
        id: clientes.length, 
        nombre: req.body.nombre,
        telefono: req.body.telefono
    };
    
    clientes.push(nuevoCliente);
    
    res.status(201).json({
        success: true,
        message: "Cliente creado",
        data: nuevoCliente
    });
});

//  PUT actualizar cliente 
app.put('/clientes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    
    if (id >= clientes.length) {
        return res.status(404).json({
            success: false,
            message: "Cliente no encontrado"
        });
    }
    
    // Actualizar 
    clientes[id] = {
        id: id, 
        nombre: req.body.nombre,
        telefono: req.body.telefono
    };
    
    res.json({
        success: true,
        message: "Cliente actualizado",
        data: clientes[id]
    });
});

// DELETE eliminar cliente
app.delete('/clientes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    if (id >= clientes.length) {
        return res.status(404).json({
            success: false,
            message: "Cliente no encontrado"
        });
    }
    
    const eliminado = clientes.splice(id, 1);
    
    res.json({
        success: true,
        message: "Cliente eliminado",
        data: eliminado[0]
    });
});


app.get('/', (req, res) => {
    res.json({
        AvanceProyecto: "Ferro-Red ",
        autor: "Abish Santana",
       
    });
});

app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
});