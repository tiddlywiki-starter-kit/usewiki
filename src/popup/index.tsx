import "~global.css"

import Main from "~components/main"

// 这里引入icon 会找不到
function IndexPopupPage() {
  return (
    <div
      className={`flex items-center justify-center prose prose-indigo w-[800px] bg-black`}>
      <Main />
    </div>
  )
}

export default IndexPopupPage
