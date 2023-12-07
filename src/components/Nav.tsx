import { Icon } from "@iconify/react"
import React from "react"

export default function Nav() {
  return (
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
  )
}
