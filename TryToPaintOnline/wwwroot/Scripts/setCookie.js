document.getElementById("signIn").onclick = function signIn() {
    nameUser = document.getElementById("login").value;
    if (nameUser) {
        document.cookie = "user=" + nameUser; // обновляем только куки с именем 'user'
    }
    else {
        alert("fill name")
    }
};