const logoutButton = document.querySelector("#logout")

async function logout() {

    const res = await fetch("/api/sessions/logout")


    window.location.href = "/login"



}


logoutButton.onclick = logout