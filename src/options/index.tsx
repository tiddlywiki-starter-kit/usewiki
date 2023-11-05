import { Icon } from "@iconify/react"

import Main from "~components/main"

function IndexPopup() {
  return (
    <div
      className={`flex justify-center prose prose-indigo mx-auto max-w-none w-full bg-black h-screen`}>
      <div className="w-1/2">
        <Main />
        <a target="_blank" href="https://github.com/oeyoews/usewiki">
          <Icon icon="mdi:github" width={20} className="inline text-white" />
        </a>
      </div>
    </div>
  )
}

export default IndexPopup
