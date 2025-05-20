/**
 * Sistema de compra de entradas para Planetario Madrid
 * 
 * Este script reemplaza la funcionalidad actual que muestra alertas al comprar entradas
 * con una simulación de pasarela de pago y confirmación de compra.
 */

// Variables para almacenar la información de la compra
let entradaSeleccionada = '';
let precioEntrada = 0;
let cantidadEntradas = 1;
let emailComprador = '';

/**
 * Función que se ejecuta cuando el usuario selecciona un tipo de entrada y da clic en continuar
 * Esta función reemplaza la alerta actual por la pasarela de pago
 * @param {string} tipoEntrada - El tipo de entrada seleccionada
 * @param {number} precio - El precio de la entrada seleccionada
 */
function procesarCompraEntradas(tipoEntrada, precio) {
    entradaSeleccionada = tipoEntrada;
    precioEntrada = precio;

    // En lugar de mostrar una alerta, mostramos la pasarela de pago
    mostrarPasarelaPago();
}

/**
 * Muestra la pasarela de pago en un modal
 */
function mostrarPasarelaPago() {
    // Obtener información de fecha y hora del elemento seleccionado
    let fechaHoraHTML = '';
    const dateTimeDisplay = document.getElementById('selected-date-time');
    if (dateTimeDisplay) {
        const dateTimeParagraph = dateTimeDisplay.querySelector('p:last-child');
        if (dateTimeParagraph) {
            fechaHoraHTML = dateTimeParagraph.textContent;
        }
    }

    // Obtener resumen de tickets desde el HTML existente
    let ticketsHTML = '';
    const ticketList = document.getElementById('ticket-list');
    let itemsHtml = '';
    let subtotal = precioEntrada * cantidadEntradas;
    let descuento = subtotal * 0.05; // 5% de descuento online
    let iva = (subtotal - descuento) * 0.10; // 10% de IVA
    let total = subtotal - descuento + iva;

    // Intentar extraer valores de la interfaz si están disponibles
    const subtotalElement = document.getElementById('subtotal');
    const discountContainer = document.getElementById('discount-container');
    const discountElement = document.getElementById('discount-amount');
    const taxElement = document.getElementById('tax-amount');
    const totalElement = document.getElementById('total-amount');

    if (subtotalElement) {
        subtotal = parseFloat(subtotalElement.textContent.replace('€', ''));
    }

    if (discountElement && discountContainer && discountContainer.style.display !== 'none') {
        descuento = parseFloat(discountElement.textContent.replace('-', '').replace('€', ''));
    }

    if (taxElement) {
        iva = parseFloat(taxElement.textContent.replace('€', ''));
    }

    if (totalElement) {
        total = parseFloat(totalElement.textContent.replace('€', ''));
    }

    // Si tenemos acceso al ticket-list, usar su HTML interno
    if (ticketList && ticketList.innerHTML && !ticketList.innerHTML.includes('No has seleccionado entradas')) {
        const divEntradas = ticketList.querySelectorAll('div.d-flex');

        // Recorrer todos los divs del ticket-list para extraer la información
        divEntradas.forEach(div => {
            const textoEntrada = div.querySelector('span:first-child').textContent;
            const precioEntrada = div.querySelector('span:last-child').textContent;

            itemsHtml += `
                <div class="d-flex justify-content-between mb-2">
                    <span class="text-white">${textoEntrada}</span>
                    <span class="text-white">${precioEntrada}</span>
                </div>
            `;
        });
    } else {
        // Si no tenemos acceso, usar la entrada seleccionada directamente
        itemsHtml = `
            <div class="d-flex justify-content-between mb-2">
                <span class="text-white">${cantidadEntradas}x ${entradaSeleccionada}</span>
                <span class="text-white">${(cantidadEntradas * precioEntrada).toFixed(2)}€</span>
            </div>
        `;
    }

    // Crear el contenido del modal para la pasarela de pago
    const modalHtml = `
    <div id="modal-pasarela-pago" class="modal fade show" style="display: block; background: rgba(0, 0, 0, 0.9);">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content" style="background-color: #051433; border: 1px solid rgba(255, 255, 255, 0.1);">
                <div class="modal-header" style="background-color: #0078ff;">
                    <div class="d-flex align-items-center">
                        <i class="bi bi-cart me-2 text-white"></i>
                        <h5 class="modal-title text-white mb-0">Resumen de compra</h5>
                    </div>
                    <button type="button" class="btn-close btn-close-white" aria-label="Cerrar" onclick="cerrarModal()"></button>
                </div>
                <div class="modal-body p-4">
                    <div class="row">
                        <div class="col-md-5 mb-4 mb-md-0">
                            <!-- Resumen de compra similar a la imagen 2 -->
                            <div style="background-color: #0b3d91;" class="p-4 rounded h-100">
                                ${fechaHoraHTML ? `
                                    <div class="mb-4">
                                        <p class="text-white-50 mb-1">Fecha y hora:</p>
                                        <p class="text-white mb-0">${fechaHoraHTML}</p>
                                    </div>
                                ` : ''}
                                
                                <div class="mb-4">
                                    <p class="text-white-50 mb-2">Entradas:</p>
                                    ${itemsHtml}
                                </div>
                                
                                <hr class="border-secondary my-4">
                                
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="text-white">Subtotal:</span>
                                    <span class="text-white">${subtotal.toFixed(2)}€</span>
                                </div>
                                
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="text-white">Descuento:</span>
                                    <span class="text-white">-${descuento.toFixed(2)}€</span>
                                </div>
                                
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="text-white">IVA (10%):</span>
                                    <span class="text-white">${iva.toFixed(2)}€</span>
                                </div>
                                
                                <div class="d-flex justify-content-between align-items-center mt-3">
                                    <span class="text-white h5">Total:</span>
                                    <span class="text-white h5">${total.toFixed(2)}€</span>
                                </div>
                                
                                <div class="alert mt-3 mb-0" style="background-color: rgba(13, 202, 240, 0.2); border-color: rgba(13, 202, 240, 0.3);">
                                    <div class="d-flex">
                                        <i class="bi bi-info-circle-fill me-2 fs-5 text-info"></i>
                                        <div>
                                            <p class="mb-0 small text-white">Las entradas online tienen un 5% de descuento respecto a taquilla. Recuerda traer tu identificación si has seleccionado entradas con descuento.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-7">
                            <form id="form-pago" onsubmit="procesarPago(event)">
                                <div class="mb-4 card" style="background-color: #0b3d91; border: none;">
                                    <div class="card-header" style="background-color: #0078ff;">
                                        <h3 class="h5 text-white mb-0"><i class="bi bi-person-fill me-2"></i> Datos personales</h3>
                                    </div>
                                    <div class="card-body p-4">
                                        <div class="mb-3">
                                            <label for="nombre" class="form-label text-white">Nombre completo:</label>
                                            <input type="text" class="form-control" id="nombre" required>
                                        </div>
                                        <div class="mb-3">
                                            <label for="email" class="form-label text-white">Email:</label>
                                            <input type="email" class="form-control" id="email" required>
                                        </div>
                                        <div class="mb-3">
                                            <label for="telefono" class="form-label text-white">Teléfono:</label>
                                            <input type="tel" class="form-control" id="telefono" required>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="mb-4 card" style="background-color: #0b3d91; border: none;">
                                    <div class="card-header" style="background-color: #0078ff;">
                                        <h3 class="h5 text-white mb-0"><i class="bi bi-credit-card-fill me-2"></i> Datos de tarjeta</h3>
                                    </div>
                                    <div class="card-body p-4">
                                        <div class="mb-3">
                                            <label for="num-tarjeta" class="form-label text-white">Número de tarjeta:</label>
                                            <input type="text" class="form-control" id="num-tarjeta" placeholder="XXXX XXXX XXXX XXXX" required>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6 mb-3">
                                                <label for="fecha-exp" class="form-label text-white">Fecha de exp. (MM/AA):</label>
                                                <input type="text" class="form-control" id="fecha-exp" placeholder="MM/AA" required>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <label for="cvv" class="form-label text-white">CVV:</label>
                                                <input type="text" class="form-control" id="cvv" placeholder="XXX" required maxlength="3">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="d-flex justify-content-end gap-2">
                                    <button type="button" class="btn btn-outline-light" onclick="cerrarModal()">Cancelar</button>
                                    <button type="submit" class="btn btn-primary">Realizar pago</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    // Agregar el modal al cuerpo del documento
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer);

    // Mostrar el modal
    const modal = document.getElementById('modal-pasarela-pago');
    modal.style.display = 'block';
}

/**
 * Actualiza el total a pagar cuando se cambia la cantidad de entradas
 */
function actualizarTotal() {
    cantidadEntradas = document.getElementById('cantidad').value;
    const total = precioEntrada * cantidadEntradas;
    document.getElementById('precio-total').textContent = total.toFixed(2);
}

/**
 * Cierra el modal de la pasarela de pago
 */
function cerrarModal() {
    const modal = document.getElementById('modal-pasarela-pago');
    if (modal) {
        modal.style.display = 'none';
        document.body.removeChild(modal.parentNode);
    }
}

/**
 * Procesa el pago cuando se envía el formulario
 * @param {Event} event - El evento del formulario
 */
function procesarPago(event) {
    event.preventDefault();

    // Obtener el email para enviar los tickets
    emailComprador = document.getElementById('email').value;

    // Simular una espera de procesamiento (2 segundos)
    mostrarProcesando();

    setTimeout(() => {
        // Cerrar el modal de procesando
        cerrarModal();

        // Mostrar la confirmación de compra
        mostrarConfirmacionCompra();
    }, 2000);
}

/**
 * Muestra un mensaje de "procesando pago"
 */
function mostrarProcesando() {
    // Cerrar el modal de la pasarela
    cerrarModal();

    // Crear el contenido del modal de procesando
    const modalHtml = `
    <div id="modal-pasarela-pago" class="modal fade show" style="display: block; background: rgba(0, 0, 0, 0.9);">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content" style="background-color: #051433; border: 1px solid rgba(255, 255, 255, 0.1);">
                <div class="modal-body p-5 text-center">
                    <h5 class="text-white mb-4">Procesando su pago</h5>
                    <div class="spinner-border text-primary mb-4" role="status" style="width: 3rem; height: 3rem;">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                    <p class="text-white-50">Por favor, espere un momento...</p>
                </div>
            </div>
        </div>
    </div>
    `;

    // Agregar el modal al cuerpo del documento
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer);

    // Mostrar el modal
    const modal = document.getElementById('modal-pasarela-pago');
    modal.style.display = 'block';
}

/**
 * Muestra el mensaje de confirmación de compra
 */
function mostrarConfirmacionCompra() {
    // Crear el contenido del modal de confirmación
    const modalHtml = `
    <div id="modal-pasarela-pago" class="modal fade show" style="display: block; background: rgba(0, 0, 0, 0.9);">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content" style="background-color: #051433; border: 1px solid rgba(255, 255, 255, 0.1);">
                <div class="modal-header" style="background-color: #0078ff;">
                    <h5 class="modal-title text-white">Compra realizada con éxito</h5>
                    <button type="button" class="btn-close btn-close-white" aria-label="Cerrar" onclick="cerrarModal()"></button>
                </div>
                <div class="modal-body p-4 text-center">
                    <div class="text-success mb-4">
                        <i class="bi bi-check-circle-fill" style="font-size: 4rem;"></i>
                    </div>
                    <h2 class="h4 text-white mb-3">¡Gracias por tu compra!</h2>
                    <p class="text-white-50">Recibirás los tickets en el email:</p>
                    <p class="text-white mb-4"><strong>${emailComprador}</strong></p>
                    
                    <div class="card" style="background-color: #0b3d91; border: none;">
                        <div class="card-body">
                            <h3 class="h6 text-white mb-3">Detalles de la compra:</h3>
                            <p class="text-white-50 mb-2">${entradaSeleccionada}</p>
                            <p class="text-white-50 mb-2">Cantidad: ${cantidadEntradas}</p>
                            <p class="text-white mb-0">Total pagado: <strong>${(precioEntrada * cantidadEntradas).toFixed(2)} €</strong></p>
                        </div>
                    </div>
                    
                    <button type="button" class="btn btn-primary mt-4" onclick="cerrarModal()">Aceptar</button>
                </div>
            </div>
        </div>
    </div>
    `;

    // Agregar el modal al cuerpo del documento
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer);

    // Mostrar el modal
    const modal = document.getElementById('modal-pasarela-pago');
    modal.style.display = 'block';
}

/**
 * Verifica si Bootstrap Icons ya está incluido y lo añade si es necesario
 */
function agregarEstilos() {
    // Verificar si ya se ha incluido Bootstrap Icons
    if (!document.querySelector('link[href*="bootstrap-icons"]')) {
        const bootstrapIcons = document.createElement('link');
        bootstrapIcons.rel = 'stylesheet';
        bootstrapIcons.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css';
        document.head.appendChild(bootstrapIcons);
    }
}

// Inicializar los estilos cuando se carga la página
document.addEventListener('DOMContentLoaded', agregarEstilos);

// Exportar las funciones para que puedan ser utilizadas desde HTML
window.procesarCompraEntradas = procesarCompraEntradas;
window.cerrarModal = cerrarModal;
window.actualizarTotal = actualizarTotal;
window.procesarPago = procesarPago;