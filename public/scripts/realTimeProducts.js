const socket = io();

function newElem(type,className,inner) { 
      const elem = document.createElement(type)

      elem.className = className

      elem.innerHTML = inner 

      return elem
}

function append(parent,arr) {
     arr.forEach(elem => {
        parent.appendChild(elem)
     })
}

function updateProducts(prods) {
    const container = document.querySelector("#products")

    container.innerHTML = ""

    prods.forEach(obj => {
         
        const prodContainer = newElem("div","product","")

        const header = newElem("p","header",obj.code)
        const title = newElem("h2","",obj.title)
        const price = newElem("h3","",obj.price)
        const description = newElem("p","",obj.description)
        
        append(prodContainer,[header,title,price,description])

        container.appendChild(prodContainer)
    })
}
socket.on("connection", () => {
    let data = {
        title:"Test 3",
        description:"Tremendo producto",
        price:10007,
        code:parseInt(Math.random() * 10000),
        stock:5,
        status:"True",
        category:"Testing"
    }
    
    fetch("/api/products",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
    })
})

socket.on('update', (data) => {
    updateProducts(data)
});