/**
 * Funcionalidades específicas para la página de compra de entradas
 * del Planetario de Madrid
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar selectores de cantidad
    initQuantitySelectors();
    
    // Inicializar actualizaciones del resumen de compra
    initPurchaseSummary();
    
    // Manejador para el botón de continuar
    initContinueButton();
    
    // Manejador para códigos promocionales
    initPromoCode();
    
    // Manejador para checkboxes de descuento
    initDiscountCheckboxes();
    
    // Manejador para cambios de fecha y hora
    initDateTimeSelectors();
});

/**
 * Inicializa los selectores de cantidad para las entradas
 */
function initQuantitySelectors() {
    const minusButtons = document.querySelectorAll('.quantity-btn.minus');
    const plusButtons = document.querySelectorAll('.quantity-btn.plus');
    const quantityInputs = document.querySelectorAll('.ticket-quantity');
    
    // Manejador para botones de disminuir cantidad
    minusButtons.forEach(button => {
        button.addEventListener('click', function() {
            const ticketType = this.getAttribute('data-ticket-type');
            const input = document.querySelector(`input[data-ticket-type="${ticketType}"]`);
            
            if (input.value > 0) {
                input.value = parseInt(input.value) - 1;
                // Disparar evento de cambio para actualizar resumen
                input.dispatchEvent(new Event('change'));
            }
        });
    });
    
    // Manejador para botones de aumentar cantidad
    plusButtons.forEach(button => {
        button.addEventListener('click', function() {
            const ticketType = this.getAttribute('data-ticket-type');
            const input = document.querySelector(`input[data-ticket-type="${ticketType}"]`);
            
            if (parseInt(input.value) < parseInt(input.getAttribute('max'))) {
                input.value = parseInt(input.value) + 1;
                // Disparar evento de cambio para actualizar resumen
                input.dispatchEvent(new Event('change'));
            }
        });
    });
    
    // Manejador para inputs de cantidad
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            updatePurchaseSummary();
            checkContinueButton();
        });
    });
}

/**
 * Inicializa la actualización del resumen de compra
 */
function initPurchaseSummary() {
    // Llamar al inicio para establecer valores por defecto
    updatePurchaseSummary();
}

/**
 * Actualiza el resumen de compra basado en las selecciones
 */
function updatePurchaseSummary() {
    const ticketList = document.getElementById('ticket-list');
    const subtotalElement = document.getElementById('subtotal');
    const taxAmountElement = document.getElementById('tax-amount');
    const totalAmountElement = document.getElementById('total-amount');
    const discountContainer = document.getElementById('discount-container');
    const discountAmountElement = document.getElementById('discount-amount');
    
    const quantityInputs = document.querySelectorAll('.ticket-quantity');
    
    let subtotal = 0;
    let hasTickets = false;
    let ticketListHTML = '';
    
    // Calcular subtotal y crear lista de entradas
    quantityInputs.forEach(input => {
        const quantity = parseInt(input.value);
        const price = parseFloat(input.getAttribute('data-price'));
        const ticketType = input.getAttribute('data-ticket-type');
        
        if (quantity > 0) {
            hasTickets = true;
            
            // Añadir a subtotal
            subtotal += quantity * price;
            
            // Preparar nombre para mostrar
            let ticketName = '';
            switch(ticketType) {
                case 'adult':
                    ticketName = 'Entrada General';
                    break;
                case 'reduced':
                    ticketName = 'Entrada Reducida';
                    break;
                case 'child':
                    ticketName = 'Entrada Infantil';
                    break;
                case 'infant':
                    ticketName = 'Menores de 5 años';
                    break;
            }
            
            // Añadir a HTML
            ticketListHTML += `
                <div class="d-flex justify-content-between mb-2">
                    <span class="text-white">${quantity}x ${ticketName}</span>
                    <span class="text-white">${(quantity * price).toFixed(2)}€</span>
                </div>
            `;
        }
    });
    
    // Calcular descuentos
    let discount = 0;
    const familyDiscountCheckbox = document.getElementById('discount-family');
    const disabilityDiscountCheckbox = document.getElementById('discount-disability');
    
    if (familyDiscountCheckbox.checked) {
        discount += subtotal * 0.1; // 10% discount
    }
    
    if (disabilityDiscountCheckbox.checked) {
        discount += subtotal * 0.5; // 50% discount
    }
    
    // Aplicar descuento online (5%)
    const onlineDiscount = subtotal * 0.05;
    discount += onlineDiscount;
    
    // Mostrar u ocultar sección de descuentos
    if (discount > 0) {
        discountContainer.style.display = 'flex';
        discountAmountElement.textContent = `-${discount.toFixed(2)}€`;
    } else {
        discountContainer.style.display = 'none';
    }
    
    // Calcular impuestos y total
    const subtotalWithDiscount = subtotal - discount;
    const taxAmount = subtotalWithDiscount * 0.10; // 10% IVA
    const total = subtotalWithDiscount + taxAmount;
    
    // Actualizar HTML
    if (hasTickets) {
        ticketList.innerHTML = ticketListHTML;
    } else {
        ticketList.innerHTML = '<p class="text-white text-center">No has seleccionado entradas</p>';
    }
    
    subtotalElement.textContent = `${subtotal.toFixed(2)}€`;
    taxAmountElement.textContent = `${taxAmount.toFixed(2)}€`;
    totalAmountElement.textContent = `${total.toFixed(2)}€`;
}

