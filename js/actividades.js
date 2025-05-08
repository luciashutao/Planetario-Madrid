/**
 * Funcionalidades específicas para la página de actividades
 * del Planetario de Madrid
 */

document.addEventListener('DOMContentLoaded', function() {
    // Filtrado de actividades
    initActivityFilters();
    
    // Selector de meses
    initMonthSelector();
    
    // Contador para eventos próximos
    initEventCountdowns();
});

/**
 * Inicializa el sistema de filtrado de actividades
 */
function initActivityFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const filterItems = document.querySelectorAll('.filter-item');
    
    if (!filterBtns.length || !filterItems.length) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover clase active de todos los botones
            filterBtns.forEach(btn => btn.classList.remove('active'));
            
            // Añadir clase active al botón clickeado
            this.classList.add('active');
            
            // Obtener filtro seleccionado
            const filter = this.getAttribute('data-filter');
            
            // Mostrar/ocultar elementos según el filtro con animación
            filterItems.forEach(item => {
                // Preparar para animación
                item.style.opacity = '0';
                item.style.transition = 'opacity 0.3s ease';
                
                setTimeout(() => {
                    if (filter === 'all') {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                        }, 50);
                    } else {
                        if (item.classList.contains(filter)) {
                            item.style.display = 'block';
                            setTimeout(() => {
                                item.style.opacity = '1';
                            }, 50);
                        } else {
                            item.style.display = 'none';
                        }
                    }
                }, 300);
            });
        });
    });
}

/**
 * Inicializa el selector de meses en el calendario
 */
function initMonthSelector() {
    const monthLinks = document.querySelectorAll('.month-selector .list-group-item');
    const currentMonthCard = document.querySelector('.month-card');
    
    if (!monthLinks.length || !currentMonthCard) return;
    
    monthLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // En un sitio real, aquí cargaríamos las actividades del mes seleccionado
            // mediante una petición AJAX o cambiando de página
            
            // Actualizar la tarjeta del mes actual (simulación)
            const monthName = this.textContent.trim();
            currentMonthCard.querySelector('h3').textContent = monthName;
            
            // Desplazarse al inicio de la lista de actividades
            document.querySelector('.activities-list').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Aquí se podría añadir código para mostrar un spinner de carga
            // mientras se cargan las nuevas actividades
        });
    });
}

/**
 * Inicializa los contadores para eventos próximos
 */
function initEventCountdowns() {
    const countdownElements = document.querySelectorAll('.event-countdown');
    
    if (!countdownElements.length) return;
    
    countdownElements.forEach(element => {
        const targetDate = new Date(element.dataset.date).getTime();
        
        const updateCountdown = setInterval(function() {
            const now = new Date().getTime();
            const distance = targetDate - now;
            
            if (distance < 0) {
                clearInterval(updateCountdown);
                element.innerHTML = "¡El evento ha comenzado!";
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            
            element.innerHTML = `${days}d ${hours}h ${minutes}m`;
        }, 1000);
    });
}

/**
 * Gestiona la interacción con el formulario de suscripción
 */
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (!email || !isValidEmail(email)) {
            // Mostrar error
            showFormError(emailInput, 'Por favor, introduce un email válido');
            return;
        }
        
        // En un sitio real, aquí enviaríamos los datos a un servidor
        // Simulamos éxito
        showFormSuccess(this, 'Te has suscrito correctamente. ¡Gracias!');
        
        // Resetear formulario
        this.reset();
    });
}

/**
 * Valida un email usando expresión regular
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Muestra mensaje de error en formulario
 */
function showFormError(inputElement, message) {
    // Eliminar mensajes de error previos
    const existingError = inputElement.parentElement.querySelector('.form-error-message');
    if (existingError) existingError.remove();
    
    // Crear y mostrar mensaje de error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error-message text-danger mt-2';
    errorDiv.textContent = message;
    
    inputElement.classList.add('is-invalid');
    inputElement.parentElement.appendChild(errorDiv);
}

/**
 * Muestra mensaje de éxito en formulario
 */
function showFormSuccess(formElement, message) {
    // Eliminar mensajes previos
    const existingMessage = formElement.parentElement.querySelector('.form-success-message');
    if (existingMessage) existingMessage.remove();
    
    // Crear y mostrar mensaje de éxito
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success-message alert alert-success mt-3';
    successDiv.textContent = message;
    
    formElement.parentElement.appendChild(successDiv);
    
    // Eliminar mensaje después de 5 segundos
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}