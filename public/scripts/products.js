async function addToTheCart(cid, pid, isPremium, user, owner) {
    if (isPremium == "true") {
        if(user !== owner) {
            await fetch(`/api/carts/${cid}/products/${pid}`, {
                method: "POST"
            })
        }
        else{
            alert("Cannot add a product that you own to your cart.")
        }
    }
    else {
        await fetch(`/api/carts/${cid}/products/${pid}`, {
            method: "POST"
        })
    }
}

/*fetch("/api/products",{
    method:"POST",
    body:JSON.stringify({
        title:"Test product 3",
        description:"What a wonderful test product",
        price:123456,
        code:900,
        thumbnail:"",
        stock:5,
        status:true,
        category:"Testing"
    }),
    headers:{
        "Content-Type":"Application/JSON"
    }
}).then(res => res.text())
.then(res => {
    console.log(res)
})*/
