import { toast, ToastContainer, Zoom } from "react-toastify"

export default fetch("http://0.0.0.0:8000/status").then((res) => {
  const notify = (msg) => toast.success(msg, {})
  if (!res.ok) throw new Error(res.statusText)
  notify(res.statusText)
})
