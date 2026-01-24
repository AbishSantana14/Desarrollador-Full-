
const API_URL = 'https://fakestoreapi.com/products';
let todosLosProductos = [];      
let productosActuales = [];    


const productosGrid = document.getElementById('productos-grid');
const contadorTexto = document.getElementById('contador-texto');
const estadisticasDiv = document.getElementById('estadisticas');
const botonesFiltro = document.querySelectorAll('.filtro-btn');

const cargarProductos = async () => {
    try {
        
        productosGrid.innerHTML = `
            <div class="cargando">
                <i class="fas fa-spinner fa-spin"></i> Cargando productos...
            </div>
        `;

        const respuesta = await fetch(API_URL);
        
        if (!respuesta.ok) {
            throw new Error('No se pudo conectar con la API');
        }
        const datos = await respuesta.json();
        todosLosProductos = [...datos];
        productosActuales = [...datos];
        
        // Mostrar productos
        mostrarProductos();
        
        // Configurar filtros
        configurarFiltros();
        
        // Mostrar estadísticas 
        mostrarEstadisticas();
        
        // Actualizar contador
        actualizarContador();
        
    } catch (error) {
        // Mostrar error si algo falla
        productosGrid.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-triangle"></i> 
                Error: ${error.message}
            </div>
        `;
    }
};

// funcion para mostrar productos
const mostrarProductos = () => {
    
    productosGrid.innerHTML = '';
    
    // Si no hay productos, mostrar mensaje
    if (productosActuales.length === 0) {
        productosGrid.innerHTML = `
            <div class="error">
                No hay productos para mostrar
            </div>
        `;
        return;
    }
    
    // Para cada producto crear una tarjeta
    productosActuales.forEach((producto, indice) => {
        
        const { title, price, category, image, description } = producto;
        const { rate, count } = producto.rating;
        
        // Crear elemento div para la tarjeta
        const tarjeta = document.createElement('div');
        tarjeta.className = 'producto-card';
        tarjeta.dataset.indice = indice; 
        
        
        tarjeta.innerHTML = `
            <img src="${image}" alt="${title}" class="producto-img">
            <div class="producto-info">
                <h3 class="producto-titulo">${title}</h3>
                <p class="producto-precio">$${price.toFixed(2)}</p>
                <span class="producto-categoria">${category}</span>
                <div class="producto-rating">
                    <i class="fas fa-star"></i> ${rate}/5 (${count} votos)
                </div>
                <button class="detalle-btn" data-indice="${indice}">
                    <i class="fas fa-chevron-down"></i> Ver detalles
                </button>
            </div>
            <div class="producto-detalles">
                <p class="descripcion">${description}</p>
                <div class="info-extra">
                    <p><strong>Categoría:</strong> ${category}</p>
                    <p><strong>Calificación:</strong> ${rate}/5</p>
                </div>
            </div>
        `;
        
    
        const botonDetalle = tarjeta.querySelector('.detalle-btn');
        botonDetalle.addEventListener('click', () => {
            toggleDetalles(indice);
        });
        
        
        productosGrid.appendChild(tarjeta);
    });
};

//para mostrar y ocultar detalles
const toggleDetalles = (indice) => {
    
    const tarjeta = document.querySelector(`[data-indice="${indice}"]`);
    const boton = tarjeta.querySelector('.detalle-btn');
    
    if (tarjeta.classList.contains('abierto')) {
        tarjeta.classList.remove('abierto');
        boton.innerHTML = '<i class="fas fa-chevron-down"></i> Ver detalles';
    } else {
     
        tarjeta.classList.add('abierto');
        boton.innerHTML = '<i class="fas fa-chevron-up"></i> Ocultar detalles';
    }
};

//  para filtrar productos
const filtrarProductos = (categoria) => {
    
    if (categoria === 'all') {
        productosActuales = [...todosLosProductos]; 
    } else {
       
        productosActuales = todosLosProductos.filter(producto => 
            producto.category.toLowerCase() === categoria.toLowerCase()
        );
    }
    mostrarProductos();
    actualizarContador();
   
    botonesFiltro.forEach(boton => {
        boton.classList.remove('activo');
        if (boton.dataset.categoria === categoria) {
            boton.classList.add('activo');
        }
    });
};

// para configurar los filtros
const configurarFiltros = () => {
    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', () => {
            const categoria = boton.dataset.categoria;
            filtrarProductos(categoria);
        });
    });
};

// para estadísticas
const mostrarEstadisticas = () => {
   
    estadisticasDiv.innerHTML = '';
    const categoriasArray = todosLosProductos.map(p => p.category);
    const categoriasUnicas = new Set(categoriasArray); 
    const mapaProductos = new Map();
    todosLosProductos.forEach(producto => {
        const categoria = producto.category;
       
        if (!mapaProductos.has(categoria)) {
            mapaProductos.set(categoria, []); 
        }
        
        mapaProductos.get(categoria).push(producto.title);
    });
    
    // Mostrar estadísticas 
    const htmlEstadisticas = `<h3><i class="fas fa-chart-bar"></i> Estadísticas</h3>
        <div class="estadistica-item">
            <p><strong>Categorías únicas :</strong> ${categoriasUnicas.size}</p>
            <p>${Array.from(categoriasUnicas).join(', ')}</p>
        </div>
        <div class="estadistica-item">
            <p><strong>Total productos:</strong> ${todosLosProductos.length}</p>
        </div>
        <div class="estadistica-item">
            <p><strong>Productos por categoría :</strong></p>
            <ul>
                ${Array.from(mapaProductos.entries()).map(([categoria, productos]) => 
                    `<li>${categoria}: ${productos.length} productos</li>`
                ).join('')}
            </ul>
        </div>
    `;
    estadisticasDiv.innerHTML = htmlEstadisticas;
    //  mostrar en consola
    console.log('ESTADÍSTICAS ');
    console.log('Categorías únicas:', Array.from(categoriasUnicas));
    console.log('Productos por categoría:', mapaProductos);
};

//para actualizar contador
const actualizarContador = () => {
    contadorTexto.textContent =  `Mostrando ${productosActuales.length} de ${todosLosProductos.length} productos`;};
document.addEventListener('DOMContentLoaded', () => {cargarProductos();});