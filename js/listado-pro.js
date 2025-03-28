//Variables globales
const d = document;
let tablePro = d.querySelector("#table-pro > tbody");
let searchInput = d.querySelector("#search-input");
let nameUser = d.querySelector("#nombre-usuario");
let btnLogout = d.querySelector("#btnLogout");

//Funcion para poner el nombre del usuario
let getUser = () => {
    let user = JSON.parse(localStorage.getItem("userLogin"));
    nameUser.textContent = user.nombre;
};

//Evento para el boton de logout
btnLogout.addEventListener("click", ()=>{
    localStorage.removeItem("userLogin");
    location.href = "../login.html"
});

//Evento para probar el campo de buscar
searchInput.addEventListener("keyup", ()=>{
    // console.log(searchInput.value);
    searchProductTable();
})

//Evento para el navegador
d.addEventListener("DOMContentLoaded", ()=>{
    getTableData();
    getUser();

})

//Función para traer los datos de la base de datos a la tabla
let getTableData = async () => {
    let url = "http://localhost/backend-apiCrud/productos";
    try {
        let respuesta = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (respuesta.status === 204) {
            console.log("No hay datos en la base de datos");
            return;  // Si no hay datos, no seguimos ejecutando el código
        } else {
            let tableData = await respuesta.json();
            console.log(tableData);
            // Solo actualiza localStorage si se obtuvieron datos
            if (tableData && tableData.length > 0) {
                localStorage.setItem("datosTabla", JSON.stringify(tableData));
                renderTable(tableData);  // Llama a una función separada para renderizar la tabla
            }
        }
    } catch (error) {
        console.log(error);
    }
};

let renderTable = (tableData) => {
    // Vaciamos la tabla antes de agregar nuevas filas
    clearDataTable();
    tableData.forEach((dato, i) => {
        let row = d.createElement("tr");
        row.innerHTML = `
            <td>${i + 1}</td>
            <td>${dato.nombre}</td>
            <td>${dato.descripcion}</td>
            <td>${dato.precio}</td>
            <td>${dato.stock}</td>
            <td><img src="${dato.imagen}" width="100"></td>
            <td>
                <button id="btn-edit" onclick="editDataTable(${i})" type="button" class="btn btn-warning">
                    Editar
                </button>
                ${nameUser.textContent === "vendedor" ? "" : 
                `<button id="btn-delete" onclick="deleteDataTable(${i})" type="button" class="btn btn-danger">
                    Eliminar
                </button>`}
            </td>
        `;
        tablePro.appendChild(row);
    });
};


//Funcion para editar producto de la tabla
let editDataTable = (pos) => {
    let products = JSON.parse(localStorage.getItem("datosTabla")) || [];  // Verifica si hay datos en localStorage
    if (products.length === 0) {
        alert("No se encontraron productos en localStorage.");
        return;
    }
    let singleProduct = products[pos];
    localStorage.setItem("productEdit", JSON.stringify(singleProduct));  // Guarda el producto para editarlo
    location.href = "../crear-pro.html";  // Redirige al formulario de edición
};

//Función para borrar producto de la tabla
let deleteDataTable = (pos) => {
    let products = [];
    let productsSave = JSON.parse(localStorage.getItem("datosTabla"));
    if (productsSave != null) {
        products = productsSave;
    }
    let singleProduct = products[pos];
    // console.log("Producto a eliminar:" + singleProduct.nombre);
    let IDProduct = {
        id: singleProduct.id,
    }
    let confirmar = confirm(`¿Deseas eliminar el producto: ${singleProduct.nombre}?`);
    if(confirmar){
        //Llamar a la función para realizar peticion de eliminar
        sendDeleteProduct(IDProduct);
    }
}

//Función para realizar la petición de eliminar producto
let sendDeleteProduct = async (id) => {
    let url = "http://localhost/backend-apiCrud/productos";
    try{
        let respuesta = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(id)
        });
        if(respuesta.status === 406){
            alert("El ID enviado no fue admitido");
        }else {
            let mensaje = await respuesta.json();
            alert(mensaje.message)
            location.reload();
        }
    }catch (error){
        console.log(error);
    }
}

//Función para limpiar productos de la tabla y limpiar
let clearDataTable = ()=> {
    let rowTable = document.querySelectorAll("#table-pro > tbody > tr");
    // console.log(rowTable);
    rowTable.forEach((row) =>{
        row.remove()
    });
}

//Función para buscar productos de la tabla
let searchProductTable = () => {
    let products = JSON.parse(localStorage.getItem("datosTabla")) || [];  // Asegura que haya datos
    if (products.length === 0) {
        console.log("No hay productos para buscar.");
        return;
    }

    let textSearch = searchInput.value.toLowerCase();
    clearDataTable();

    let i = 0;
    for (let pro of products) {
        if (pro.nombre.toLowerCase().includes(textSearch)) {
            let row = d.createElement("tr");
            row.innerHTML = `
                <td>${i + 1}</td>
                <td>${pro.nombre}</td>
                <td>${pro.descripcion}</td>
                <td>${pro.precio}</td>
                <td>${pro.stock}</td>
                <td><img src="${pro.imagen}" width="100"></td>
                <td>
                    <button id="btn-edit" onclick="editDataTable(${i})" type="button" class="btn btn-warning">
                        Editar
                    </button>
                    ${nameUser.textContent === "vendedor" ? "" : 
                    `<button id="btn-delete" onclick="deleteDataTable(${i})" type="button" class="btn btn-danger">
                        Eliminar
                    </button>`}
                </td>
            `;
            tablePro.appendChild(row);
            i++;
        }
    }
};

