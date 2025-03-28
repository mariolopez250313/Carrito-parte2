//Variables globales del formulario login.html
const d = document;
userInput = d.querySelector("#usuarioForm");
passInput = d.querySelector("#contraForm");
btnLogin = d.querySelector(".btnLogin");

//evento al boton del formulario
btnLogin.addEventListener("click", () => {
   // alert("escribio :"+ userInput.value);
   let dataForm = getData();
   sendData(dataForm)
});

//funcion para validar el formulario y obtener datos del formulario
let getData = () => {
    //Validar formulario
    let user;
    if(userInput.value && passInput.value){
        user = {
            usuario: userInput.value,
            contrasena: passInput.value
        }
        userInput.value = "";
        passInput.value = "";
    }else{
        alert("Necesario llenar los datos de Usuario y Contraseña")
    }
    console.log(user);
    return user;
};

//funcion para recibir los datos y realizar la peticion al servidor
let sendData = async (data) =>{
    let url = "http://localhost/backend-apiCrud/login";
    try {
        let respuesta = await fetch(url,{
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify (data)
        });
        if(respuesta.status === 401) {
            alert("El usuario o la contraseña son incorrectos")
        }else{
            let userLogin = await respuesta.json();
        alert(`Bienvenido: ${userLogin.nombre}`)
        //guardamos datos en localStorage
        localStorage.setItem("userLogin", JSON.stringify(userLogin));    

        //redirigimos a la pagina de administracion (index.html)
        location.href = "../index.html";
        }        
    } catch (error) {
        console.log(error);
    }  
};
