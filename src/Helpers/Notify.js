import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Notify(message) {
  toast.configure();
  const notify = () =>
    toast(
      { message },
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      }
    );
  notify();
  console.log(message, 787);
}
export { Notify };
