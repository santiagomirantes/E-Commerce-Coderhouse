async function submit(ev) {
    ev.preventDefault()
    const form = document.querySelector('form');
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());

    const res = await fetch(`/api/products/`,{
        method:"POST",
        body:JSON.stringify(formObject),
        headers:{
            "Content-Type":"Application/JSON"
        }
    })


    window.location.href = "/products"

}

document.querySelector("input[type='button']").onclick = submit
