import { Icon } from "@iconify/react"
import React, { useEffect, useState } from "react"
import { toast, ToastContainer, Zoom } from "react-toastify"

import "react-toastify/dist/ReactToastify.css"

function FetchData() {
  const notify = (msg) => toast.success(msg, {})

  const [username, setUserName] = useState("")
  const [version, setVersion] = useState("")

  const addTiddler = (text, title) => {
    fetch("http://0.0.0.0:8000/recipes/default/tiddlers/plasmo", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-requested-with": "TiddlyWiki"
      },
      body: JSON.stringify({
        text,
      })
    }).then((res) => {
      if (res.ok) notify(`${title} 导入成功`)
      return res.json()
    })
  }

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

  return (
    <div className="">
      <div className="flex text-sm space-x-2 justify-center items-center">
        Username: <div className="underline"> {username}</div>
        Version: <div className="underline">{version}</div>
      </div>

      <div className="my-2">
        <textarea
          className="bg-neutral-200 appearance-none rounded w-full outline-none focus:outline-none mx-2 px-1 placeholder:text-gray-200"
          placeholder="✍下面输入内容"
          rows={1}></textarea>
        <button onClick={() => addTiddler("test", 'title test')} className="bg-gray-400 rounded-sm p-1">
          import
        </button>
      </div>
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
