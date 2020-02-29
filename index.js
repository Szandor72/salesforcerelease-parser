const scrapeIt = require("scrape-it");
const fs = require("fs");

let scrapeItConfig = {
  contentBlock: {
    listItem: ".topic-container .ullinks li",
    data: {
      title: "a",
      href: {
        selector: "a",
        attr: "href"
      },
      content: {
        texteq: 1,
        convert: x => x.replace("  ", " ")
      }
    }
  }
};

async function getData(url) {
  try {
    let result = await scrapeIt(url, scrapeItConfig);
    let data = result.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}

let url =
  "https://releasenotes.docs.salesforce.com/en-us/spring20/release-notes/rn_forcecom_development.htm";

let url2 =
  "https://releasenotes.docs.salesforce.com/en-us/spring20/release-notes/rn_deployment.htm";

let url3 =
  "https://releasenotes.docs.salesforce.com/en-us/spring20/release-notes/rn_security.htm";

let url4 =
  "https://releasenotes.docs.salesforce.com/en-us/spring20/release-notes/rn_forcecom_custom.htm";

async function getAllData() {
  let resultArray = [];
  try {
    let result = await getData(url);
    let result2 = await getData(url2);
    let result3 = await getData(url3);
    let result4 = await getData(url4);
    resultArray = resultArray.concat(result.contentBlock);
    resultArray = resultArray.concat(result2.contentBlock);
    resultArray = resultArray.concat(result3.contentBlock);
    resultArray = resultArray.concat(result4.contentBlock);
    return resultArray;
  } catch (error) {
    console.log(error);
  }
}

getAllData().then(data => {
  data.forEach(article => {
    article.content = article.content.replace(/\s+/g, " ");
    article.href =
      "https://releasenotes.docs.salesforce.com/en-us/spring20/release-notes/" +
      article.href;
  });

  let jsonContent = JSON.stringify(data, null, 4);

  fs.writeFile("quotation.json", jsonContent, "utf8", err => {
    if (err) {
      return console.log(err);
    }
    console.log("JSON file has been saved.");
  });
});
