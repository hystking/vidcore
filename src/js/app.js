const API_DOMAIN = "localhost:3000"

let video_index = 0

fetch(`//${API_DOMAIN}/search.json?q=cat`)
.then(res => res.json())
.then(ids => {
  console.log(ids)
  for(let i = 0; i < ids.length; i++) {
    $(".video").eq(video_index).attr({src: `//${API_DOMAIN}/video.mp4?id=${ids[i]}`})
    video_index = (video_index + 1) % $(".video").length
  }
})
