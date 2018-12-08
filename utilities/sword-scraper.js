// Route for scraping http://www.albionswords.com for sword data.

app.get("/scrape/swords", (req, res) => {
    console.log(`Starting to scrape albion-sword.com for swords...`);
  
    axios.get("https://www.albion-swords.com/").then(function(response) {
      let $ = cheerio.load(response.data);
  
      //var results = [];
  
      $("table")
        .find("div")
        .prop("align", "center")
        .each(function(i, element) {
          let division = $(element)
            .find("a")
            .attr("href");
          let name = $(element)
            .find("img")
            .attr("alt");
          let result = {};
  
          if (division && name) {
            result = {
              division: division,
              name: name
            };
            //results.push(result);
          }
  
          if (result.division.includes("swords/albion/swords-albion-mark-")) {
            axios
              .get(`https://www.albion-swords.com/${result.division}`)
              .then(function(response) {
                var $ = cheerio.load(response.data);
                let targets = [];
                let item = {};
                console.log(`\n\nInside the next gen scraping method...\n\n`);
  
                $("table")
                  .find("td")
                  .each(function(i, element) {
                    const base = $(element).find("a");
                    let name = base.find("img").attr("alt");
                    let link = base.attr("href");
                    let image = base.find("img").attr("src");
                    item = {
                      name: name,
                      link,
                      image
                    };
                    //targets.push(item);
  
                    //function removeUndefined(item) {
                    if (item.name !== undefined) {
                      item.image = `http://www.albion-swords.com${item.image.replace(
                        /\.\.\/\.\./,
                        ""
                      )}`;
  
                      //let newTargets = targets.filter(item => removeUndefined(item));
                      //let finalTargets = newTargets.map(
                      //   item =>
                      //  (item.image = `http://www.albion-swords.com${item.image.replace(
                      //         /\.\.\/\.\./,
                      //        ""
                      //       )}`)
                      // );
  
                      //for (let i = 0; i < newTargets.length; i++) {
                      //  newTargets[i].image = finalTargets[i].image;
                      // }
  
                      // console.log(`\n\n Here's the target swords we're looking for: `, newTargets)
  
                      // newTargets.forEach(item => {
  
                      axios
                        .get(
                          `http://www.albion-swords.com/swords/albion/${
                            item.link
                          }`
                        )
                        .then(function(response) {
                          var $ = cheerio.load(response.data);
  
                          var text = "";
                          var paragraph = [];
  
                          $("p").each(function(i, element) {
                            text = $(element)
                              .find("font")
                              .attr("size", "2")
                              .text();
  
                            if (text.includes("Specifications")) {
                          
                          //console.log(
                          //  `\nThe paragraph has ${
                          //    paragraph.length
                          //    } items. Here's the paragraph: `,
                          //  paragraph
                          // );
  
                          let secondPass = text
                            .replace(/\s+/g, " ")
                            .replace(/\n/g, "");
                          console.log(`\nSecond pass is `, secondPass);
  
                          let thirdPass = secondPass.slice(
                            secondPass.indexOf("Overall"),
                            secondPass.lastIndexOf("Overall")
                          );
                          console.log(`\nHere's the third pass: `, thirdPass);
  
                          const fourthPass = thirdPass.split(/\)\s/);
  
                          console.log(`\nfourth pass = `, fourthPass);
  
                          let fifthPass = fourthPass.map(item => `${item})`);
                          fifthPass.pop();
                          console.log(`\n Here's the fifth pass: `, fifthPass);
  
                          let newSword = {
                            link: item.link,
                            name: item.name,
                            image: item.image,
                            overallLength: fifthPass[0]
                              .substring(
                                fourthPass.indexOf(":"),
                                fourthPass.indexOf(/"/)
                              )
                              .trim(),
                            bladeLength: fifthPass[1]
                              .slice(
                                fifthPass[1].indexOf(":"),
                                fifthPass[1].indexOf(/"/)
                              )
                              .trim(),
                            bladeWidth: fifthPass[2]
                              .substring(
                                fifthPass[2].indexOf(":"),
                                fifthPass[2].indexOf(/"/)
                              )
                              .trim(),
                            centerOfPercussion: fifthPass[3]
                              .slice(
                                fifthPass[3].indexOf(":"),
                                fifthPass[3].indexOf(/"/)
                              )
                              .trim(),
                            centerOfBalance: fifthPass[4]
                              .slice(
                                fifthPass[4].indexOf(":"),
                                fifthPass[4].indexOf(/"/)
                              )
                              .trim(),
                            weight: fifthPass[5]
                              .slice(
                                fifthPass[5].indexOf(/\(/),
                                fifthPass[5].indexOf(/g/)
                              )
                              .trim()
                          };
                          db.Sword.create(newSword)
                            .then(function(dbSword) {
                              // View the added result in the console
                              console.log(dbSword);
                            })
                            .catch(function(err) {
                              // If an error occurred, log it
                              console.log(err);
                            });
                          }
                        });
                        });
                    }
                  });
              });
          }
        });
    });
  });