import { createSelectorFunctions } from "auto-zustand-selectors-hook"
import { create } from "zustand"

interface StoreState {
  title: string
  text: string
  tiddlers: number
}

interface StoreAction {
  setTitle: (title: string) => void
  setText: (text: string) => void
  incTiddlers: () => void
}

type UseStore = StoreState & StoreAction

const useWikiStoreBase = create<UseStore>()((set, get) => ({
  text: "",
  title: "",
  tiddlers: 0,

  setTitle: (title) => set({ title }),
  setText: (text) => set({ text }),
  incTiddlers: () => set({ tiddlers: get().tiddlers + 1 })
}))

const useWikiStore = createSelectorFunctions(useWikiStoreBase)
export default useWikiStore
