let cart = []
if(localStorage.cart != undefined){
    cart = JSON.parse(localStorage.cart)
}

const moreDiv = document.getElementById('more')
const main = document.querySelector('section')
const featuredDiv = document.querySelector('main')
const fHead = document.getElementById('f-head')
const typeBtn = document.getElementsByClassName('typeBtn')

const itemsNum = document.getElementById('itemsNum')
const totalPrice = document.getElementById('totalPrice')

let itemsNumLet = 0
let totalPriceLet = 0

const euro = "&euro;"
let currency = euro

let featured = []

function createTypes() {
    moreDiv.innerHTML = ''
    let link = "'"
    moreDiv.innerHTML += '<a href="index.html"><button class="typeBtn" onclick="load('+link+'main'+link+'); disableMore(); this.disabled=true">Featured</button></a>'

    types.forEach(type => {
        let name = type.charAt(0).toUpperCase()+ type.slice(1)
        moreDiv.innerHTML += '<a href="index.html"><button class="typeBtn" onclick="load('+link+type+link+'); disableMore(); this.disabled=true">'+name+'</button></a>'
    }); 
}

async function getTypes(x) {
    const response = await fetch(x)
    const data = await response.json()

    types = data
    types.sort()
    createTypes()
}

// ============
function colorIs(x){
    switch(x) {
        case 'blue':
            return '#093286'
          break;
        case 'white':
            return '#d3d3d3'
          break; 
        case 'black':
            return '#262626'
          break;   
        case 'brown':
            return '#432c1d'
          break;   
        case 'cyan':
            return '#5cc2c6'
          break; 
        case 'red':
            return '#a91f1f'
          break;  
        case 'green':
            return '#1c970f'
          break;   
        case 'orange':
            return '#d14b22'
          break;  
        case 'purple':
            return '#5e2191'
          break; 
        case 'grey':
            return '#8c8c8c'
          break; 
        default:
            return x
    }
}

