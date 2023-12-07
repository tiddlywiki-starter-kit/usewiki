import toast from "react-hot-toast"

import useWikiStore from "./store"

const fetchWrite = (title, host, tiddler) => {
  const setTitle = useWikiStore.use.setTitle()
  const setText = useWikiStore.use.setText()
  const incTiddlers = useWikiStore.use.incTiddlers()

  fetch(new URL(`/recipes/default/tiddlers/${title}`, host), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-requested-with": "TiddlyWiki"
    },
    body: JSON.stringify(tiddler)
  }).then((res) => {
    if (!res.ok) {
      toast.error(`${title} 保存失败`)
      throw new Error("保存失败")
    }
    toast(`保存成功`)
    setTitle("")
    setText("")
    incTiddlers()
  })
}

export default fetchWrite
