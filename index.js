const scrapeIt = require("scrape-it");

async function requestReleaseNotesPageScrape(url) {
  let scrapeItConfig = {
    category: "h1",
    items: {
      listItem: ".topic-container .ullinks li",
      data: {
        title: "a",
        href: {
          selector: "a",
          attr: "href"
        },
        content: {
          texteq: 1
        },
        contentRaw: {
          how: "html"
        }
      }
    }
  };
  try {
    let result = await scrapeIt(url, scrapeItConfig);
    let data = result.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function parseReleaseNotePages(urls) {
  let allMyRequests = [];
  urls.forEach(url => {
    allMyRequests.push(requestReleaseNotesPageScrape(url));
  });
  try {
    let result = await Promise.all(allMyRequests);
    return result;
  } catch (error) {
    console.log(error);
  }
}

async function getTopics(urls) {
  try {
    let data = await parseReleaseNotePages(urls);
    let topics = [];
    data.forEach(result => {
      result.items.forEach(item => {
        // content contains apex classes
        if (item.contentRaw.indexOf("codeph apex_code") > -1) {
          let rawHtml = item.contentRaw;
          // get content without header link
          rawHtml = rawHtml.split("\n")[1];
          let cleanText = rawHtml.replace(/(<([^>]+)>)/gi, "");
          item.content = cleanText;
        }
        let topic = {
          category: result.category.split(":")[0],
          title: item.title,
          content: item.content.replace(/\s+/g, " "),
          href:
            "https://releasenotes.docs.salesforce.com/en-us/spring20/release-notes/" +
            item.href
        };

        if (topic.content) {
          topics.push(topic);
        }
      });
    });
    return topics;
  } catch (error) {
    console.log(error);
  }
}

module.exports = urls => {
  return getTopics(urls);
};
