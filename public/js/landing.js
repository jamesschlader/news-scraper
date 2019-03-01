$(document).ready(() => {
  $.get("/").then(data => {
    console.log("We're running");
  });

  // Whenever someone clicks a p tag
  $(document).on("click", "td", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data");

    console.log(`the id of the clicked item is: `, thisId);

    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        $("#notes").append(
          "<div class='uk-background-default uk-padding'><h2>" +
            data.title +
            "</h2><input class='uk-input uk-margin' id='titleinput' placeholder='Title your comment' name='title' ><textarea class='uk-textarea uk-margin' id='bodyinput' placeholder='Your comment goes here...' name='body'></textarea><button class='uk-button uk-button-primary uk-margin' data-id='" +
            data._id +
            "' id='savenote'>Save Note</button></div>"
        );

        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });

  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        $("#notes").empty();
      });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
    location.reload();
  });

  $(document).on("click", "#get-table-top-news", () => {
    $.ajax({
      method: "GET",
      url: "/scrape/tabletop"
    }).then(response => {
      console.log(response);
      $.ajax({
        method: "GET",
        url: "/"
      }).then(response => {
        location.reload();
      });
    });
  });
});
