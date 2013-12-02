// execute the code when the page is fully loaded
$(document).ready(function() {
    // Graph
    $('#GraphContent').hide();
    var graphHidden = true;

    $('#GraphHeading').click(function() {
        if(graphHidden) {
            $('#GraphContent').slideDown(duration=500);
            graphHidden = false;
            $('#GraphHeading').text('Graph Content');
        }
        else{
            $('#GraphContent').slideUp(duration=500, callback=function() {
                graphHidden = true;
                $('#GraphHeading').text('Graph Content (Click to View)');
            });
        }
    });

    // How to Use
    var howToUseHidden = false;
    $('#HowToUseHeading').click(function() {
        if(howToUseHidden) {
            $('#HowToUse').slideDown(duration=500);
            howToUseHidden = false;
            $('#HowToUseHeading').text('How To Use');
        }
        else{
            $('#HowToUse').slideUp(duration=500, callback=function() {
                howToUseHidden = true;
                $('#HowToUseHeading').text('How To Use (Click to View)');
            });
        }
    });
});
