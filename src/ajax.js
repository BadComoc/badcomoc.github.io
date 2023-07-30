$(document).ready(function() 
{
    function anchorClick(link)
    {
        $.get("/ajax" + link, function(data) 
        {
            $("#content-wrapper").html(data);
        });
    }

    $("#header-wrapper").on("click", "a", function(e)
    {
        window.history.pushState(null, null, $(this).attr('href'));
        anchorClick($(this).attr('href'));
        e.preventDefault();
    });

    $("#nav-wrapper").on("click", "a", function(e)
    {
        window.history.pushState(null, null, $(this).attr('href'));
        anchorClick($(this).attr('href'));
        e.preventDefault();
    });

    window.addEventListener("popstate", function(e) {
        anchorClick(location.pathname);
    });
});
