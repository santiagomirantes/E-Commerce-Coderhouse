const chooseDiv = document.querySelector("#choose")
const email = document.querySelector("#email")
const submit = document.querySelector("#submit")
const sentDiv = document.querySelector("#sent")
const emailPlaceholder = document.querySelector("#sent h2 span")
const code = document.querySelector("#code")
const codeSubmit = document.querySelector("#sent #submit")

if(typeof sessionStorage.getItem("sent") !== "string") {
   sentDiv.style.display = "none"
   submit.onclick = async function(ev) {
      ev.preventDefault()
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if(emailRegex.test(email.value)) {
         const res = await fetch("/api/sessions/forgotpassword/" + encodeURIComponent(email.value))
         sessionStorage.setItem("sent",email.value)
         window.location.reload()
      }
      else{
         alert("Invalid email")
      }
      
   }
}
else{
   chooseDiv.style.display = "none"
   const email = sessionStorage.getItem("sent")
   emailPlaceholder.innerHTML = email
   codeSubmit.onclick = async function(ev) {
       ev.preventDefault()
       const res = await fetch("/api/sessions/forgotpassword/" + encodeURIComponent(email), {
         method:"POST",
         body:JSON.stringify({
            code: parseInt(code.value)
         }),
         headers:{
            "Content-Type":"Application/JSON"
         }
       })

       if(!res.ok) {
          alert("Tried too many times!")
          sessionStorage.removeItem("sent")
          window.location.reload()
       }
       else{
         const obj = await res.json()
         if(obj.status === "success") {
            sessionStorage.removeItem("sent")
            window.location.href = "/modifypassword/" + encodeURIComponent(email)
         }
         else{
            alert("Invalid code")
            code.value = ""
         }
       }
   }
}
