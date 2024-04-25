let state = 0
const textarea = document.querySelector("textarea");

textarea.setAttribute("style", "height:" + (textarea.scrollHeight) + "px;overflow-y:hidden;display:none;");
textarea.addEventListener("input", OnInput, false);

function OnInput() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + "px";
}

async function addMessage() {

    if (state === 0) {
        textarea.style.display = "unset"
        state = 1
    }
    else {
        let content = textarea.value.trim()

        if(content === "") {
            return alert("The message cannot include only blank spaces")
        }
        const body = JSON.stringify({
            content
        })
        const res = await fetch("/api/chat/", {
            method: "POST",
            body,
            headers: {
                "Content-Type": "Application/JSON"
            }
        })
        textarea.style.display = "none"
        
        window.location.reload()
    }

}