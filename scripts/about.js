gsap.registerPlugin(ScrollTrigger);

let horizontalSection = document.querySelector('.horizontal');

gsap.to('.horizontal', {
    x: () => -horizontalSection.scrollWidth + window.innerWidth,
    ease: "none",
    scrollTrigger: {
        trigger: '.horizontal',
        start: 'bottom bottom',
        end: '+=190px',
        pin: '#horizontal-scroll',
        scrub: true,
        invalidateOnRefresh: true
    }
});