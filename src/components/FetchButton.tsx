import { Icon } from "@iconify/react"
import React, { useEffect, useState } from "react"
import { toast, ToastContainer, Zoom } from "react-toastify"

import "react-toastify/dist/ReactToastify.css"

function FetchData() {
  const notify = (msg) => toast.success(msg, {})

  const [responseData, setResponseData] = useState(null)
  return (
    <div>
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
        <Icon icon="fa:send-o" width="32" />
      </button>
      <div className="w-full mx-auto">{responseData && <div>{JSON.stringify(responseData, null, 2)}</div>}</div>
    </div>
  )
}

export default FetchData
