fetch("http://0.0.0.0:8000/status").then((res) => {
  if (!res.ok) throw new Error(res.statusText)
  console.log(res.statusText)
})

// terminal will have error , cli not
// fetch("https://127.0.0.1:8000/recipes/default/tiddlers.json")
//   .then((res) => {
//     return res.json()
//   })
//   .then((data) => {
//     console.log(data.length)
//   })
