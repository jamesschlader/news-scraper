app.get("/", (req, res) => {
  let articles = [];
  db.Article.find({}).then(dbArticle => {
    dbArticle.forEach(element => {
      let article = {
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
  let articles = [];
  db.IgnArticle.find({}).then(dbIgnArticle => {
    dbIgnArticle.forEach(element => {
      let article = {
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
  let swords = [];
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
