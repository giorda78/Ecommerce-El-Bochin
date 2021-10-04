$(document).ready(function () {
    if("CARRITO" in localStorage){
        const arrayLiterales = JSON.parse(localStorage.getItem("CARRITO"));
        if(arrayLiterales.length > 0){
            for (const literal of arrayLiterales) {
                carrito.push(new Bebida(literal.id, literal.nombre, literal.precio, literal.categoria, literal.cantidad));
            }
            
            carritoUI(carrito);
        }
    }
    $(".dropdown-menu").click(function (e) { 
        e.stopPropagation();
    });
    //CARGA DE JSON
    $.get('data/producto.json',function(datos, estado){
        console.log(datos);
        console.log(estado);
        if(estado == 'success'){
            for (const literal of datos) {
                bebidas.push(new Bebida(literal.id, literal.nombre, literal.precio, literal.categoria, literal.cantidad, literal.imagen));
            }
        }
        console.log(bebidas);
        //GENERAR INTERFAZ DE PRODUCTOS CON UNA FUNCION
        productosUI(bebidas, '#productosContenedor');
    });
});
//ANIMACION
window.addEventListener('load',()=>{
    //ELIMINAR ELEMENTO DEL DOM
    $('#indicadorCarga').remove();
    //MOSTRAR ELEMENTO CON UN FADE
    $('#productosContenedor').fadeIn("slow");
})

//PRODUCTOS
productosUI(bebidas, '#productosContenedor');

//FILTRAR 
selectUI(categorias,"#filtroCategorias");

$('#filtroCategorias').change(function (e) { 
  
const value = this.value;
    
$('#productosContenedor').fadeOut(600,function(){
        
     if(value == 'TODOS'){
         productosUI(bebidas, '#productosContenedor');
     }else{
        const filtrados = bebidas.filter(bebida => bebida.categoria == value);
       productosUI(filtrados, '#productosContenedor');
    }
        $('#productosContenedor').fadeIn();
    });
});
//EVENTO BUSQUEDA
$("#busquedaProducto").keyup(function (e) { 
    const criterio = this.value.toUpperCase();
    console.log(criterio);
    if(criterio != ""){
                                                       
        const encontrados = bebidas.filter(p =>       p.nombre.includes(criterio.toUpperCase()) 
                                                    || p.categoria.includes(criterio.toUpperCase()));
        productosUI(encontrados, '#productosContenedor');
    }
});
//FILTRO DE PRECIO
$(".inputPrecio").change(function (e) { 
    const min = $("#minProducto").val();
    const max = $("#maxProducto").val();
    if((min > 0) && (max > 0)){
                                                 //el resulado de esto es verdadero
        const encontrados = bebidas.filter(b => b.precio >= min && p.precio <= max);
        productosUI(encontrados, '#productosContenedor');
    }
});
