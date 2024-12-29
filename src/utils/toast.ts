import { toast, ToastContent } from 'react-toastify';

export const showSuccessToast = (message: ToastContent) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark"
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark"
  });
};

export const showInfoToast = (message: string) => {
  toast.info(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark"
  });
};

export const showLoadingToast = (message: string) => {
  return toast.loading(message, {
    position: "top-right",
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    theme: "dark"
  });
};

export const updateToast = (toastId: string | number, type: 'success' | 'error', message: string) => {
  toast.update(toastId, {
    render: message,
    type,
    isLoading: false,
    autoClose: 5000,
    closeOnClick: true,
    draggable: true,
    theme: "dark"
  });
};
