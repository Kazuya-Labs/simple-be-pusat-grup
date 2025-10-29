const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async url => {
  try {
    const html = await axios.get(url);
    const $ = cheerio.load(html.data);
    const data = {};
    data.imageUrl = $("img.tgme_page_photo_image").attr("src");
    data.title = $("div.tgme_page_title").text();
    return data;
  } catch (e) {
    console.error(e);
  }
};
