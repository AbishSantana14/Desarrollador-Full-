const { PedidosRepository } = require('../repositories/pedidos.repository');

const repo = new PedidosRepository();

function getAll(req, res) {
    return res.json(repo.getAll());
}

function getById(req, res) {
    const id = Number(req.params.id);
    const pedido = repo.getById(id);

    if (!pedido) {
        return res.status(404).json( "error: Pedido no encontrado" );
    }

    return res.json(pedido);
}

function create(req, res) {
    const { producto, cantidad } = req.body;

    // Validar producto
    if (!producto || typeof producto !== 'string') {
        return res.status(400).json("error: Producto inválido" );
    }

    // Regla 4: Validar cantidad > 0
    const cantidadNumber = Number(cantidad);
    if (cantidadNumber <= 0) {
        return res.status(400).json("error: Cantidad debe ser mayor a 0");
    }

    const nuevo = repo.create(producto, cantidadNumber);
    return res.status(201).json(nuevo);
}

function update(req, res) {
    const id = Number(req.params.id);
    
    // Primero verificar que existe
    const pedidoExistente = repo.getById(id);
    if (!pedidoExistente) {
        return res.status(404).json(" error: Pedido no encontrado" );
    }
    
    // Regla 5: Solo actualiza si está "pendiente"
    if (pedidoExistente.estado !== "pendiente") {
        return res.status(400).json(
           " error: No se puede modificar un pedido"  + pedidoExistente.estado 
        );
    }
    
    // Validar el estado si se quiere cambiar
    if (req.body.estado && !["pendiente", "confirmado", "cancelado"].includes(req.body.estado)) {
        return res.status(400).json({ error: 'Estado inválido' });
    }
    
    // Validar cantidad si se quiere cambiar
    if (req.body.cantidad && req.body.cantidad <= 0) {
        return res.status(400).json("error: Cantidad inválida");
    }
    
    const actualizado = repo.update(id, req.body);
    
    if (actualizado === false) {
        return res.status(400).json("error: No se puede actualizar");
    }
    
    if (!actualizado) {
        return res.status(404).json( "error: No encontrado");
    }

    return res.json(actualizado);
}

function remove(req, res) {
    const id = Number(req.params.id);
    
    // Primero verificar que existe
    const pedido = repo.getById(id);
    if (!pedido) {
        return res.status(404).json("error: Pedido no encontrado");
    }
    
    // Regla 6: Solo elimina si está pendiente
    if (pedido.estado !== "pendiente") {
        return res.status(400).json("error: No se puede eliminar un pedido"  + pedido.estado );
    }
    
    const eliminado = repo.delete(id);
    
    if (eliminado === false) {
        return res.status(400).json("error: No se puede eliminar");
    }
    
    if (!eliminado) {
        return res.status(404).json(" error: No encontrado");
    }

    return res.status(204).send();
}

module.exports = { getAll, getById, create, update, remove };