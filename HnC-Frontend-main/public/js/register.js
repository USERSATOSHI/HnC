document.addEventListener("DOMContentLoaded", () => {
    const register = document.getElementById("register");
    const error = document.getElementById("error");
    error.style.height = "0px";
    error.style.top = "-30px";

    const password = document.getElementById("pass");
    let p = password?.value;

    const updatepass = () => {
        password.type = "text";
        // only save the part that was selected
        const x = p.slice(password.selectionStart, password.selectionEnd);
        password.value = p
            .split("")
            .map((y, i) =>
                i >= password.selectionStart && i < password.selectionEnd
                    ? y
                    : "*",
            )
            .join("");
        // keep the part selected after the update
        password.focus();
        password.setSelectionRange(
            password.selectionStart,
            password.selectionEnd,
        );
    };

    const restorePass = () => {
        console.log(p);
        password.type = "password";
        password.value = p;
    };

    password?.addEventListener("change", (e) => (p = e.target.value));
    password?.addEventListener("keyup", (e) => (p = e.target.value));
    password?.addEventListener("select", (e) => updatepass());
    password.onblur = password.onfocus = password.onmousedown = restorePass;

    const closebtn = document.getElementById("closeerrorbtn");
    console.log({ closebtn });

    register.addEventListener("click", async (e) => {
        try {
            e.preventDefault();

            let phone = document.getElementById("email").value;
            const name = document.getElementById("name").value;
            const age = document.getElementById("age").value;
            const bloodgroup = document.getElementById("bloodgroup").value;
            const password = document.getElementById("pass").value;
            if (!phone || !password)
                return sendError("Please fill all the fields");
            if (phone.length === 13) phone = phone.slice(3);

            phone = Number(phone).toString();
            if (isNaN(phone) || phone.length !== 10)
                return sendError("Invalid Phone Number");
            if (password.length < 8)
                return sendError("Password must be atleast 8 characters long");

            const data = {
                phone,
                password,
                name,
                age,
                bloodgroup,
            };

            const resData = await fetch(
                "https://pancham1305-proxy.deno.dev/api/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                },
            ).then((d) => d.json());
            console.log(resData);
            if (resData.status === 200) {
                localStorage.setItem("user", JSON.stringify(resData.data));
                localStorage.setItem("token", resData.token);
                window.location.href = "./services.html";
            } else {
                sendError(resData.message);
            }
        } catch (e) {
            sendError(`Failed to register: ${e.message}`);
        }
    });
});

document.addEventListener("click", (e) => {
    if (e.target.id !== "closeerrorbtn") return;
    const error = document.getElementById("error");
    error.innerHTML =
        '  <div class="closebtn" id="closeerrorbtn">&times;</div>';
    error.style.height = "0px";
    error.style.top = "-30px";
});

function sendError(msg) {
    const error = document.getElementById("error");
    error.style.height = "";
    error.style.top = "";
    error.innerHTML += `<div class='etext'>${msg}</div>`;
}
