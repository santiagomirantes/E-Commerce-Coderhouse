const password = document.querySelector("#password")
const submit = document.querySelector("#submit")

submit.onclick = async function(ev) {
    ev.preventDefault()
    const res = await fetch("/api/sessions/modifypassword/" + email, {
        method:"PUT",
        body:JSON.stringify({
            password:password.value
        }),
        headers:{
            "Content-Type":"Application/JSON"
        }
    })
    if(!res.ok) {
        alert("Unknown error. Please try again later.")
        window.location.reload()
    }
    const obj = await res.json()

    if(obj.status === "success") {
        alert("Password changed succesfully")
        window.location.href = "/login"
    }
    else{
        alert("Cannot use the same password as before")
        window.location.reload()
    }
}