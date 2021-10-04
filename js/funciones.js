//INTERFAZ
function productosUI(bebidas, id){
  $(id).empty();
  for (const bebida of bebidas) {
     $(id).append(` <div class="card" style="width: 24rem;">
                      <img src="${bebida.imagen}" class="card-img-top" alt="...">
                      <div class="card-body">
                        <h5 class="card-title">${bebida.nombre}</h5>
                        <p class="card-text">Precio: $${bebida.precio}</p>
                        <a href="#" id='${bebida.id}' class="btn btn-primary btn-compra">Agregar al carrito</a>
                        
                    </div>
                      `);
  }
  $('.btn-compra').on("click", comprarProducto);
}

function comprarProducto(e){
  e.preventDefault();
  e.stopPropagation();

  const idProducto   = e.target.id;
  const seleccionado = carrito.find(p => p.id == idProducto);

  if(seleccionado == undefined){
    carrito.push(bebidas.find(b => b.id == idProducto));
  }else{
    seleccionado.agregarCantidad(1);
  }

  localStorage.setItem("CARRITO",JSON.stringify(carrito));
  carritoUI(carrito);
}
//CARRITO
function carritoUI(bebidas){
  
  $('#carritoCantidad').html(bebidas.length);
  $('#carritoProductos').empty();
  for (const bebida of bebidas) {
    $('#carritoProductos').append(registroCarrito(bebida));
  }
  $('#carritoProductos').append(`<p id="totalCarrito"> TOTAL $${totalCarrito(bebidas)}</p>`);
  $('#carritoProductos').append('<div id="divConfirmar" class="text-center"><button id="btnConfimar" class="btn btn-success">CONFIRMAR COMPRA</button></div>')

  $('.btn-delete').on('click', eliminarCarrito);
  $('.btn-add').click(addCantidad);
  $('.btn-sub').click(subCantidad);
  $('#btnConfimar').click(confirmarCompra);
}
// ESTRUCTURA DEL CARRITO
function registroCarrito(bebida){
  return `<p> ${bebida.nombre} 
            <span class="badge badge-warning">$${bebida.precio}</span>
            <span class="badge badge-dark">${bebida.cantidad}</span>
            <span class="badge badge-success"> $ ${bebida.subtotal()}</span>
            <a id="${bebida.id}" class="btn btn-info    btn-add">+</a>
            <a id="${bebida.id}" class="btn btn-warning btn-sub">-</a>
            <a id="${bebida.id}" class="btn btn-danger  btn-delete">Eliminar del carrito</a>
          </p>`
}

function eliminarCarrito(e){
  
  let posicion = carrito.findIndex(b => b.id == e.target.id);
  carrito.splice(posicion, 1);
  
  carritoUI(carrito);
  localStorage.setItem("CARRITO",JSON.stringify(carrito));
}
//AGREGAR 
function addCantidad(){
  let bebida = carrito.find(b => b.id == this.id);
  bebida.agregarCantidad(1);
  $(this).parent().children()[1].innerHTML = bebida.cantidad;
  $(this).parent().children()[2].innerHTML = bebida.subtotal();
  $("#totalCarrito").html(`TOTAL ${totalCarrito(carrito)}`);
  localStorage.setItem("CARRITO",JSON.stringify(carrito));
}
//RESTAR 
function subCantidad(){
  let bebida = carrito.find(p => p.id == this.id);
  if(bebida.cantidad > 1){
    bebida.agregarCantidad(-1);
    let registroUI = $(this).parent().children();
    registroUI[1].innerHTML = bebida.cantidad;
    registroUI[2].innerHTML = bebida.subtotal();
    $("#totalCarrito").html(`TOTAL ${totalCarrito(carrito)}`);
    localStorage.setItem("CARRITO",JSON.stringify(carrito));
  }
}
//SELECT
function selectUI(lista, selector){
 
  $(selector).empty();
  lista.forEach(element => {
      $(selector).append(`<option value='${element}'>${element}</option>`);
  });
  $(selector).prepend(`<option value='TODOS' selected>TODOS</option>`);
}
//PRECIO TOTAL 
function totalCarrito(carrito){
  console.log(carrito);
  let total = 0;
  carrito.forEach(p => total += p.subtotal());
  return total;
}
function confirmarCompra(){
  //OCULTAR EL BOTON
  $('#btnConfimar').hide();
  //AÑADIR SPINNER
  $('#divConfirmar').append(`<div class="spinner-border text-success" role="status">
                              <span class="sr-only">Loading...</span>
                            </div>`);
  console.log("ENVIAR AL BACKEND");
  //REALIZAMOS LA PETICION POST
  //const URLPOST = '/compra.php';
  const URLPOST = 'https://jsonplaceholder.typicode.com/posts';
  //INFORMACION A ENVIAR
  const DATA   = {productos: JSON.stringify(carrito), total: totalCarrito(carrito)}
  //PETICION POST CON AJAX
  $.post(URLPOST, DATA,function(respuesta,estado){
      
      if(estado == 'success'){
        
        
        $("#notificaciones").html(`<div class="alert alert-sucess alert-dismissible fade show titulos" role="alert">
                    <strong>COMPRA CONFIRMADA!</strong> Comprobante Nº ${respuesta.id}.
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                    </div>`).fadeIn().delay(2000).fadeOut('');
        //VACIAR CARRITO;
        carrito.splice(0, carrito.length);
        //SOBREESCRIBIR ALMACENADO EN STORAGE
        localStorage.setItem("CARRITO",'[]');
        //VACIAR CONTENIDO DEL MENU
        $('#carritoProductos').empty();
        //VOLVER INDICADOR A 0
        $('#carritoCantidad').html(0);
      }
  });
}