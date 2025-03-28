//variables globales de administracion
const d = document;
let nameUser = d.querySelector("#nombre-usuario");
let btnLogout = d.querySelector("#btnLogout");

//evento al navegador
d.addEventListener("DOMContentLoaded", () =>{
    getUser();
});

//funcion para poner el nombre del usuario
let getUser = () => {
    let user = JSON.parse(localStorage.getItem("userLogin"));
    nameUser.textContent = user.nombre;
};

//evento para el boton logoout (borrar los datos del localStorage)
btnLogout.addEventListener("click", () =>{
    localStorage.removeItem("userLogin");
    location.href = "../login.html";
});