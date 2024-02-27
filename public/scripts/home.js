const socket = io()

socket.on("connection", async () => {

const data = {
    description:"What a nice test product edited",
}

const res = await fetch("/api/products/65ca6cfb8ffb2790bd8dd16a",{
    method:"PUT",
    body:JSON.stringify(data),
    headers:{
        "Content-Type":"Application/json"
    }
})

console.log(await res.json())

})