async function submit(ev) {
    ev.preventDefault()
    const form = document.querySelector('form');
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());
    const splitURL = window.location.href.split(("/"))
    const productID = splitURL[splitURL.length - 1].split("?")[0]

    const res = await fetch(`/api/products/${productID}`,{
        method:"PUT",
        body:JSON.stringify(formObject),
        headers:{
            "Content-Type":"Application/JSON"
        }
    })


    window.location.href = "/products"

}

document.querySelector("input[type='button']").onclick = submit
