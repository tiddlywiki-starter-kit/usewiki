import "~global.css"

import { Toaster } from "react-hot-toast"

import Main from "~components/main"

// 这里引入icon 会找不到
function IndexPopupPage() {
  return (
    <>
      <div
        className={`flex items-center justify-center prose max-w-none prose-indigo w-[800px] text-black bg-white dark:text-white dark:bg-[#111010] dark:prose-invert`}>
        <Main />
      </div>
    </>
  )
}

export default IndexPopupPage
