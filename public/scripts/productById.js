async function addToTheCart(cid,pid) {
    await fetch(`/api/carts/${cid}/products/${pid}`, {
        method:"POST"
    })
}

async function deleteProduct(pid) {
    const res = await fetch(`/api/products/${pid}`, {
        method:"DELETE"
    })

    window.location.href = "/products"
}