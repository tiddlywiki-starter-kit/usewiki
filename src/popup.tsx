import "~style.css"

import { Icon } from "@iconify/react"
import React from "react"

import FetchData from "./components/FetchButton"

function IndexPopup() {
  return (
    <div className="flex items-center justify-center prose prose-indigo w-[800px]">
      <FetchData />
    </div>
  )
}

export default IndexPopup
