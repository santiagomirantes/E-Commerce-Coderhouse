async function deleteFromCart(cid,pid) {

   let quantity = 0
   products.forEach(p => quantity += p.id === pid ? 1 : 0)

   const res = await fetch(`/api/carts/${cid}/products/${pid}/quantity/${quantity - 1}`, {
        method:"PUT"
    })

    window.location.reload()
}

async function buy(cid) {
    const res = await fetch(`/api/carts/${cid}/purchase`)

    const ticket = await res.text()

    alert(ticket)

    window.location.reload()
}