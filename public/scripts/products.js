async function addToTheCart(cid,pid) {
    await fetch(`/api/carts/${cid}/products/${pid}`, {
        method:"POST"
    })
}