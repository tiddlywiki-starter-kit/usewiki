import "~style.css"

import { Icon } from "@iconify/react"
import React from "react"

import FetchData from "./components/FetchButton"

function IndexPopup() {
  return (
    <div className="flex items-center justify-center prose prose-indigo w-[800px] h-96">
      <div className="fixed top-0 left-0 m-1 ">
        <Icon icon="simple-icons:tiddlywiki" width="32" />
        <FetchData />
      </div>
      <textarea className="bg-neutral-200 rounded w-full outline-none focus:outline-none mx-2 px-1 rows-1 placeholder:text-gray-200" placeholder="✍下面输入内容"></textarea>
    </div>
  )
}

export default IndexPopup
