$(document).on("ready", function() {
    var indexPageReRoute = $("input[name=index-page-re-route]").val();
    if (indexPageReRoute && indexPageReRoute.trim().length > 0) {
        window.location.href = indexPageReRoute.trim();
    }
});