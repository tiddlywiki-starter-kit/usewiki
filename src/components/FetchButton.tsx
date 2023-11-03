import { Icon } from "@iconify/react"
import React, { useEffect, useState } from "react"
import { toast, ToastContainer, Zoom } from "react-toastify"

import "react-toastify/dist/ReactToastify.css"

function FetchData() {
  const notify = (msg) => toast.success(msg, {})

  const [username, setUserName] = useState("")
  const [version, setVersion] = useState("")
  const [text, setText] = useState("")
  const [title, setTitle] = useState("")

  useEffect(() => {
    fetch("http://0.0.0.0:8000/status")
      .then((res) => {
        return res.json()
      })
      .then(({ username, tiddlywiki_version }) => {
        setUserName(username)
        setVersion(tiddlywiki_version)
      })
  }, [])


  const addTiddler = () => {
    fetch(`http://0.0.0.0:8000/recipes/default/tiddlers/${title}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-requested-with": "TiddlyWiki"
      },
      body: JSON.stringify({
        creator: username,
        text,
      })
    }).then((res) => {
      if (res.ok) notify(`${title} 导入成功`)
      return res.json()
    })
  }

  const handleAddTiddler = (e) => {
    e.preventDefault()
    addTiddler()
  }

  return (
    <div>
      <div className="flex text-sm space-x-2 justify-center items-center">
        Username: <div className="underline"> {username}</div>
        Version: <div className="underline">{version}</div>
      </div>

      <form onSubmit={handleAddTiddler} className="my-2 space-y-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-neutral-200 rounded w-full outline-none focus:outline-none mx-2 px-1 placeholder:text-gray-200"
          placeholder="💡Title"
          required
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="bg-neutral-200 rounded mx-2 px-1 py-2 w-full h-full max-h-[300px] my-1 text-base resize-none overflow-x-hidden overflow-y-auto outline-none whitespace-pre-wrap word-break"
          placeholder="✍输入内容"
          rows={1}
          required></textarea>
      </form>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        newestOnTop={true}
        transition={Zoom}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  )
}

export default FetchData
