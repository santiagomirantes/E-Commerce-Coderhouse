/*ALL OF THIS IS ONLY TESTING*/


const form = document.querySelector("form")

form.onsubmit = async function (e) {
    e.preventDefault()

    const formData = new FormData(this);

    const data = {};

    formData.forEach((value, key) => {
        data[key] = value;
    });

    try {
        const response = await fetch('http://localhost:8080/api/products/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });


        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log('Response:', responseData);
    } catch (error) {
        console.error('Error:', error.message);
    }


}

try{
    let data = {
        quantity:5
    }

    const id = "9062b2db-8092-467e-af51-f9f929e68b4c"
    const pid = "a1973c11-5e24-45a0-a3dd-0cf6ebd1c40d"

    const response = fetch("http://localhost:8080/api/carts/" + id + "/product/" + pid, {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(data)
    }).then(res => {
        return res.json()
    })
    .then(res => {
        console.log(res)
    })
}

catch(err) {
    console.error("Error:", error.message)
}