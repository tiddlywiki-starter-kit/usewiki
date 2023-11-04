import { Icon } from "@iconify/react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import React, { useEffect, useState } from "react"
import { toast, ToastContainer, Zoom } from "react-toastify"

import "react-toastify/dist/ReactToastify.css"

dayjs.extend(utc)

// TODO: content empty cant import
function FetchData() {
  const notify = (msg, type = "success") =>
    toast[type](msg, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
    })
  const journalFormat = "YYYY-MM-DD HH:mm:ss"
  const defaultTitle = dayjs(new Date()).utc().format(journalFormat)

  const [username, setUserName] = useState("")
  const [version, setVersion] = useState("")
  const [text, setText] = useState("")
  const [title, setTitle] = useState(defaultTitle)

  useEffect(() => {
    fetch("http://0.0.0.0:8000/status")
      .then((res) => {
        if (!res.ok) return
        return res.json()
      })
      .then(({ username, tiddlywiki_version }) => {
        setUserName(username)
        setVersion(tiddlywiki_version)
      })
  }, [])

  const timeFormat = "YYYYMMDDHHmmss"
  const created = dayjs(new Date()).utc().format(timeFormat)
  const modified = created

  const tiddler = {
    creator: username,
    created,
    modified,
    fields: {
      tags: "Journal"
    },
    text
  }
  const addTiddler = () => {
    if (!text) {
      notify("请输入内容", "error")
      return
    }
    fetch(`http://0.0.0.0:8000/recipes/default/tiddlers/${title}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-requested-with": "TiddlyWiki"
      },
      body: JSON.stringify(tiddler)
    }).then((res) => {
      if (res.ok) notify(`${title} 导入成功`)
      return res.json()
    })
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTiddler()
    }
  }

  const handleTextChange = (e) => {
    setText(e.target.value)
  }

  const handleTitleChange = (e) => {
    setTitle(e.target.value)
  }

  return (
    <div>
      <div className="flex text-sm space-x-2 justify-center items-center">
        Username: <div className="underline mx-2"> {username}</div>
        Version: <div className="underline mx-2">{version}</div>
      </div>

      <form className="my-2">
        <input
          value={title}
          onChange={handleTitleChange}
          className="bg-neutral-200 rounded w-full outline-none focus:outline-none mx-2 px-1 py-2 resize-none my-2"
          placeholder={`💡 Title ${defaultTitle}`}
          required
        />
        <textarea
          rows={7}
          value={text}
          onChange={handleTextChange}
          onKeyPress={handleKeyPress}
          className="bg-neutral-200 appearance-none rounded mx-2 px-1 py-2 w-full h-full max-h-[300px] my-1 text-base resize-none overflow-x-hidden overflow-y-auto outline-none whitespace-pre-wrap word-break"
          placeholder="✍输入内容，按回车导入"
          required></textarea>
      </form>
      <ToastContainer
        position="top-right"
        autoClose={1000}
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
