// execute the code when the page is fully loaded
$(document).ready(function() {
    // Graph
    $('#Graph').hide();
    var graphHidden = true;

    $('#GraphHeading').click(function() {
        if(graphHidden) {
            $('#Graph').slideDown(duration=500);
            graphHidden = false;
            $('#GraphHeading').text('Graph');
        }
        else{
            $('#Graph').slideUp(duration=500, callback=function() {
                graphHidden = true;
                $('#GraphHeading').text('Graph (Click to View)');
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
