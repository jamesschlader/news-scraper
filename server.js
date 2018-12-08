var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var PORT =  process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(express.json());
// Make public a static folder
app.use(express.static("public/"));

// Connect to the Mongo DB
var db = require("./models");

var MONGODB_URI = process.env.MONGODB_URI || 
"mongodb://localhost/mongoNewsScrape";

mongoose.connect(
 MONGODB_URI
);

//Handlebars
var exphbs = require("express-handlebars");

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Routes
app.get("/", (req, res) => {
  articles = [];
  db.Article.find({}).then(dbArticle => {
    dbArticle.forEach(element => {
      article = {
        id: element._id.toString(),
        title: element.title,
        link: element.link,
        date: element.date,
        author: element.author,
        note: element.note
      };
      articles.push(article);
    });

    //console.log(`here's the data going to the landing page: `,articles);

    res.render("landing", articles);
  });
});

app.get("/ign", (req, res) => {
  articles = [];
  db.IgnArticle.find({}).then(dbIgnArticle => {
    dbIgnArticle.forEach(element => {
      article = {
        id: element._id.toString(),
        title: element.title,
        link: element.link,
        note: element.note
      };
      articles.push(article);
    });

    //console.log(`here's the data going to the landing page: `,articles);

    res.render("ign", articles);
  });
});

app.get("/swords", (req, res) => {
  swords = [];
  db.Swords.find({}).then(dbSwords => {
    dbSwords.forEach(element => {
      /*
      article = {
        id: element._id.toString(),
        title: element.title,
        link: element.link,
        date: element.date,
        author: element.author,
        note: element.note
      }
      articles.push(article)
*/
    });

    //console.log(`here's the data going to the landing page: `,articles);

    res.render("albion", swords);
  });
});

app.get("/articles", (req, res) => {
  articles = [];
  db.Article.find({})
    .then(dbArticle => {
      dbArticle.forEach(element => {
        article = {
          id: element._id.toString(),
          title: element.title,
          link: element.link,
          date: element.date,
          author: element.author
        };
        articles.push(article);
      });

      console.log(`here's the data going to the landing page: `, articles);
    })
    .then(data => {
      res.send(articles);
    });
});

// Route to scrape the http://www.tabletopgamingnews.com site for articles.

app.get("/scrape/tabletop", (req, res) => {
  console.log(`inside the tabletop scrape route...`);

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

    res.send("Table Top News scrape finished.");
  });
});

// Route used to scrape http://www.ign.com for gaming news articles.
app.get("/scrape/ign", (req, res) => {
  console.log(`Inside the IGN scrape route...`);

  axios.get("http://www.ign.com").then(function(response) {
    var $ = cheerio.load(response.data);

    $("section")
      .find("article")
      .each(function(i, element) {
        var result = {};

        result.title = $(this)
          .find("h3")
          .text()
          .trim();
        result.link = $(this)
          .find("a")
          .attr("href");

        console.log(result);

        db.IgnArticle.create(result)
          .then(function(dbIgnArticle) {
            // View the added result in the console
            console.log(dbIgnArticle);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });

    res.send("IGN News scrape finished.");
  });
});


// Route for grabbing a specific Table Top Gaming Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  db.Article.findOne({
    _id: req.params.id
  })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Table Top Gaming Article's associated Note

app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate(
        {
          _id: req.params.id
        },
        {
          note: dbNote._id
        },
        {
          new: true
        }
      );
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific IGN Article by id, populate it with it's note
app.get("/articles/ign/:id", function(req, res) {
  db.IgnArticle.findOne({
    _id: req.params.id
  })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbIgnArticle) {
      res.json(dbIgnArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an IGN Article's associated Note

app.post("/articles/ign/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.IgnArticle.findOneAndUpdate(
        {
          _id: req.params.id
        },
        {
          note: dbNote._id
        },
        {
          new: true
        }
      );
    })
    .then(function(dbIgnArticle) {
      res.json(dbIgnArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Sword by id, populate it with it's note
app.get("/articles/swords/:id", function(req, res) {
  db.Sword.findOne({
    _id: req.params.id
  })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbSwords) {
      res.json(dbSwords);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Sword's associated Note

app.post("/articles/swords/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Swords.findOneAndUpdate(
        {
          _id: req.params.id
        },
        {
          note: dbNote._id
        },
        {
          new: true
        }
      );
    })
    .then(function(dbSwords) {
      res.json(dbSwords);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

//////// Start the server //////
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
