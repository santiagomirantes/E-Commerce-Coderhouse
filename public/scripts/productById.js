async function addToTheCart(cid, pid, isPremium, user, owner) {
    if (isPremium) {
        if (user !== owner) {
            await fetch(`/api/carts/${cid}/products/${pid}`, {
                method: "POST"
            })
        }
        else {
            alert("Cannot add a product that you own to your cart")
        }
    }
    else {
        await fetch(`/api/carts/${cid}/products/${pid}`, {
            method: "POST"
        })
    }
}

async function deleteProduct(pid) {
    const res = await fetch(`/api/products/${pid}`, {
        method: "DELETE",
    })

    window.location.href = "/products"
}