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
      callback(null, items.filter(item => item.id.kind === "youtube#video").map(item => item.id.videoId))
    })
  }

  function download(id, filePath, callback) {
    ytdl(`http://www.youtube.com/watch?v=${id}`, {
      filter: mp4Filter,
    })
    .on("error", function(err) {
      fs.unlink(filePath)
      callback(err)
    })
    .on("finish", function() {
      console.log("finish")
      callback()
    })
    .pipe(fs.createWriteStream(filePath))
  }

  return {
    search,
    download,
  }
}
