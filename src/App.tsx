import { Icon } from "@iconify/react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import React, { useEffect, useState } from "react"
import { toast, ToastContainer, Zoom } from "react-toastify"

import { useStorage } from "@plasmohq/storage/hook"

import "react-toastify/dist/ReactToastify.css"

dayjs.extend(utc)

// TODO: content empty cant import
function App() {
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
  const defaultTitle = dayjs(new Date()).format(journalFormat)

  const [username, setUserName] = useState()
  const [version, setVersion] = useState()
  const [loading, setLoading] = useState(false)

  const [title, setTitle] = useStorage("title", (title) => (title ? title : ""))

  const [text, setText] = useStorage("text", (text) => text || "")

  const defaultHost = "http://127.0.0.1:8000"
  const [type, setType] = useStorage("type", (type) =>
    type ? type : "text/vnd.tiddlywiki"
  )

  const toggleType = () => {
    if (type === "text/markdown") {
      setType("text/vnd.tiddlywiki")
    } else {
      setType("text/markdown")
    }
  }

  // rest here to refresh
  const [host, setHost] = useStorage<string>("host", (host) =>
    host === undefined ? defaultHost : host
  )

  useEffect(() => {
    fetch(`${host}/status`)
      .then((res) => {
        if (res.ok) {
          setLoading(true)
        } else {
          return
        }
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
    text,
    type
  }

  const fetchWrite = () => {
    fetch(`${host}/recipes/default/tiddlers/${title}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-requested-with": "TiddlyWiki"
      },
      body: JSON.stringify(tiddler)
    }).then((res) => {
      if (!res.ok) return
      notify(`${title} 保存成功`)
      setTitle("")
      setText("")
      // return res.json()
    })
  }

  const addTiddler = () => {
    if (!text) {
      notify("请输入内容", "error")
      return
    }
    if (!title) {
      notify("请输入标题", "error")
      return
    }
    fetch(`${host}/recipes/default/tiddlers/${title}`)
      .then((res) => {
        if (res.ok) return true
        return false
      })
      .then((data) => {
        if (data) {
          notify(`${title} 已存在, 请重新输入标题`, "error")
          throw new Error("该标题已存在")
        } else {
          fetchWrite()
        }
      })
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTiddler()
    }
  }

  const handleTextChange = (e) => {
    if (!title) {
      setTitle(defaultTitle)
    }
    setText(e.target.value)
  }

  const handleTitleChange = (e) => {
    setTitle(e.target.value)
  }

  return (
    <div className="w-full m-2 p-2">
      {/* hide or show */}
      <div
        className={`flex text-sm space-x-2 justify-center items-center text-gray-400 ${
          loading ? "font-semibold" : "hidden"
        }`}>
        <Icon icon="simple-icons:tiddlywiki" width="22" inline={true} />
        <div className="mx-2">Username: {username}</div>
        <div className="mx-2">Version: {version}</div>
        <div className="mx-2">Host: {host}</div>
      </div>

      {/* TODO: option */}
      <div className="flex justify-end space-x-2 mt-2 mb-0">
        <button
          className="bg-black text-white px-2 rounded-sm"
          onClick={toggleType}>
          {type.replace("text/", "")}
        </button>
      </div>

      {/* change storage */}
      {/* <button
        onClick={() => {
          setHost("http:/0.0.0.0:8000")
        }}>
        reset
      </button> */}

      <form className="font-mono">
        <input
          value={title}
          onChange={handleTitleChange}
          className="bg-neutral-200 rounded w-full outline-none focus:outline-none p-2 resize-none my-2"
          placeholder={`Title ${defaultTitle}`}
          onKeyPress={handleKeyPress}
        />
        <textarea
          autoFocus={true}
          rows={8}
          value={text}
          onChange={handleTextChange}
          onKeyPress={handleKeyPress}
          className="bg-neutral-200 appearance-none rounded p-2 w-full h-full max-h-[300px] my-1 text-base resize-none overflow-x-hidden overflow-y-auto outline-none whitespace-pre-wrap word-break"
          // https://tools.m-bsys.com/ex/unicode_table.php
          placeholder="¶ 现在的想法是 ..."></textarea>
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

export default App
