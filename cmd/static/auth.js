let loginBtn = document.querySelector(".login-btn")
let username = document.querySelector(".username")
let password = document.querySelector(".password")

loginBtn.addEventListener("click", async () => {
    if (username.value && password.value) {
        let request = await fetch("/login", {
            method: "POST",
            headers: {
                'Content-Type': 'text/javascript'
            },
            body: JSON.stringify({
                username: username.value,
                password: password.value
            })
        })

        if (!request.ok) {
            alert("Error of logging")
        } else {
            let token = await request.text()
            if (token) {
                const myHeaders = new Headers();
                myHeaders.append("Authorization", token);

                const requestOptions = {
                    method: "GET",
                    headers: myHeaders,
                    redirect: "follow"
                };

                fetch("protected", requestOptions)
                    .then((response) => response.text())
                    .then((result) => console.log(result))
                    .catch((error) => console.error(error));
            }
            console.log(request.status)
        }
    }
})