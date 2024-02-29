const socket = io()

socket.on("connection", async () => {


const data = {
    quantity:5
}

const prodId = "65ca6cfb8ffb2790bd8dd16a"

const res = await fetch("/api/carts/65de29cc1887c456fbbca05c",{
    method:"GET",
    /*body:JSON.stringify(data),
    headers:{
        "Content-Type":"Application/json"
    }*/
})

console.log(await res.json())

})