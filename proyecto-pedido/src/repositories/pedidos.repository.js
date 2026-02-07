class PedidosRepository {
    #pedidos;
    #nextId;
    
    constructor() {
        this.#pedidos = [];  
        this.#nextId = 1;    
    }

    getAll() {
        return this.#pedidos;
    }

    getById(id) {
        return this.#pedidos.find(pedido => pedido.id === id);
    }

    create(producto, cantidad) {
        // Regla 1 Todo pedido nuevo empieza como pendiente
        const nuevoPedido = {
            id: this.#nextId++,
            producto: producto,
            cantidad: cantidad,
            estado: "pendiente" 
        };
        
        this.#pedidos.push(nuevoPedido);
        return nuevoPedido;
    }

    update(id, data) {
        const pedido = this.getById(id);
        
        if (!pedido) {
            return null;  
        }
        
        // Regla 2: Solo actualiza si está pendiente
        if (pedido.estado !== "pendiente") {

            return false; 
        }
        
        // Actualizar datos
        if (data.producto) pedido.producto = data.producto;
        if (data.cantidad) pedido.cantidad = data.cantidad;
        if (data.estado) pedido.estado = data.estado;
        
        return pedido;
    }

    delete(id) {
        const index = this.#pedidos.findIndex(pedido => pedido.id === id);
        
        if (index === -1) {
            return null; 
        }
        
        const pedido = this.#pedidos[index];
        
        // Regla  3: Solo elimina si está pendiente
        if (pedido.estado !== "pendiente") {
            return false;  
        }
        
        this.#pedidos.splice(index, 1);
        return true;
    }
}

module.exports = { PedidosRepository };