$(document).ready(function(){ 
    console.log(window.location)
//Displaying grid of products on the homepage
    $.getJSON("https://api.npoint.io/4aaf9c6c8d8f688edec0", function(data) {
       //checking state of the data
        if(window.location.pathname == '/WebProject2020_Y2/' || window.location.pathname == '/' ) {
            console.log('Index Page');
            indexPage(data)
        }
        else if (window.location.pathname == '/WebProject2020_Y2/pages/product.html') {
            console.log('Product Page');
            productPage(data)
        }
        else if (window.location.pathname == '/WebProject2020_Y2/pages/cart.html') {
            console.log('on Cart Page')
            cartPage(data)
        }
        else if (window.location.path == '/WebProject2020_Y2/pages/shop.html') {
            console.log('on Shop Page')
        }
        else if (window.location.pathname == '/WebProject2020_Y2/pages/pay.html') {
            console.log('checkout')
            checkoutPage(data)
        }else if (window.location.pathname == '/WebProject2020_Y2/pages/shop.html') {
            console.log('shop')
            shopPage(data)
        }
})})

//Index Page
function indexPage(data) {
    //clearing localStorage 
    localStorage.setItem('product', null)
    console.log('indexpage!')
    let productGridRenderArea = $('#products .row');
    console.log(productGridRenderArea)
    //renering each element to the screen as a product cart
    data.map(element => {
        let product  = `
         <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6">
             <div class="card">
             <img src="${element.image}" class="card-img-top" alt="...">
                 <div class="card-body">
                     <h4 class="card-text">${element.name}</h4>
                     <p><span>€</span>${element.price}</p>
                     <button data-item-id="${element.productId}" type="button" name=${element.productId} class="btn btn-outline-dark">View Options</button>
                 </div>
             </div>
         </div>
         `
        productGridRenderArea.append(product)

        let bbtn = document.querySelectorAll(".btn")
        const buttons = Array.from(bbtn)
                        buttons.map(element => { element.addEventListener("click", (event => {
                        //assiging the clicked product to localStorage so we know what to render on product page
                        localStorage.setItem('product', `${event.target.name}`)
                        window.location.href = '/WebProject2020_Y2/pages/product.html'
                        }
                    )
                )
            }
        )   
    })
}
//Product Page
function productPage(data) {
    console.log('state: ', localStorage.getItem('product'))
    const productPageRenderArea = $('#product-display .row')

    const currentProduct = localStorage.getItem('product')
    //filtering JSON and getting only the information for the product page
    let product  = data.filter(prod => {return prod.productId === currentProduct})
    //filtering simiar products all but the one currently being viewed 
    let similarProductData = data.filter(prod => {return prod.productId != currentProduct})
   
   console.log(product)
   console.log(similarProductData)
   //page template
   let productPageInfo = `
            <div class="col">
                <img src="${product[0].image}" alt="">
            </div>
            <div class="col" id="product-descp">
                <h1>${product[0].name}</h1>
                <h5>€ ${product[0].price}</h5>
                <article><p>${product[0].description}</p></article>
                <div class="option-input">
                <label>Storage</label>
                <select id="storage-option">
                ${product[0].options.storage.map(o => {
                    return `<option value=${o}>${o}</option>`
                })}
                </select>
                </div>
                <div class="option-input">
                <label>Colour</label>
                <select id="color-option">
                ${product[0].options.color.map(o => {
                    return `<option value=${o}>${o}</option>`
                })}
                </select>
                </div>
                <button name="${product[0].productId}" onclick="addToCart()" type="button" class="btn btn-secondary btn-lg" id="add-to-card">Add to card</button>
            </div>`

    let simiarProductRenderArea = $('#products-similar .row')
    for( let i=0; i<4; i++) {
        //renderig 4 products  
        let similarProduct  = ` 
            <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6">         
                <div class="card">
                    <img src="${similarProductData[i].image}" class="card-img-top" alt="...">
                    <div class="card-body">
                    <p class="card-text">${similarProductData[i].name}</p>
                    <p>€ ${similarProductData[i].price}</p>
                    <button name="${similarProductData[i].productId}" type="button" class="btn btn-outline-dark">View Options</button>
                </div>
                </div>`
            simiarProductRenderArea.append(similarProduct)
    }
    productPageRenderArea.append(productPageInfo)

    let bbtn = document.querySelectorAll(".btn.btn-outline-dark")
    const buttons = Array.from(bbtn)
                    buttons.map(element => { element.addEventListener("click", (event => {
                    //assiging the clicked product to localStorage so we know what to render on product page
                    localStorage.setItem('product', `${event.target.name}`)
                    window.location.href = '/WebProject2020_Y2/pages/product.html'
                    }
                )
            )
        }
    )
}
function gotoCart() {
    window.location.href = '/WebProject2020_Y2/pages/cart.html'
}
//user Login and Logout
function userLogin() {
    //reading values from the form
    let inputedLogin = document.getElementById('login').value
    let inputedPassword = document.getElementById('password').value
    //validating login details to one provided
    if(inputedLogin === 'guest@byteiphone.ie' && inputedPassword === 'admin1') {
        localStorage.setItem('loggedIn', true)
        window.location.href = '/WebProject2020_Y2/' //redirect to home
       
    } else {
        localStorage.setItem('loggedIn', false)
        document.getElementById('login-failed').classList.remove('hidden')
        document.getElementById('login-failed').classList.add('show')
    }
}
//Loging out functionality
function userLogout() {
    localStorage.setItem('loggedIn', false)
    window.location.href = '/WebProject2020_Y2/'
}

