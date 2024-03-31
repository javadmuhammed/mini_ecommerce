


let addToCartBtn = document.getElementsByClassName("addToCartBtn");


function addToCart(e) { 
    let productId = e.target.getAttribute("data-product-id")
    let cartData = {
        url: "/add-cart",
        method: "POST",
        data: {productId},
        beforeSend:function(){
            alert("Before Send")
        },
        success:function(data){
            console.log(data)
            alert("success")
        },
        error:function(err){
            console.log(err)
            alert("ERROR")
        }
    }

    $.ajax(cartData);
}


for (let i = 0; i < addToCartBtn.length; i++) {
    addToCartBtn[i].addEventListener("click", addToCart)
}