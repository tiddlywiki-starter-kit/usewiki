"use client"

import Image from "next/image"

import Main from "~components/main"

function IndexPopup() {
  return (
    <div
      className={`flex items-center justify-center prose prose-indigo w-[800px] bg-black`}>
      <Main />
      <Image
        src="https://gravatar.cn/avatar/148e1716a35094238339c4337f725e08.png?s=100"
        className="rounded-full outline outline-white"
        alt=""
        width={22}
        height={22}
      />
    </div>
  )
}

export default IndexPopup