//check if user is loggedin and assiging it to a variable
let loginStatus  = localStorage.getItem('loggedIn')
//Changing login button itno a greeting 
if(loginStatus == 'true') {
    document.getElementsByClassName('login-item')[0].innerHTML = "Hi, Guest"
}
//front-end changes to login form depending on the state of users login
if(window.location.pathname == '/WebProject2020_Y2/pages/login.html' && loginStatus == 'true') {
    document.getElementById('already-loggedin').classList.remove('hidden')
    document.getElementById('signupform').classList.add('hidden')
    document.getElementById('already-loggedin').classList.add('show')
}

//check if cart is empty of something is remaing after the last visit
if(localStorage.getItem('itemsArray') == null || localStorage.getItem('itemsArray') == 'null') {
    //if it's empty initiate new array and set count to 0
   productsInCart = new Array
} else {
    productsInCart = JSON.parse(localStorage.getItem('itemsArray'))
}

function addToCart() {
    let storageOption = document.getElementById('storage-option').value
    let colorOption = document.getElementById('color-option').value
    
    let currentProduct=localStorage.getItem('product')
    let addedToCart = {
        "id":currentProduct,
        "storage": storageOption,
        "color":colorOption
    }
    productsInCart.push(addedToCart)

    let cartCount = productsInCart.length
    localStorage.setItem('ccount', cartCount)
    document.getElementById('cart-count').innerHTML = parseInt(localStorage.getItem('ccount'))

    //filtering JSON and getting only the information for the product page
    localStorage.setItem("itemsArray", JSON.stringify(productsInCart))
    console.log('tyle =>',localStorage.getItem('itemsArray'))
}

function checkCartCount() {
    //if localstorage has no items in cart 0 the displayed number
    if(localStorage.getItem('itemsArray') == null) { 
        document.getElementById('cart-count').innerHTML = 0
        document.getElementById('cart-count-checkout').innerHTML = 0
        
    } else {
        //set counter to the localstorage record
        document.getElementById('cart-count').innerHTML =  JSON.parse(localStorage.getItem('itemsArray')).length
        document.getElementById('cart-count-checkout').innerHTML =  JSON.parse(localStorage.getItem('itemsArray')).length
    }
}

function cartPage(data) {
    productsInCart = JSON.parse(localStorage.getItem('itemsArray'))
    console.log('d', productsInCart)
    let cartTotal = 0;
    let cartRenderArea = $('#cart-list')
   
    productsInCart.forEach(item => {
         let foundProduct = data.find(product => product.productId === item.id)
         let cartItem = `<div class="card">
        <h5 class="card-header">${foundProduct.name}</h5>
        <div class="card-body">
            <h5 class="card-title">€ ${foundProduct.price}</h5>
                <p class="card-text">${item.storage} / ${item.color}</p>
            </div>
        </div>`
        cartRenderArea.append(cartItem)
         cartTotal += parseInt(foundProduct.price)
         document.getElementById('total-value').innerHTML = cartTotal
    });
    //calculate cart total
    if(cartTotal != 0) {
        localStorage.setItem('orderTotal', cartTotal)
    }
    if(localStorage.getItem('loggedIn') === 'false') {
        document.getElementById('pay-now').classList.add('hidden')
        document.getElementById('login-cart-notification').classList.add('show')
    } 
    else if (localStorage.getItem('loggedIn') === 'true') {
        document.getElementById('pay-now').classList.add('show')
        document.getElementById('login-cart-notification').classList.add('hidden')
    }
}

