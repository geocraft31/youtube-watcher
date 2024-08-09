const ytdl = require("youtube-dl-exec");
const ffmpeg = require("fluent-ffmpeg");
const Speaker = require("speaker");

const {
  hyperlink,
  sleep,
  searchYoutube,
  getVideoDurationInSeconds,
} = require("./util.js");

async function getVideoData(query) {
  const searchResult = await searchYoutube(query);
  return searchResult;
}

async function playAudioFromVideo(query) {
  const videoList = await getVideoData(query);
  const video = videoList[0];

  const channelId =
    video.shortBylineText.runs[0].navigationEndpoint.browseEndpoint.browseId;

  const speaker = new Speaker({
    channels: 2,
    bitDepth: 16,
    sampleRate: 48000,
  });
  try {
    var source = ytdl.exec(`https://www.youtube.com/watch?v=${video.id}`, {
      output: "-",
      audioFormat: "opus",
      extractAudio: true,
    });
  } catch {
    console.error(`Error while getting video data`);
  }

  ffmpeg(source.stdout)
    .audioCodec("pcm_s16le")
    .audioFilters("aresample=48000")
    .format("s16le")
    .pipe(speaker, { end: true });

  console.log(
    `Now playing: ${hyperlink(`https://www.youtube.com/watch?v=${video.id}`, video.title)}`,
  );
  console.log(
    `From:        ${hyperlink(
      `https://www.youtube.com/channel/${channelId}`,
      video.channelTitle,
    )}`,
  );

  const duration = getVideoDurationInSeconds(video.length.simpleText);
  await sleep(duration * 1000);
}

module.exports = {
  playAudioFromVideo: playAudioFromVideo,
};
