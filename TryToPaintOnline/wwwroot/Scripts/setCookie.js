document.getElementById("signIn").onclick = function signIn() {
    nameUser = document.getElementById("login").value;
    if (nameUser) {
        document.cookie = "user=" + nameUser + ";" +"domain=localhost:44343"; // обновляем только куки с именем 'user'
    }
    else {
        alert("fill name")
    }
};