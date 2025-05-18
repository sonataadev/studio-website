document.addEventListener("DOMContentLoaded", () => {
    // Aplicar animaciones iniciales inmediatamente y asegurar que la navegación sea visible
    animateOnScroll();
    initNavAnimations(); // Asegurar que los elementos de navegación sean visibles al cargar
    
    // Loader animation
    const loader = document.querySelector('.loader');
    const progress = document.querySelector('.progress');
    
    // Inicio de la carga
    let loadingStartTime = new Date().getTime();
    
    // Precarga de recursos críticos
    const criticalResources = [
        'css/style.css',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    ];
    
    // Función para precargar recursos
    function preloadResources(resources) {
        return Promise.all(
            resources.map(url => {
                return new Promise((resolve, reject) => {
                    const extension = url.split('.').pop();
                    let element;
                    
                    if (extension === 'css') {
                        element = document.createElement('link');
                        element.rel = 'stylesheet';
                        element.href = url;
                    } else if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) {
                        element = new Image();
                        element.src = url;
                    }
                    
                    element.onload = resolve;
                    element.onerror = reject;
                    
                    if (extension === 'css') {
                        document.head.appendChild(element);
                    }
                });
            })
        );
    }
    
    // Simular carga con progreso real
    let width = 0;
    const interval = setInterval(() => {
        width += Math.floor(Math.random() * 8) + 1;
        if (width > 100) width = 100;
        progress.style.width = width + '%';
        
        if (width === 100) {
            clearInterval(interval);
            
            // Asegurar tiempo mínimo de carga para mejor experiencia de usuario
            const loadingEndTime = new Date().getTime();
            const loadingTime = loadingEndTime - loadingStartTime;
            const minLoadingTime = 1000; // 1 segundo mínimo
            
            const waitTime = Math.max(0, minLoadingTime - loadingTime);
            
            setTimeout(() => {
                // Precargar recursos críticos antes de ocultar el loader
                preloadResources(criticalResources).then(() => {
                    loader.style.opacity = 0;
                    setTimeout(() => {
                        loader.style.display = 'none';                // Iniciar animaciones después de la carga
                        animateOnScroll();
                        initFloatingElements();
                        initNavAnimations(); // Asegurarnos de llamar a initNavAnimations aquí también
                        
                        // Iniciar otras funcionalidades si existen
                        if (typeof initPortfolioFilter === 'function') {
                            initPortfolioFilter();
                        }
                    }, 500);
                }).catch(error => {
                    console.warn('Algunos recursos no se cargaron correctamente, pero continuamos con la carga del sitio.');
                    loader.style.opacity = 0;
                    setTimeout(() => {
                        loader.style.display = 'none';
                        animateOnScroll();
                        initFloatingElements();
                    }, 500);
                });
            }, waitTime);
        }
    }, 150);
    
    // Cursor personalizado
    const cursor = document.querySelector('.cursor');
    
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        document.addEventListener('mousedown', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(0.7)';
        });
        
        document.addEventListener('mouseup', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    }
    
    // Header scroll effect
    const header = document.querySelector('header');
    
    // Optimización de rendimiento para animaciones
    function throttle(callback, delay = 100) {
        let isThrottled = false;
        
        return function(...args) {
            if (isThrottled) return;
            
            isThrottled = true;
            callback.apply(this, args);
            
            setTimeout(() => {
                isThrottled = false;
            }, delay);
        }
    }
    
    const optimizedScrollHandler = throttle(() => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, 50);
    
    window.addEventListener('scroll', optimizedScrollHandler);
      // Menu toggle para móvil
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
            
            // Animar las barras del menú
            const bars = menuToggle.querySelectorAll('.bar');
            bars[0].classList.toggle('rotate-down');
            bars[1].classList.toggle('fade-out');
            bars[2].classList.toggle('rotate-up');
        });
    }
    
    // Animaciones al hacer scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('[data-animation]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    
                    // Añadir delay si existe
                    if (entry.target.dataset.delay) {
                        entry.target.style.transitionDelay = entry.target.dataset.delay + 'ms';
                    }
                }
            });
        }, { threshold: 0.1 });
        
        elements.forEach(element => {
            observer.observe(element);
        });
    }
      // Elementos flotantes en la hero section
    function initFloatingElements() {
        const elements = document.querySelectorAll('.element');
        const isMobile = window.innerWidth <= 1024;
        
        elements.forEach(element => {
            const speed = element.dataset.speed;
            
            if (!isMobile && !isTouchDevice()) {
                // Animación con seguimiento del ratón para escritorio
                window.addEventListener('mousemove', (e) => {
                    const x = (window.innerWidth - e.pageX * speed) / 100;
                    const y = (window.innerHeight - e.pageY * speed) / 100;
                    
                    element.style.transform = `translateX(${x}px) translateY(${y}px)`;
                });
            } else {
                // Para dispositivos móviles, usamos la animación CSS definida
                element.style.transform = 'none';
            }
        });
    }
    
    // Detectar si es un dispositivo táctil
    function isTouchDevice() {
        return (('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0));
    }
    
    // Duplicar elementos del marquee para crear efecto infinito
    const marqueeContent = document.querySelector('.marquee-content');
    
    if (marqueeContent) {
        // Clonar todos los iconos
        const icons = marqueeContent.querySelectorAll('.tech-icon');
        icons.forEach(icon => {
            const clone = icon.cloneNode(true);
            marqueeContent.appendChild(clone);
        });
    }
    
    // Filtro de portfolio
    function initPortfolioFilter() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        
        if (filterBtns.length && projectCards.length) {
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Quitar clase active de todos los botones
                    filterBtns.forEach(b => b.classList.remove('active'));
                    // Añadir clase active al botón clickeado
                    btn.classList.add('active');
                    
                    const filter = btn.dataset.filter;
                    
                    // Filtrar proyectos
                    projectCards.forEach(card => {
                        if (filter === 'all' || card.dataset.category === filter) {
                            card.style.display = 'block';
                            setTimeout(() => {
                                card.style.opacity = 1;
                                card.style.transform = 'translateY(0)';
                            }, 100);
                        } else {
                            card.style.opacity = 0;
                            card.style.transform = 'translateY(20px)';
                            setTimeout(() => {
                                card.style.display = 'none';
                            }, 300);
                        }
                    });
                });
            });
        }
    }
    
    // Manejo del formulario de contacto
    function initContactForm() {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Validación de formulario
                const name = document.getElementById('name');
                const email = document.getElementById('email');
                const message = document.getElementById('message');
                let isValid = true;
                
                // Validación básica
                if (!name.value.trim()) {
                    showError(name, 'Por favor ingrese su nombre');
                    isValid = false;
                } else {
                    clearError(name);
                }
                
                if (!email.value.trim()) {
                    showError(email, 'Por favor ingrese su email');
                    isValid = false;
                } else if (!isValidEmail(email.value)) {
                    showError(email, 'Por favor ingrese un email válido');
                    isValid = false;
                } else {
                    clearError(email);
                }
                
                if (!message.value.trim()) {
                    showError(message, 'Por favor ingrese su mensaje');
                    isValid = false;
                } else {
                    clearError(message);
                }
                
                if (isValid) {
                    // Mostrar mensaje de éxito
                    const formData = new FormData(contactForm);
                    const formButton = contactForm.querySelector('button[type="submit"]');
                    const originalButtonText = formButton.textContent;
                    
                    formButton.textContent = 'Enviando...';
                    formButton.disabled = true;
                    
                    // Simulación de envío (en un caso real, esto sería una petición fetch o XMLHttpRequest)
                    setTimeout(() => {
                        // Resetear el formulario
                        contactForm.reset();
                        
                        // Mostrar mensaje de éxito
                        const successMessage = document.createElement('div');
                        successMessage.className = 'success-message';
                        successMessage.textContent = '¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.';
                        
                        contactForm.parentNode.insertBefore(successMessage, contactForm.nextSibling);
                        
                        // Restaurar el botón
                        formButton.textContent = originalButtonText;
                        formButton.disabled = false;
                        
                        // Ocultar el mensaje después de un tiempo
                        setTimeout(() => {
                            successMessage.style.opacity = '0';
                            setTimeout(() => {
                                successMessage.remove();
                            }, 500);
                        }, 5000);
                    }, 1500);
                }
            });
        }
    }
    
    // Funciones auxiliares para la validación de formulario
    function showError(input, message) {
        // Eliminar mensaje de error previo si existe
        clearError(input);
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        input.classList.add('input-error');
        input.parentNode.appendChild(errorElement);
    }
    
    function clearError(input) {
        input.classList.remove('input-error');
        const errorElement = input.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Inicializar el formulario
    initContactForm();    // Aplicar animación inicial a los elementos de navegación
    function initNavAnimations() {
        const navItems = document.querySelectorAll('.nav-links li');
        const navLinks = document.querySelector('.nav-links');
        
        // Primero hacer visible el contenedor de navegación
        if (navLinks) {
            navLinks.style.opacity = '1';
            navLinks.style.visibility = 'visible';
        }
        
        // Luego animar cada elemento individualmente
        navItems.forEach(item => {
            item.classList.add('animate');
            if (item.dataset.delay) {
                item.style.transitionDelay = item.dataset.delay + 'ms';
            }
        });
    }
    
    // Ejecutar inmediatamente
    initNavAnimations();
    
    // Lazy loading para imágenes
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback para navegadores que no soportan IntersectionObserver
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }
    
    // Iniciar lazy loading después de cargar la página
    setTimeout(() => {
        initLazyLoading();
    }, 1000);
});
