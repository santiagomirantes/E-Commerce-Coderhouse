const socket = io()

socket.on("connection", async () => {


const query = JSON.stringify({
    
})

const data = {
    
}

const res = await fetch("/api/products?query=" + query + "&limit=1&sort=desc",{
    method:"GET",
    /*body:JSON.stringify(data),
    headers:{
        "Content-Type":"Application/json"
    }*/
})

console.log(await res.json())

})