export type ToastType = "default" | "success" | "error" | "info" | "warning";

const AlertClasses: { [key in ToastType]: string | null } = {
  default: null,
  success: "alert-success",
  error: "alert-error",
  info: "alert-info",
  warning: "alert-warning",
};

export type ShowToastOptions = {
  type?: ToastType;
  timeout?: number;
};

export function showToast(message: string, options?: ShowToastOptions) {
  const type: ToastType = options?.type ?? "default";
  const timeout: number = options?.timeout ?? 2500;

  const toastContainer = getToastContainer();

  const alert = document.createElement("div");
  alert.classList.add("alert");
  const alertClass = AlertClasses[type];
  if (alertClass) {
    alert.classList.add(alertClass);
  }

  const alertText = document.createElement("span");
  alertText.innerText = message;

  alert.appendChild(alertText);
  toastContainer.appendChild(alert);

  setTimeout(() => {
    alert.remove();
  }, timeout);
}

const ToastContainerId = "toastContainer";

export function getToastContainer() {
  const body = document.body;
  let toastContainer = body.querySelector(`#${ToastContainerId}`);

  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = ToastContainerId;
    toastContainer.classList.add("toast");
    toastContainer.classList.add("toast-end");
    body.appendChild(toastContainer);
  }

  return toastContainer;
}
