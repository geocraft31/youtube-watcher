const fs = require("fs");
const ytSearch = require("youtube-search-api");
const { fileURLToPath } = require("url");
const path = require("path");

const BASE_YT_URL = "https://www.youtube.com/";

const filePath = path.resolve(__filename, "..");

function getVideoDurationInSeconds(duration) {
  var durationInSeconds = 0;
  const times = duration.split(":");

  for (i = 0; i < times.length; i++) {
    durationInSeconds += Number(times[i]) * 60 ** (times.length - 1 - i);
  }

  return durationInSeconds;
}

async function searchYoutube(query) {
  try {
    const results = await ytSearch.GetListByKeyword(query, false);
    return results.items;
  } catch (error) {
    console.error("Error searching YouTube:", error);
    return [];
  }
}

function getPlaylistData() {
  try {
    const data = fs.readFileSync(`${filePath}/playlist.json`, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
  }
}

function writePlaylistData(data) {
  try {
    if (typeof data != "string") {
      data = JSON.stringify(data);
    }

    fs.writeFileSync(`${filePath}/playlist.json`, data, { encoding: "utf-8" });
  } catch (err) {
    console.error(err);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function hyperlink(url, text) {
  return `\x1b]8;;${url}\x1b\\${text}\x1b]8;;\x1b\\`;
}

function shuffleList(list) {
  try {
    if (list.length <= 2) {
      return console.log("Not enough songs to shuffle");
    }

    let currentIndex = list.length;
    let randomIndex = undefined;

    while (currentIndex != 1) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      let temp = list[currentIndex];
      list[currentIndex] = list[randomIndex];
      list[randomIndex] = temp;
    }
  } catch (err) {
    console.log("No songs to shuffle");
    console.log(err);
  }
}

function isUrl(str) {
  if (str.includes(BASE_YT_URL)) {
    return true;
  }
  return false;
}

module.exports = {
  getPlaylistData: getPlaylistData,
  writePlaylistData: writePlaylistData,
  sleep: sleep,
  hyperlink: hyperlink,
  shuffleList: shuffleList,
  searchYoutube: searchYoutube,
  getVideoDurationInSeconds: getVideoDurationInSeconds,
  isUrl: isUrl,
};
