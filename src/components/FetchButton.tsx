import { Icon } from "@iconify/react"
import React, { useEffect, useState } from "react"
import { toast, ToastContainer, Zoom } from "react-toastify"

import "react-toastify/dist/ReactToastify.css"

function FetchData() {
  const notify = (msg) => toast.success(msg, {})

  const [responseData, setResponseData] = useState(null)
  return (
    <div className="flex space-x-2 my-2">
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
      <button
        onClick={() => {
          fetch("http://0.0.0.0:8000/status")
            .then((res) => {
              return res.json()
            })
            .then((data) => {
              setResponseData(data)
            })
        }}
        className="bg-gray-400 rounded-sm p-1">
        getinfo
      </button>

      <button
        onClick={() => {
          fetch("http://0.0.0.0:8000/recipes/default/tiddlers/plasmo", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "x-requested-with": "TiddlyWiki"
            },
            body: JSON.stringify({
              text: "This is a usewiki tiddler"
            })
          })
            .then((res) => {
              if(res.ok) notify('写入成功')
              return res.json()
            })
        }}
        className="bg-gray-400 rounded-sm p-1">
        import
      </button>
      <div className="w-full mx-auto">
        {responseData && <div>{JSON.stringify(responseData, null, 2)}</div>}
      </div>
    </div>
  )
}

export default FetchData
