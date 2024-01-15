$(document).ready(function() 
{
    $(window).on("resize", function() {
        setTimeout(function() {
            window.visualViewport.width = screen.width; // Re-adjust page viewport on window resize, maximize, & restore. Fixes marquee animation.
            window.visualViewport.scale = 1;
        }, 100);
    });

});