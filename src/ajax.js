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
                var content = $(jqXHR.responseText).find("#content-wrapper");
                $("#content-wrapper").html(content.html());
            }
        });
        window.history.pushState({href: href}, '', href);
    }

    $("#header-wrapper").on("click", "a", function(e)
    {
        openUrl($(this).attr('href'));
        e.preventDefault();
        return false;
    });

    $(document).on("click", "#ajax", function(e)
    {
        $(document).find(".current").removeClass("current");
        $(this).addClass("current");

        openUrl($(this).attr('href'));
        e.preventDefault();
        return false;
    });

    window.addEventListener("popstate", function(e) {
        if (e.state)
            openUrl(e.state.href);
    });
});
