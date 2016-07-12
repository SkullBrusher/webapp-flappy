
var count = 0;

jQuery("#credits").on("click", function() {

  jQuery("#content").empty();

    var message = "Game created by Selo BIATCH!";
    jQuery("#content").append(
        "<p>" + count + "</p>"
    );
    count++;
});

jQuery("#scoresbtn").on("click", function() {
    jQuery("#content").empty();
    jQuery("#content").append(
        "<ul>" +
            "<li>" + "Selo" + "</li>" +
            "<li>" + "James" + "</li>" +
            "<li>" + "Snoop Dogg" + "</li>" +
        "</ul>"
    );
});

jQuery("#creditsbtn").on("click", function() {
    jQuery("#content").empty();
    jQuery("#content").append(
        "<div>" + "Game created by Selo Gencay!" + "</div>"
    );
});

jQuery("#helpbtn").on("click", function() {
    jQuery("#content").empty();
    jQuery("#content").append(
        "<ul>"
            + "<li>" + "Press SPACE to jump your TIE Fighter" + "</li>"
            + "<li>" + "Avoid incoming meteors!" + "</li>"
        + "</ul>"
    );

});

function registerScore() {

  var playerName = prompt("What's your name?");
  var scoreEntry = "<li>" + playerName + ":" + score.toString() + "</li>";

}
