import "~global.css"

import Main from "~components/main"

// 这里引入icon 会找不到
function IndexPopupPage() {
  return (
    <div className={`prose prose-indigo max-w-none mx-auto bg-black h-screen`}>
      <div className="w-2/3 mx-auto">
        <Main />
      </div>
    </div>
  )
}

export default IndexPopupPage
