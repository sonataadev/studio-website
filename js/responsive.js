// Asegurar estructura responsiva en todas las páginas
document.addEventListener("DOMContentLoaded", () => {
    // Función para envolver secciones con containers
    function wrapSectionsWithContainer() {
        // Array con los selectores que deberían tener un container
        const sectionsToWrap = [
            "section.page-header",
            "section.contact-section",
            "section.about-intro",
            "section.services-intro",
            "section.portfolio-intro",
            "section.services-detail",
            "section.mission-vision",
            "section.team-section",
            "section.tech-showcase",
            "section.process-section",
            "section.portfolio-grid",
            "section.testimonials",
            "section.cta-section",
            "section.map-section"
        ];
        
        // Envolver cada sección que no tenga ya un container
        sectionsToWrap.forEach(selector => {
            document.querySelectorAll(selector).forEach(section => {
                // Verificar si ya tiene un container directo
                if (!section.querySelector(':scope > .container')) {
                    // Crear contenedor
                    const container = document.createElement('div');
                    container.className = 'container';
                    
                    // Mover todos los hijos de la sección al container
                    while (section.firstChild) {
                        container.appendChild(section.firstChild);
                    }
                    
                    // Añadir el container a la sección
                    section.appendChild(container);
                }
            });
        });
        
        // Arreglar estructura del footer si es necesario
        const footer = document.querySelector('footer');
        if (footer && !footer.querySelector(':scope > .container')) {
            const container = document.createElement('div');
            container.className = 'container';
            
            // Mover todos los hijos del footer al container
            while (footer.firstChild) {
                container.appendChild(footer.firstChild);
            }
            
            // Añadir el container al footer
            footer.appendChild(container);
        }
    }
      // Optimizar la visualización de los iconos flotantes en modo responsivo
    function optimizeFloatingIcons() {
        const floatingElements = document.querySelector('.floating-elements');
        
        if (floatingElements) {
            // Verificar si estamos en viewport móvil
            if (window.innerWidth <= 768) {
                // Asegurar que los elementos flotantes estén en modo móvil
                const elements = floatingElements.querySelectorAll('.element');
                
                elements.forEach(element => {
                    // Eliminar estilos inline que puedan interferir
                    element.style.position = '';
                    element.style.transform = '';
                    element.style.background = 'none';
                    element.style.border = 'none';
                    element.style.boxShadow = 'none';
                    element.style.padding = '0';
                });
                
                // Verificar que el contenedor tenga las clases correctas
                floatingElements.classList.add('mobile-layout');
            } else {
                // En desktop
                floatingElements.classList.remove('mobile-layout');
                
                // Reactivar los elementos con estilos adecuados
                const elements = floatingElements.querySelectorAll('.element');
                elements.forEach(element => {
                    element.style.position = 'absolute';
                    element.style.background = 'none';
                    element.style.border = 'none';
                    element.style.boxShadow = 'none';
                    element.style.padding = '0';
                });
            }
        }
    }
    
    // Ejecutar después de que la página haya cargado
    setTimeout(() => {
        wrapSectionsWithContainer();
        optimizeFloatingIcons();
        
        // Volver a optimizar cuando cambie el tamaño de la ventana
        window.addEventListener('resize', optimizeFloatingIcons);
    }, 100);
});
