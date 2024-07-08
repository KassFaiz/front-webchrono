import { toast } from "react-toastify";

const notifySuccess = (message) => toast.success(message);
const notifyError = (message) => toast.error(message);
const notifyInfo = (message) => toast.info(message);

export { notifySuccess, notifyError, notifyInfo };