/**
 * Inicializa el botón de continuar
 */
function initContinueButton() {
    const continueButton = document.getElementById('continue-btn');
    
    continueButton.addEventListener('click', function() {
        // En un sitio real, aquí guardaríamos los datos y 
        // redirigiriamos a la siguiente página de datos personales
        alert('¡Continuando con el proceso de compra! En un sitio real, pasarías a la página de datos personales.');
    });
    
    // Verificar estado inicial
    checkContinueButton();
}

/**
 * Verifica si se debe activar el botón de continuar
 */
function checkContinueButton() {
    const continueButton = document.getElementById('continue-btn');
    const dateInput = document.getElementById('visit-date');
    const timeSelect = document.getElementById('time-slot');
    const quantityInputs = document.querySelectorAll('.ticket-quantity');
    
    let hasDate = dateInput.value !== '';
    let hasTime = timeSelect.value !== '';
    let hasTickets = false;
    
    // Verificar si hay al menos una entrada seleccionada
    quantityInputs.forEach(input => {
        if (parseInt(input.value) > 0) {
            hasTickets = true;
        }
    });
    
    // Activar/desactivar botón
    if (hasDate && hasTime && hasTickets) {
        continueButton.removeAttribute('disabled');
    } else {
        continueButton.setAttribute('disabled', 'disabled');
    }
}

/**
 * Inicializa el campo de código promocional
 */
function initPromoCode() {
    const promoInput = document.getElementById('promo-code');
    const applyButton = document.getElementById('apply-promo');
    
    applyButton.addEventListener('click', function() {
        const promoCode = promoInput.value.trim();
        
        if (promoCode === '') {
            alert('Por favor, introduce un código promocional.');
            return;
        }
        
        // Lista de códigos válidos (en un sitio real, esto se verificaría con el servidor)
        const validCodes = ['ESPACIO25', 'VERANO2025', 'PLANETARIO10'];
        
        if (validCodes.includes(promoCode.toUpperCase())) {
            alert('¡Código promocional aplicado correctamente! Descuento del 10% adicional.');
            // Aquí se aplicaría el descuento y se actualizaría el resumen
            // Para esta demo, simplemente mostramos un mensaje
        } else {
            alert('El código promocional introducido no es válido o ha expirado.');
        }
    });
}

/**
 * Inicializa los checkboxes de descuento
 */
function initDiscountCheckboxes() {
    const discountCheckboxes = document.querySelectorAll('#discount-family, #discount-disability');
    
    discountCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updatePurchaseSummary();
        });
    });
}

/**
 * Inicializa los selectores de fecha y hora
 */
function initDateTimeSelectors() {
    const dateInput = document.getElementById('visit-date');
    const timeSelect = document.getElementById('time-slot');
    const dateTimeDisplay = document.getElementById('selected-date-time');
    
    // Establecer fecha mínima como mañana
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
    
    // Manejadores de eventos
    dateInput.addEventListener('change', function() {
        updateDateTimeDisplay();
        checkContinueButton();
    });
    
    timeSelect.addEventListener('change', function() {
        updateDateTimeDisplay();
        checkContinueButton();
    });
    
    function updateDateTimeDisplay() {
        const selectedDate = dateInput.value;
        const selectedTime = timeSelect.value;
        
        if (selectedDate && selectedTime) {
            // Formatear fecha para mostrar
            const dateObj = new Date(selectedDate);
            const formattedDate = dateObj.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            // Formatear horario para mostrar
            const timeText = timeSelect.options[timeSelect.selectedIndex].text;
            
            // Actualizar el display
            dateTimeDisplay.innerHTML = `
                <p class="text-white-50 mb-1">Fecha y hora:</p>
                <p class="text-white mb-0">${formattedDate}, ${timeText}</p>
            `;
        } else {
            dateTimeDisplay.innerHTML = `
                <p class="text-white-50 mb-1">Fecha y hora:</p>
                <p class="text-white mb-0">Selecciona una fecha y hora</p>
            `;
        }
    }
}