function clearCart() {
    localStorage.setItem('itemsArray', null)
    window.location.href='/WebProject2020_Y2/'
    //TODO display a sucess messgae about clearing the cart
}
//check cart count and update on every page
checkCartCount()

function checkout() {
    window.location.href='/WebProject2020_Y2/pages/pay.html'
}
function checkoutPage(data) {
    //checking if user is logging when accessing the page
    if(localStorage.getItem('loggedIn') === 'true') {
        //reading the contents of the cart
        productsInCart = JSON.parse(localStorage.getItem('itemsArray'))
        //initinating total
        let cartTotal = 0;
        //render element
        let orderListRenderArea = $('#summary-list')
        //rendering a list of items in cart on the checkout page
        productsInCart.forEach(item => {
            let foundProduct = data.find(product => product.productId=== item.id)
            let orderItem = ` <li class="list-group-item d-flex justify-content-between lh-condensed">
            <div>
              <h6 class="my-0">${foundProduct.name}</h6>
              <small class="text-muted">Brief description</small>
            </div>
            <span class="text-muted">${foundProduct.price}</span>
          </li>`
          //updating total
          cartTotal += parseInt(foundProduct.price)
          //updating list of items in the order
          orderListRenderArea.append(orderItem)
       });
       //prepopulatin data for checkout form
       document.getElementById('firstName').value  = 'Guest';
       document.getElementById('lastName').value  = 'byteiPhone';
       document.getElementById('email').value  = 'guest@byteiphone.com';
       document.getElementById('address').value  = '8 Moy Valley Rd';
       document.getElementById('country').value  = 'Ireland';
       document.getElementById('state').value  = 'Sligo';
       document.getElementById('zip').value  = 'F22 X090';
     
       //displaying total of the order
       let totalLI = `
       <li class="list-group-item d-flex justify-content-between">
       <span>Total (EUR)</span>
       <strong>${cartTotal}</strong>
       </li>`
        orderListRenderArea.append(totalLI)
    } else {
        const checkoutErrorMessage = `
        <div class="content-wrap">
            <h1>You are not logged in</h1>
            <p>You can only access this page when logged in<br>
            <a href="/pages/login.html">Login</a> here</p>
        </div>
        `

        let renderArea = document.getElementById('card-list');
        renderArea.innerHTML = checkoutErrorMessage
    }

    
}
function payment() {
    const successMessage = `
    <div class="row">
        <div class="order-success">
            <h1>Thank you for your order</h1>
            <h3>Payment has been completed. Your order is now Processing. We will be in touch with updates via email</h3>
            <p>Thank you for shopping with us</p>
        </div>
    </div>
    `
    var ccRegex = /^(?:[3-6]{1}[0-9]{15})$/;

    let ccNumberToBeValidated = document.getElementById('cc-number').value
    if(ccNumberToBeValidated.match(ccRegex)) {
        localStorage.setItem('orderTotal', null)
        localStorage.setItem('itemsArray', null)
        let cardContent = document.getElementById('card-list')
    }
    else {
        window.alert('Your credit card number does not seem to be valid: Valid Credit number must be 16 digits long and start with a digit between 3-6')
    }
    
  
    
    //TODO Sucess Message on home page or redirect to the thank you page
    
    
    
    
    cardContent.innerHTML = successMessage
}

function shopPage(data) {
    console.log('shoppage!')
    let productGridRenderArea = $('#product-grid .row');
    console.log(productGridRenderArea)
    //renering each element to the screen as a product cart
    data.map(element => {
        let product  = `
         <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6">
             <div class="card">
             <img src="${element.image}" class="card-img-top" alt="...">
                 <div class="card-body">
                     <h4 class="card-text">${element.name}</h4>
                     <p><span>€</span>${element.price}</p>
                     <button data-item-id="${element.productId}" type="button" name=${element.productId} class="btn btn-outline-dark">View Options</button>
                 </div>
             </div>
         </div>
         `
        productGridRenderArea.append(product)

        let bbtn = document.querySelectorAll(".btn")
        const buttons = Array.from(bbtn)
                        buttons.map(element => { element.addEventListener("click", (event => {
                        //assiging the clicked product to localStorage so we know what to render on product page
                        localStorage.setItem('product', `${event.target.name}`)
                        window.location.href = '/WebProject2020_Y2/pages/product.html'
                        }
                    )
                )
            }
        ) 
    })
}
