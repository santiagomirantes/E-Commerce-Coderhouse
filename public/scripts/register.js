document.body.onload = async function () {


    const first_name = document.querySelector("#first_name")
    const first_name_error = document.querySelector("#first_name_error")
    const last_name = document.querySelector("#last_name")
    const email = document.querySelector("#email")
    const email_error = document.querySelector("#email_error")
    const age = document.querySelector("#age")
    const age_error = document.querySelector("#age_error")
    const password = document.querySelector("#password")
    const password_error = document.querySelector("#password_error")
    const submit = document.querySelector("#submit")

    const email_regex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/
    const username_regex = /[a-zA-Z0-9_]*/

    function register(ev) {

        ev.preventDefault()

        if (first_name.value.length < 8 || !username_regex.test(first_name.value)) {
            return first_name_error.style.display = "unset"
        }
        else {
            first_name_error.style.display = "none"
        }

        if (!email_regex.test(email.value)) {
            return email_error.style.display = "unset"
        }
        else {
            email_error.style.display = "none"
        }

        if (isNaN(parseInt(age.value))) {
            return age_error.style.display = "unset"
        }
        else {
            age_error.style.display = "none"
        }

        if (password.value.length < 8) {
            return password_error.style.display = "unset"
        }
        else {
            password_error.style.display = "none"
        }

        fetch("/api/sessions/register", {
            method: "POST",
            body: JSON.stringify({
                first_name: first_name.value,
                last_name: last_name.value,
                password: password.value,
                email: email.value,
                age: age.value
            }),
            headers: {
                "Content-Type": "Application/json"
            }
        })
            .then(async res => {

                const obj = await res.json()
                console.log(obj)

                if (obj.status === "success") {
                    window.location.href = "/products"
                }
                else {
                    alert("An internal error occured. Please try again later.")
                }
            })

    }

    submit.onclick = register

}