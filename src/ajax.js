$(document).ready(function() 
{
    function openUrl(href)
    {
        var link = "/ajax" + href;
        $.ajax({
            url: link,
            async: false,
            type: 'GET',
            cache: false,
            success: function(result)
            {
                $("#content-wrapper").html(result);
            }
        });
        window.history.pushState({href: href}, '', href);
    }
	
	function openBlog()
    {
        var link = "/ajax" + href;
        $.ajax({
            url: link,
            async: false,
            type: 'GET',
            cache: false,
            success: function(result)
            {
                $("#content-wrapper").html("<iframe src=\"" + link + "\"></iframe>");
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
        openUrl($(this).attr('href'));
        e.preventDefault();
        return false;
    });
	
	$(document).on("click", "#blog-btn", function(e)
    {
        openBlog();
        e.preventDefault();
        return false;
    });

    window.addEventListener("popstate", function(e) {
        if (e.state)
            openUrl(e.state.href);
    });
});
