let iconClose = document.querySelector('.icon-close');
const acceptTerms = document.querySelector('.acceptTerms');
const buttonLogin = document.querySelector('#login');
const buttonRegister = document.querySelector('#register');
const terms = document.querySelector('#terms');
const password = document.querySelector('#passw_reg');
const main = document.querySelector('.main');
const slider = document.querySelector('.slider');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');


document.addEventListener('DOMContentLoaded', function () {
    const iconMenu = document.querySelector('.icon-menu');
    const navigation = document.querySelector('.navigation');

    iconMenu.addEventListener('click', function () {
        navigation.classList.toggle('active');
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const parallaxText = document.getElementById('parallax-text');
    parallaxText.classList.add('loaded'); // Add the 'loaded' class when the DOM is loaded
});

let lastScrollTop = 0;
document.addEventListener('scroll', function () {
    const parallaxText = document.getElementById('parallax-text');
    const waves = document.querySelector('.waves');
    const anavLinks = document.querySelectorAll('.anav');
    const logo = document.querySelectorAll('.logo');
    const login = document.querySelectorAll('.btnLogin-popup');
    const hamburger = document.querySelectorAll('.icon-menu');

    const scrollPosition = window.scrollY;

    // Adjust the value (0.5) to control the speed of the parallax effect
    parallaxText.style.transform = 'translate(-50%, ' + scrollPosition * 0.3 + 'px)';
    waves.style.height = 200 + scrollPosition * 0.5;


    let st = window.pageYOffset || document.documentElement.scrollTop;

    if (st > lastScrollTop) {
        anavLinks.forEach(link => {
            link.classList.add('scroll-down');
        });
        logo.forEach(link => {
            link.classList.add('scroll-down');
        });
        login.forEach(link => {
            link.classList.add('scroll-down');
        });
        hamburger.forEach(link => {
            link.classList.add('scroll-down');
        });
    } else {
        anavLinks.forEach(link => {
            link.classList.remove('scroll-down');
        });
        logo.forEach(link => {
            link.classList.remove('scroll-down');
        });
        login.forEach(link => {
            link.classList.remove('scroll-down');
        });
        hamburger.forEach(link => {
            link.classList.remove('scroll-down');
        });
    }

    lastScrollTop = st <= 0 ? 0 : st * 0;

});

// Function to hide all sections
function hideAllSections() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
}
