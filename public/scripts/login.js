document.body.onload = async function () {


    const email = document.querySelector("#email")
    const email_error = document.querySelector("#email_error")
    const password = document.querySelector("#password")
    const password_error = document.querySelector("#password_error")
    const submit = document.querySelector("#submit")

    const email_regex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/

    function login(ev) {

        password_error.style.display = "none"

        ev.preventDefault()


        if (!email_regex.test(email.value)) {
            return email_error.style.display = "unset"
        }
        else {
            email_error.style.display = "none"
        }


        fetch("/api/sessions/login", {
            method: "POST",
            body: JSON.stringify({
                password: password.value,
                email: email.value
            }),
            headers: {
                "Content-Type": "Application/json"
            }
        })
            .then(async res => {

                const obj = await res.json()

                if (obj.status === "success") {
                    window.location.href = "/products"
                }
                else if (obj.error === "invalid email.") {
                    email_error.style.display = "unset"
                }
                else if (obj.error === "invalid password.") {
                    password_error.style.display = "unset"
                }
                else {
                    alert("An internal error occured. Please try again later.")
                }
            })

    }

    submit.onclick = login

}