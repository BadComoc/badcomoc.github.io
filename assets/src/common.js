$(document).ready(function() 
{
    const cursor = document.querySelector('.cursor');
    let mouseX = 0;
    let mouseY = 0;

    $(window).on("resize", function() {
        setTimeout(function() {
            window.visualViewport.width = screen.width; // Re-adjust page viewport on window resize, maximize, & restore. Fixes marquee animation.
            window.visualViewport.scale = 1;
        }, 100);
    });

    $(window).on("mousemove", function(e) {
        mouseY = e.clientY;
        mouseX = e.clientX;

        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`; // Move custom cursor to actual cursor.
    });

    $(function() { // Hide/show custom cursor when 
        $('a').hover(function() { // hovering over links
            $(cursor).css('display', 'none');
        }, function() {  // not hovering over links
            $(cursor).css('display', 'block');
        });

        $('iframe').hover(function() { // hovering over iframes
            $(cursor).css('display', 'none');
        }, function() {  // not hovering over iframes
            $(cursor).css('display', 'block');
        });

        $('#music-button-wrapper').hover(function() { // hovering over music buttons
            $(cursor).css('display', 'none');
        }, function() {  // not hovering over  music buttons
            $(cursor).css('display', 'block');
        });

        $(document).mouseleave(function() { // leaving the page
            $(cursor).css('display', 'none');
        });
        $(document).mouseenter(function() { // entering the page
            $(cursor).css('display', 'block');
        });

        // TODO: More cases.
    });

});