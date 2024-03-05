const logoutButton = document.querySelector("#logout")

async function logout() {

    await fetch("/api/sessions/logout")

    setTimeout(() => {

        window.location.href = "/login"

    }, 1000)

}


logoutButton.onclick = logout