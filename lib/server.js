const express = require("express")
const http = require("http")
const fs = require("fs")
const path = require("path")

const PORT = 3000
const VIDEOS_PATH = path.resolve(`${__dirname}/../videos`)

function server(youtube) {
  const app = express()

  app.listen(PORT, function () {
    console.log(`start listening on port ${PORT}`)
  })

  app.get("/health-check", function(req, res) {
    res.send("I'm alive")
  })

  app.get("/search.json", function(req, res) {
    youtube.search(req.query.q, function(err, ids) {
      if(err) {
        res.status(500).send({error: err})
      }
      res.json(ids)
    })
  })

  app.get("/video.mp4", function(req, res) {
    const {id} = req.query
    const filePath = `${VIDEOS_PATH}/${id}.mp4`
    fs.exists(filePath, function(exists) {
      if(exists) {
        return res.sendFile(filePath)
      }
      youtube.download(id, filePath, function(err) {
        return res.sendFile(filePath)
      })
    })
  })
}

module.exports = server
