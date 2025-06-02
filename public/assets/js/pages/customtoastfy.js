$(document).ready(function () {
    window.showToastSuccess = function (message) {
        const toast = document.createElement("div");
        toast.style.display = "flex";
        toast.style.alignItems = "center";
        toast.style.gap = "8px";
        toast.style.color = "white";

        const icon = document.createElement("i");
        icon.className = "fas fa-check-circle"; // icon centang success
        icon.style.fontSize = "16px";

        toast.appendChild(icon);

        const textSpan = document.createElement("span");
        textSpan.textContent = message || "Berhasil!";
        toast.appendChild(textSpan);

        Toastify({
            node: toast,
            duration: 2500,
            gravity: "top",
            position: "right",
            style: {
                background: "radial-gradient( circle farthest-corner at 22.4% 21.7%, rgba(4,189,228,1) 0%, rgba(2,83,185,1) 100.2% )",
            },
            close: false,
            stopOnFocus: true,
        }).showToast();
    }

    window.showToastError = function (message) {
        const toast = document.createElement("div");
        toast.style.display = "flex";
        toast.style.alignItems = "center";
        toast.style.gap = "8px";
        toast.style.color = "white";

        const icon = document.createElement("i");
        icon.className = "fas fa-exclamation-circle"; // icon tanda seru error
        icon.style.fontSize = "16px";

        toast.appendChild(icon);

        const textSpan = document.createElement("span");
        textSpan.textContent = message || "Terjadi kesalahan!";
        toast.appendChild(textSpan);

        Toastify({
            node: toast,
            duration: 2500,
            gravity: "top",
            position: "right",
            style: {
                background: "linear-gradient(to right, #ff5f6d, #ffc371)",
            },
            close: false,
            stopOnFocus: true,
        }).showToast();
    }
})