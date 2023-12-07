import { Icon } from "@iconify/react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import React, { useEffect, useState } from "react"
import toast, { Toaster } from "react-hot-toast"

import { useStorage } from "@plasmohq/storage/hook"

dayjs.extend(utc)

export default function Main() {
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
      toast("已切换为 wikitext")
    } else {
      setType("text/markdown")
      toast("已切换为 markdown")
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
        toast.success("连接成功, 欢迎使用 usewiki")
      })
      .catch((e) => {
        toast.error(`连接失败, ${host}`)
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
        toast.error(`${title} 保存失败`)
        throw new Error("保存失败")
      }
      toast(`保存成功`)
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
      toast.error("请输入内容")
      return
    }
    if (!title) {
      toast.error("请输入标题")
      return
    }
    fetch(new URL(`/recipes/default/tiddlers/${title}`, host))
      .then((res) => {
        if (res.ok) {
          toast.error(`${title} 已存在, 请重新输入标题`)
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

  let loadingStyle = loading ? "text-green-500" : "text-yellow-500"

  return (
    <div className="">
      <div
        className={`flex text-sm space-x-2 justify-between items-center text-gray-400 ${loadingStyle}`}>
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
          className={`bg-transparent rounded outline-none focus:outline-none p-2 resize-none my-2 text-gray-300 ${loadingStyle}`}
          value={host}
          onChange={(e) => {
            if (!checkURL(e.target.value)) {
              toast("请输入正确的地址")
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
                toast("无法访问")
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
                    toast(`已切换为 ${value}`)
                  } else {
                    toast("请输入正确的地址")
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
            <Icon icon="simple-icons:tiddlywiki" />
          ) : (
            <Icon icon="material-symbols:markdown-outline" />
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

      <Toaster position="bottom-left" reverseOrder={false} />
      <div className="fixed bottom-0 right-0 flex">
        <a href="./newtab.html" target="_blank">
          <Icon
            icon="mingcute:fullscreen-2-line"
            width={20}
            className="text-white m-2"
          />
        </a>
        <a href="./options.html" target="_blank">
          <Icon icon="uil:setting" width={20} className="text-white m-2" />
        </a>
      </div>
    </div>
  )
}
