const youtubeCredentials = require("../credentials/youtube")
const googleapis = require("googleapis")
const ytdl = require("ytdl-core")
const fs = require("fs")

function mp4Filter(format) {
  return format.container === "mp4"
}

module.exports = function youtube() {
  const client = googleapis.youtube({
    version: "v3",
    auth: youtubeCredentials.key,
  })

  function search(q, callback) {
    client.search.list({
      part: "id",
      q,
    }, function (err, {items}){
      if(err) {
        return callback(err)
      }
      console.log(items)
      callback(null, items.map(item => item.id.videoId))
    })
  }

  function download(id, filePath, callback) {
    ytdl(`http://www.youtube.com/watch?v=${id}`, {filter: mp4Filter})
    .pipe(fs.createWriteStream(filePath))
    .on("error", function(err) {
      callback(err)
    })
    .on("finish", function() {
      console.log("finish")
      callback()
    })
  }

  return {
    search,
    download,
  }
}
