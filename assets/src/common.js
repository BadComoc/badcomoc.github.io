$(document).ready(function() 
{
    const cursor = document.querySelector('.cursor');

    $(window).on("resize", function() {
        setTimeout(function() {
            window.visualViewport.width = screen.width; // Re-adjust page viewport on window resize, maximize, & restore. Fixes marquee animation.
            window.visualViewport.scale = 1;
        }, 100);
    });

    $(window).on("mousemove", function(e) {
        const mouseY = e.clientY;
        const mouseX = e.clientX;

        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`; // Move custom cursor to actual cursor.
    });

});