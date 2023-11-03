fetch("http://0.0.0.0:8000/status").then((res) => {
  if (!res.ok) throw new Error(res.statusText)
  console.log(res.statusText)
})
