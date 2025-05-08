/**
 * Scripts personalizados para el sitio web del Planetario de Madrid
 * Funcionalidades principales:
 * - Navegación móvil
 * - Efectos de scroll
 * - Contador para eventos
 * - Validación de formularios
 */

document.addEventListener('DOMContentLoaded', function () {
    // Variables globales
    const header = document.querySelector('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Función para detectar scroll y aplicar efectos
    function scrollFunction() {
        // Efecto de header al hacer scroll
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }

        // Marcar enlaces de navegación según la sección visible
        let scrollPosition = window.scrollY + 80;

        sections.forEach(section => {
            if (section.offsetTop <= scrollPosition &&
                (section.offsetTop + section.offsetHeight) > scrollPosition) {

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (section.getAttribute('id') === link.getAttribute('href').substring(1)) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Efectos de scroll
    window.addEventListener('scroll', scrollFunction);

    // Navegación smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });

                // Si estamos en móvil, cerrar el menú
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    document.querySelector('.navbar-toggler').click();
                }
            }
        });
    });

    // Contador para próximos eventos
    const countdownElements = document.querySelectorAll('.event-countdown');

    if (countdownElements.length > 0) {
        countdownElements.forEach(element => {
            const targetDate = new Date(element.dataset.date).getTime();

            const updateCountdown = setInterval(function () {
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

    // Validación de formularios
    const forms = document.querySelectorAll('.needs-validation');

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }

            form.classList.add('was-validated');
        }, false);
    });

    // Animación de aparición de elementos al hacer scroll
    const animateOnScroll = function () {
        const elements = document.querySelectorAll('.animate-on-scroll');

        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementPosition < windowHeight - 50) {
                element.classList.add('animated');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Ejecutar una vez al cargar la página

    // Planetas animados
    const createPlanets = function () {
        const heroSection = document.querySelector('.hero');
        if (!heroSection) return;

        // Crear estrellas aleatorias
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDuration = `${Math.random() * 3 + 2}s`;
            star.style.animationDelay = `${Math.random() * 2}s`;

            heroSection.appendChild(star);
        }
    };

    createPlanets();

    // Galería de imágenes (Lightbox)
    const galleryImages = document.querySelectorAll('.gallery-image');

    galleryImages.forEach(image => {
        image.addEventListener('click', function () {
            const lightbox = document.createElement('div');
            lightbox.id = 'lightbox';
            lightbox.classList.add('lightbox');

            const lightboxImg = document.createElement('img');
            lightboxImg.src = this.src;
            lightboxImg.alt = this.alt;

            const closeBtn = document.createElement('span');
            closeBtn.classList.add('lightbox-close');
            closeBtn.innerHTML = '&times;';

            closeBtn.addEventListener('click', function () {
                document.body.removeChild(lightbox);
            });

            lightbox.addEventListener('click', function (e) {
                if (e.target !== lightboxImg) {
                    document.body.removeChild(lightbox);
                }
            });

            lightbox.appendChild(lightboxImg);
            lightbox.appendChild(closeBtn);
            document.body.appendChild(lightbox);
        });
    });

    // Inicializar tooltips de Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});