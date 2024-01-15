$(document).ready(function() 
{
    function openUrl(href)
    {
        $.ajax({
            url: href,
            async: true,
            type: 'GET',
            cache: true,
            success: function(data, status, jqXHR)
            {
                // Load link with ajax then update the current page with new content instead of going to the requested page.
                var content = $(jqXHR.responseText).find("#content-wrapper");
                $("#content-wrapper").html(content.html());
            }
        });
        window.history.pushState({href: href}, '', href);
    }

    $("#header-wrapper").on("click", "a", function(e) // On clicking the title images at the very top.
    {
        openUrl($(this).attr('href'));
        e.preventDefault();
        return false;
    });

    $(document).on("click", "#ajax", function(e) // On clicking any link tagged with "ajax".
    {
        $(document).find(".current").removeClass("current");
        $(this).addClass("current");

        openUrl($(this).attr('href'));
        e.preventDefault();
        return false;
    });

    window.addEventListener("popstate", function(e) { // Some ajax stuff.
        if (e.state)
            openUrl(e.state.href);
    });
});
