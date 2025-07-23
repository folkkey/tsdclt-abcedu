export function initFormHandler({ formId, submitBtnId, lang = 'vn' }) {
    const translations = {
        vn: {
            sending: "Đang gửi... ⏳",
            submit: "Gửi đăng ký ngay",
            success: "Gửi đăng kí thành công!",
            failed: "Gửi thất bại, vui lòng thử lại!",
            noImage: "Vui lòng chọn ảnh!",
            noPhone: "Vui lòng điền đầy đủ thông tin họ tên và số điện thoại!",
        },
        en: {
            sending: "Sending... ⏳",
            submit: "Submit registration",
            success: "Successfully submitted!",
            failed: "Failed to submit. Please try again!",
            noImage: "Please select an image!",
            noPhone: "Please fill in your full name and phone number!",
        }
    };

    const t = (key) => translations[lang]?.[key] || key;

    const form = document.getElementById(formId);
    const submitButton = document.getElementById(submitBtnId);

    if (!form || !submitButton) return;

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        submitButton.disabled = true;
        submitButton.innerHTML = t("sending");

        const formValues = {
            fullName: getVal('fullName'),
            role: getVal('role'),
            email: getVal('email'),
            phone: getVal('phone'),
            major: getVal('major'),
        }

        if (!formValues.fullName || !formValues.phone) {
            showToast(t("noPhone"), 'bg-warning');
            submitButton.disabled = false;
            submitButton.innerHTML = t("submit");
            return;
        }

        fetch("https://script.google.com/macros/s/AKfycbxmZj_zc62N8OSIBb6-cVfzJnMVQMZce7ctK9aKMSFOmG5o7z0YRn0UIOaziv88N2Rf/exec", {
            method: "POST",
            body: JSON.stringify(formValues),
            headers: {
                "Content-Type": "application/json"
            },
            mode: "no-cors"
        })
            .then(() => {
                showToast(t("success"), "bg-success");
                form.reset();
            })
            .catch(error => {
                console.error("Lỗi khi gửi:", error);
                showToast(t("failed"), "bg-danger");
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.innerHTML = t("submit");
            });


    });

    function getVal(id) {
        return document.getElementById(id)?.value || '';
    }


    function showToast(message, type = "bg-success") {
        const toastEl = document.getElementById("alertBox");
        const toastMessage = document.getElementById("alertMessage");

        if (!toastEl || !toastMessage) return;

        toastMessage.textContent = message;
        toastEl.classList.remove("bg-success", "bg-danger", "bg-warning");
        toastEl.classList.add(type);

        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    }
}