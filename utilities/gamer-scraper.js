// First, we grab the body of the html with axios
axios.get("http://www.tabletopgamingnews.com").then(function(response) {
  // Then, we load that into cheerio and save it to $ for a shorthand selector
  var $ = cheerio.load(response.data);

  // Now, we grab every h2 within an article tag, and do the following:
  $("section")
    .find("article")
    .each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .find("h2")
        .find("a")
        .text();
      result.link = $(this)
        .find("h2")
        .children("a")
        .attr("href");
      result.date = $(this)
        .find("div")
        .find(".posted-on")
        .children("a")
        .text();
      result.author = $(this)
        .find("div")
        .find(".author")
        .children("a")
        .text();

      console.log(result);

      // Create a new Article using the `result` object built from scraping

      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

  // Send a message to the client
  //res.render("landing",result );
  //res.json(result)
});
