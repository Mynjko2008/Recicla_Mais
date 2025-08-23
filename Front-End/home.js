/**
 * main.js - Script principal do site Reclica+
 * Responsável pelos comportamentos interativos do site
 */

// Variáveis globais
const header = document.getElementById('header');
const menuBtn = document.getElementById('menu');
const navMenu = document.getElementById('nav-menu');
const boxes = document.querySelectorAll('.box');

// Função para alternar a visibilidade do menu mobile
function toggleMenu() {
  navMenu.classList.toggle('active');
  const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
  menuBtn.setAttribute('aria-expanded', !isExpanded);
}

// Função para fechar o menu ao clicar em um link
function closeMenuOnClick() {
  const menuLinks = document.querySelectorAll('#nav-menu a');
  
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navMenu.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

// Efeito de sombra no header ao rolar a página
function handleScroll() {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

// Inicializar o Swiper para o carrossel de categorias
function initSwiper() {
  let swiperOptions = {
    slidesPerView: 'auto',
    spaceBetween: 20,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    breakpoints: {
      320: {
        slidesPerView: 2,
        spaceBetween: 10
      },
      480: {
        slidesPerView: 3,
        spaceBetween: 15
      },
      768: {
        slidesPerView: 4,
        spaceBetween: 20
      },
      1024: {
        slidesPerView: 5,
        spaceBetween: 20
      }
    }
  };
  
  // Inicializar apenas se o elemento existir
  const swiperEl = document.querySelector('.mySwiperCategorias');
  if (swiperEl) {
    new Swiper('.mySwiperCategorias', swiperOptions);
  }
}

// Configurar o Intersection Observer para animação dos boxes
function setupBoxAnimations() {
  const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
        // Opcional: pare de observar depois que a animação ocorrer
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  boxes.forEach(box => {
    observer.observe(box);
  });
}

// Inicializar todos os comportamentos quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar o Swiper
  initSwiper();
  
  // Configurar animações dos boxes
  setupBoxAnimations();
  
  // Configurar o menu mobile
  closeMenuOnClick();
  
  // Adicionar listener para o scroll
  window.addEventListener('scroll', handleScroll);
  
  // Verificar o scroll inicial
  handleScroll();
  
  // Adicionar smooth scroll para links internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70, // Ajuste para o header fixo
          behavior: 'smooth'
        });
      }
    });
  });
});