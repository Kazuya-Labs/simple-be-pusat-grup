const cheerio = require("cheerio");
const axios = require("axios");

const main = async url => {
  try {
    const html = await axios.get(url);
    const $ = cheerio.load(html.data);

    const data = {};
    data.imageUrl = $("img._9vx6").attr("src");
    data.title = $("#main_block h3._9vd5").text();
    return data;
  } catch (e) {
    console.error(e);
  }
};

module.exports = main;
