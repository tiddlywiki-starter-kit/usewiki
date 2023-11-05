import { Icon } from "@iconify/react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import React, { useEffect, useState } from "react"
import { toast, ToastContainer, Zoom } from "react-toastify"

import { useStorage } from "@plasmohq/storage/hook"

import "react-toastify/dist/ReactToastify.css"

dayjs.extend(utc)

export default function Main() {
  const notify = (msg, type = "success") =>
    toast[type](msg, {
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
    })
  const journalFormat = "YYYY-MM-DD HH:mm:ss"
  const defaultTitle = dayjs(new Date()).format(journalFormat)

  const [username, setUserName] = useState("")
  const [version, setVersion] = useState("")
  const [loading, setLoading] = useState(false)

  const [
    title,
    setTitle,
    { setRenderValue: setTitleRenderValue, setStoreValue: setTitleStoreValue }
  ] = useStorage("title", (title) => title || "")

  const [text, setText, { setRenderValue, setStoreValue }] = useStorage(
    "text",
    (text) => text || ""
  )

  const [type, setType] = useStorage(
    "type",
    (type) => type || "text/vnd.tiddlywiki"
  )

  const toggleType = () => {
    if (type === "text/markdown") {
      setType("text/vnd.tiddlywiki")
      notify("已切换为 wikitext")
    } else {
      setType("text/markdown")
      notify("已切换为 markdown")
    }
  }

  // useeffect run twice ?
  const [
    host,
    setHost,
    { setRenderValue: setHostRenderValue, setStoreValue: setHostStoreValue }
  ] = useStorage<string>("host", (host) => host || `http://localhost:${8000}`)

  const statusURL = new URL("/status", host)
  const checkURL = (url) => {
    try {
      new URL(url)
      return true
    } catch (error) {
      return false
    }
  }

  // setHost("http://localhost:8000")

  // TODO: client to fetch(not node env, browser will check cros)
  useEffect(() => {
    fetch(statusURL)
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
        notify("连接成功, 欢迎使用 usewiki.")
      })
      .catch((e) => {
        notify(`连接失败, ${host}`, "error")
        console.log(e)
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
    fetch(new URL(`/recipes/default/tiddlers/${title}`, host), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-requested-with": "TiddlyWiki"
      },
      body: JSON.stringify(tiddler)
    }).then((res) => {
      if (!res.ok) {
        notify(`${title} 保存失败`, "error")
        throw new Error("保存失败")
      }
      notify(`保存成功`)
      setTitle("")
      setText("")
      setTiddlers(() => tiddlers + 1)
    })
  }

  const [tiddlers, setTiddlers] = useState(0)
  const getAllTiddlersURL = new URL(`/recipes/default/tiddlers.json`, host)

  useEffect(() => {
    fetch(getAllTiddlersURL)
      .then((res) => res.json())
      .then((data) => {
        setTiddlers(data.length)
      })
      .catch((e) => {
        console.log(e)
      })
  }, [])

  const addTiddler = () => {
    if (!text.trim()) {
      notify("请输入内容", "error")
      return
    }
    if (!title) {
      notify("请输入标题", "error")
      return
    }
    fetch(new URL(`/recipes/default/tiddlers/${title}`, host))
      .then((res) => {
        if (res.ok) {
          notify(`${title} 已存在, 请重新输入标题`, "error")
          throw new Error("该标题已存在")
        }
        fetchWrite()
      })
      .catch((e) => console.log(e))
  }

  const handleInputSend = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
    }
  }
  const handleSend = (e) => {
    if (e.ctrlKey && e.key === "Enter") {
      e.preventDefault()
      addTiddler()
    }
  }

  // TODO: add throttle
  const handleTitleChange = (e) => {
    setTitleRenderValue(e.target.value)
    setTitleStoreValue(e.target.value)
  }

  const handleTextChange = (e) => {
    if (!title) {
      setTitle(defaultTitle)
    }
    setRenderValue(e.target.value)
    setStoreValue(e.target.value)
  }

  return (
    <div className="w-full m-2 p-2">
      <div
        className={`flex text-sm space-x-2 justify-between items-center text-gray-400 ${
          loading ? "font-semibold" : "text-rose-500"
        }`}>
        <span className="bg-transparent rounded p-1">
          <Icon icon="simple-icons:tiddlywiki" className="inline mr-1" />
          {version}
        </span>
        <span className="bg-transparent rounded p-1">
          <Icon icon="basil:user-outline" className="inline mr-1" /> {username}
        </span>
        <span className="bg-transparent rounded p-1">
          <Icon icon="emojione:fishing-pole" className="inline mr-1" />
          {tiddlers.toLocaleString()}
        </span>
        <input
          className={`bg-transparent rounded outline-none focus:outline-none p-2 resize-none my-2 text-gray-300 ${
            loading ? "text-green-500" : "text-rose-500"
          }`}
          value={host}
          onChange={(e) => {
            if (!checkURL(e.target.value)) {
              notify("请输入正确的地址", "error")
              return
            }
            setHostRenderValue(e.target.value)
          }}
          onKeyDown={(e) => {
            // @ts-ignore
            const value = e.target.value
            if (e.key === "Enter") {
              e.preventDefault()
              // @ts-ignore
              if (!checkURL(value)) {
                notify("无法访问", "error")
                return
              }
              fetch(value)
                .then((res) => {
                  if (res.ok) {
                    return true
                  }
                  return false
                })
                .then((data) => {
                  if (data) {
                    setHostStoreValue(value)
                    notify(`已切换为 ${value}`)
                  } else {
                    notify("请输入正确的地址", "error")
                  }
                })
                .catch((e) => console.log(e))
            }
          }}
        />
        <span
          className="bg-transparent text-white p-1 rounded"
          onClick={toggleType}>
          {type === "text/vnd.tiddlywiki" ? (
            <Icon icon="simple-icons:tiddlywiki" width={22} inline={true} />
          ) : (
            <Icon
              icon="material-symbols:markdown-outline"
              width={22}
              inline={true}
            />
          )}
        </span>
      </div>

      <form className="font-mono">
        <input
          value={title}
          onChange={handleTitleChange}
          className="bg-transparent rounded w-full outline-none focus:outline-none p-2 resize-none my-2 text-gray-300"
          placeholder={`${defaultTitle}`}
          onKeyDown={handleInputSend}
        />
        <textarea
          autoFocus={true}
          rows={16}
          value={text}
          onKeyDown={handleSend}
          onChange={handleTextChange}
          className="caret-rose-400 bg-transparent appearance-none rounded p-2 w-full h-full max-h-[300px] my-1 text-base resize-none overflow-x-hidden overflow-y-auto outline-none whitespace-pre-wrap word-break text-gray-300"
          // https://tools.m-bsys.com/ex/unicode_table.php
          placeholder="¶ 现在的想法是 ..."></textarea>
      </form>

      <ToastContainer
        position="bottom-center"
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