const rgb2hex = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`

function createProduct(x) {
    const div = document.createElement("div")
    div.classList.add('product')

    const image = document.createElement("div")
    image.classList.add('image')
    if(x.isColorable){
        image.innerHTML += '<img src="img/' + x.img + '_'+x.color+'.png">'
    }else {
        image.innerHTML += '<img src="img/' + x.img + '.png">'
    }
    
    const box = document.createElement("div")
    box.classList.add('box')
    const text = document.createElement("div")
    text.classList.add('text')
    const btn = document.createElement("div")
    btn.classList.add('btn')
    text.innerHTML += "<h2>" + x.name + "</h2>"
    if(x.size != undefined && x.color != undefined){
        let colorName = x.color.charAt(0).toUpperCase()+ x.color.slice(1)

        text.innerHTML += "<h3>" + colorName + ', ' + x.size + "</h3>"
    }else if (x.size == undefined && x.color != undefined){
        let colorName = x.color.charAt(0).toUpperCase()+ x.color.slice(1)
        
        text.innerHTML += "<h3>" + colorName + "</h3>"
    }else if (x.size != undefined && x.color == undefined){
        text.innerHTML += "<h3>" + x.size + "</h3>"
    }
    
    if(x.discount == 0){text.innerHTML += "<h1>" + currency + x.price + "</h1>"}
    else{
        let priceDiscount = Math.ceil(x.price-x.price*x.discount)
        text.innerHTML += "<h1>" + currency + priceDiscount + " <s><sup>" + currency + x.price + "</sup></s></h1>"
    }
    div.appendChild(image)

    const settings = document.createElement("div")
    settings.classList.add('settings')

    if(x.isSizeable){
        const sizes = document.createElement("div")
        sizes.classList.add('sizes')

        x.sizes.forEach(size => {
            sizes.innerHTML += '<button class="sizeBtn">'+size+'</button>'
        });

        settings.appendChild(sizes)
    }

    if(x.isColorable){
        const colors = document.createElement("div")
        colors.classList.add('colors')

        x.colors.forEach(color => {
            colors.innerHTML += '<button style="background: linear-gradient(200deg, #dedede, #2a2a2a); background-color:'+colorIs(color)+'" class="colorBtn"></button>'
        });

        settings.appendChild(colors)
    }

    box.appendChild(settings)
    box.appendChild(text)
    box.appendChild(btn)
    
    const tooltip = document.createElement("span")
    tooltip.classList.add('tooltip')
    tooltip.innerHTML += "Must choose a size"

    btn.appendChild(tooltip)

    const amount = document.createElement("span")
    amount.classList.add('amount')
    amount.innerHTML += '<button class="minusBtn">'+'-'+'</button>'
    amount.innerHTML += '<input type="number" class="amountInput" min="0" max="10000">'
    amount.innerHTML += '<button class="plusBtn">'+'+'+'</button>'

    btn.innerHTML += '<button class="cartBtn">Remove from Cart</button>'

    btn.appendChild(amount)

    div.appendChild(box)

    main.appendChild(div)
}

function updateCartInfo(x) {
    totalPriceLet = 0
    itemsNumLet = 0
    
    x.forEach(element => {
        let tempPrice = Math.floor(element.price-element.price*element.discount)*element.number
        totalPriceLet += tempPrice

        itemsNumLet += element.number
    })

    totalPrice.innerHTML = 'Total price: ' + currency + totalPriceLet
    itemsNum.innerHTML = 'Number of items: ' + itemsNumLet
}

function removeFromCart(x) {
    let index = cart.indexOf(x)

    if(index > 0){
        cart.splice(index, index)
    }else {
        cart.shift()
    }
    

    //console.log(cart.splice(index, index))

    //console.log(cart)
    localStorage.setItem("cart", JSON.stringify(cart))

    getProducts(cart)
}

function checkDuplicates() {
    cart.forEach(x => {
        for (let i = cart.indexOf(x)+1; i < cart.length; i++){
            //console.log(x.size, cart[i].size)
            if(x.name == cart[i].name) {
                if(x.size == cart[i].size || x.size == undefined) {
                    if(x.color == cart[i].color || x.color == undefined){
                        x.number+=cart[i].number
                        console.log(x.color, cart[i].color)
                        cart.splice(i, i)
                    }
                }
            }
        }
    })
}

function feature(x) {
    featured = []

    products.forEach(product => {
        featured.push(product)
    }); 
    
    draw(featured)
}

function draw(x) {
    main.innerHTML = ""
    
    x.forEach(product => {
        createProduct(product)
    }); 

    updateCartInfo(x)

    if(x.length < 1) {
        main.innerHTML = "<h1>No products in the cart yet :)</h1>"
    }

    let sizeable = []
    let colorable = []

    const cartBtn = document.getElementsByClassName("cartBtn")
    const colorBtn = document.getElementsByClassName("colorBtn")
    const sizes = document.getElementsByClassName("sizes")
    const colors = document.getElementsByClassName("colors")
    for(let i = 0; i < featured.length; i++){
        cartBtn[i].addEventListener("click", function(){removeFromCart(featured[i])});
        if(featured[i].isSizeable && featured[i].size == undefined){
            cartBtn[i].disabled = true
            cartBtn[i].parentElement.classList.add('disabled')
        }if(featured[i].isSizeable){
            sizeable.push(featured[i])
        }if(featured[i].isColorable){
            colorable.push(featured[i])
        }
    }

    for(let i = 0; i < sizeable.length; i++){
        for(let j = 0; j < sizes[i].childNodes.length; j++){
            if(sizeable[i].size == sizes[i].childNodes[j].innerText){
                sizes[i].childNodes[j].disabled = true
            }

            sizes[i].childNodes[j].addEventListener("click", function(){
                sizeable[i].size = sizeable[i].sizes[j]
                for(let k = 0; k < sizes[i].childNodes.length; k++){
                    sizes[i].childNodes[k].disabled = false
                }
                sizes[i].childNodes[j].disabled = true

                for(let i = 0; i < featured.length; i++){
                    if(featured[i].sizes != undefined && featured[i].size != undefined){
                        cartBtn[i].disabled = false
                        cartBtn[i].parentElement.classList.remove('disabled')
                    }
                }

                checkDuplicates()
                localStorage.setItem("cart", JSON.stringify(cart))

                getProducts(cart)
                //console.log(sizeable[i].size)
            });
        }
    }

    for(let i = 0; i < colorable.length; i++){
        for(let j = 0; j < colors[i].childNodes.length; j++){
            if(colorIs(colorable[i].color) == rgb2hex(colors[i].childNodes[j].style.backgroundColor)){
                colors[i].childNodes[j].disabled = true
            }

            colors[i].childNodes[j].addEventListener("click", function(){
                colorable[i].color = colorable[i].colors[j]
                for(let k = 0; k < colors[i].childNodes.length; k++){
                    colors[i].childNodes[k].disabled = false
                }
                colors[i].childNodes[j].disabled = true
                colors[i].parentElement.childNodes[0].innerHTML = '<img src="img/' + colorable[i].img + '_'+colorable[i].color+'.png">'

                checkDuplicates()
                localStorage.setItem("cart", JSON.stringify(cart))

                getProducts(cart)
                //console.log(colorIs(colorable[i].color), rgb2hex(colors[i].childNodes[j].style.backgroundColor))
            });
        }
    }

    const plusBtn = document.getElementsByClassName("plusBtn")
    const minusBtn = document.getElementsByClassName("minusBtn")
    const amountInput = document.getElementsByClassName("amountInput")

    console.log(amountInput)

    for(let i = 0; i < amountInput.length; i++){
        amountInput[i].value = x[i].number

        console.log(x[i].number)
        
        amountInput[i].addEventListener("change", function(){
            if(amountInput[i].value > 0){
                x[i].number = amountInput[i].value
            }else if(amountInput[i].value <= 0){
                amountInput[i].value = 1
                x[i].number = 1
            }

            checkDuplicates()
            localStorage.setItem("cart", JSON.stringify(cart))

            getProducts(cart)
        });
    }

    for(let i = 0; i < plusBtn.length; i++){
        plusBtn[i].addEventListener("click", function(){
            x[i].number++
            amountInput[i].value = x[i].number

            checkDuplicates()
            localStorage.setItem("cart", JSON.stringify(cart))

            getProducts(cart)
        });
    }

    for(let i = 0; i < minusBtn.length; i++){
        minusBtn[i].addEventListener("click", function(){
            if(x[i].number > 1){
                x[i].number--
                amountInput[i].value = x[i].number

                checkDuplicates()
                localStorage.setItem("cart", JSON.stringify(cart))

                getProducts(cart)
            }
        });
    }
}

async function getProducts(x) {
    products = x
    products.forEach(product => {
        if(product.sizes != undefined){
            product.isSizeable = true
        }else{product.isSizeable = false}
    });
    products.forEach(product => {
        if(product.colors != undefined){
            product.isColorable = true
        }else{product.isColorable = false}
    });
    
    feature(cart)
}

// ============

getTypes('./types.json')
getProducts(cart)
