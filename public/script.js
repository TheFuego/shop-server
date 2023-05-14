let products
let categories
let featured = []
let cart = []
let notDis = []
let featuredCategory
let disValue = document.getElementById("discounted").checked
let minValue = document.getElementById("min").value
let maxValue = document.getElementById("max").value
if(localStorage.cart != undefined){
    cart = JSON.parse(localStorage.cart)
}
const main = document.querySelector('section')
const featuredDiv = document.querySelector('main')
const aside = document.getElementById('list')
const moreDiv = document.getElementById('more')
const cartNum = document.getElementById('cartNum')
const fHead = document.getElementById('f-head')
const typeBtn = document.getElementsByClassName('typeBtn')
const sideB = document.querySelector('aside')
cartNum.innerText = cart.length

const euro = "&euro;"
let currency = euro

let isMain

let optionValue = document.getElementById("sort").value


// ==============

function addToCart(x) {
    if(cart.length > 0){
        cart = JSON.parse(localStorage.cart)
        let xPair
    
        cart.forEach(product => {
            if(x.name == product.name) {
                if(x.size == product.size || x.size == undefined) {
                    if(x.color == product.color || x.color == undefined){
                        xPair = product
                    }
                }
            }
        })

        console.log(xPair)

        if(xPair != undefined){
            if(xPair.number == undefined){
                xPair.number = 1
                cart.push(xPair)
            }if(xPair.number != undefined){
                cart.forEach(product => {
                    if(xPair.name == product.name) {
                        if(xPair.color == product.color || xPair.color == undefined) { 
                            if(xPair.size == product.size || xPair.size == undefined) {
                                product.number ++
                            }
                        }
                    }
                })
            }
        }else if(xPair == undefined){
            x.number = 1
            cart.push(x)
        }
    }if(cart.length == 0){
        x.number = 1
        cart.push(x)
    }

    //alert(featured.indexOf(x)

    cartNum.innerText = cart.length
    localStorage.setItem("cart", JSON.stringify(cart))

    const tooltipClass = document.getElementsByClassName('tooltip')
    tooltipClass[featured.indexOf(x)].innerHTML = 'Item added to cart!'
    tooltipClass[featured.indexOf(x)].classList.add('tooltip-bought')

    setTimeout(function () {
        tooltipClass[featured.indexOf(x)].classList.remove('tooltip-bought')
    }, 2000)

   
}

function clearCart() {
    cart = []
    localStorage.clear()

    cartNum.innerText = cart.length
}

// ==============

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
    if(x.discount == 0){text.innerHTML += "<h1>" + currency + x.price + "</h1>"}
    else{
        let priceDiscount = Math.ceil(x.price-x.price*x.discount)
        text.innerHTML += "<h1>" + currency + priceDiscount + " <s><sup>" + currency + x.price + "</sup></s></h1>"
    }
    div.appendChild(image)
    box.appendChild(text)
    box.appendChild(btn)
    
    if(x.isSizeable){
        const sizes = document.createElement("div")
        sizes.classList.add('sizes')

        x.sizes.forEach(size => {
            sizes.innerHTML += '<button class="sizeBtn">'+size+'</button>'
        });

        div.appendChild(sizes)
    }

    if(x.isColorable){
        const colors = document.createElement("div")
        colors.classList.add('colors')

        x.colors.forEach(color => {
            colors.innerHTML += '<button style="background: linear-gradient(200deg, #dedede, #2a2a2a); background-color:'+colorIs(color)+'" class="colorBtn"></button>'
        });

        div.appendChild(colors)
    }
    
    const tooltip = document.createElement("span")
    tooltip.classList.add('tooltip')
    tooltip.innerHTML += "Must choose a size"

    btn.appendChild(tooltip)

    btn.innerHTML += '<button class="cartBtn">Add to Cart</button>'

    div.appendChild(box)

    main.appendChild(div)
}

function createCategories() {
    aside.innerHTML = ''
    let link = "'"

    categories.forEach(category => {
        let name = category.charAt(0).toUpperCase()+ category.slice(1)
        aside.innerHTML += '<button class="cat" onclick="feature('+link+category+link+')">'+name+'</button>'
    }); 

    aside.innerHTML += '<button class="cat" onclick="feature('+link+'all'+link+')">All</button>'
    
    //aside.appendChild(list)
}

function createTypes() {
    moreDiv.innerHTML = ''
    let link = "'"
    moreDiv.innerHTML += '<button class="typeBtn" onclick="load('+link+'main'+link+'); disableMore(); this.disabled=true">Featured</button>'

    types.forEach(type => {
        let name = type.charAt(0).toUpperCase()+ type.slice(1)
        moreDiv.innerHTML += '<button class="typeBtn" onclick="load('+link+type+link+'); disableMore(); this.disabled=true">'+name+'</button>'
    }); 

    //aside.appendChild(list)
}

function disableMore() {
    for (let i = 0; i < typeBtn.length; i++){
        typeBtn[i].disabled = false
    }    
}

// ==============

function sortPriceA(){

    featured.sort((a, b)=> {
        let priceA = a.price - a.price*a.discount; let priceB = b.price - b.price*b.discount;
        
        if (priceA < priceB) {
            return 1
        }else {
            return -1
        }
    });

    draw(featured)
}

function sortPriceC(){
    featured.sort((a, b)=> {
        let priceA = a.price - a.price*a.discount; let priceB = b.price - b.price*b.discount;
        
        if (priceA > priceB) {
            return 1
        }else {
            return -1
        }
    });

    draw(featured)
}

function sortABC(){
    featured.sort((a, b)=> {
        if (a.name > b.name) {
            return 1
        }else {
            return -1
        }
    });

    draw(featured)
}

function sort() {
    optionValue = document.getElementById("sort").value

    if(optionValue == 1) {
        sortPriceA()
    }if(optionValue == 2) {
        sortPriceC()
    }if(optionValue == 3) {
        sortABC()
    }
}

function updatePrice() {
    minValue = document.getElementById("min").value
    maxValue = document.getElementById("max").value
}

function searchPrice() {
    minValue = document.getElementById("min").value
    maxValue = document.getElementById("max").value

    feature(featuredCategory)
    const searchFt = [...featured]
    
    featured = []

    searchFt.forEach(product => {
        let tempPrice = product.price - product.price*product.discount
        if(tempPrice > minValue && tempPrice < maxValue)
        featured.push(product)
    });

    disValue = document.getElementById("discounted").checked
    if(disValue){
        searchDiscount()
    }

    sort()
    
    draw(featured)
}

function searchName() {
    searchValue = document.getElementById("searchBar").value

    feature(featuredCategory)
    const searchFtB = [...featured]
    
    featured = []

    searchFtB.forEach(product => {
        let splitNames = product.name.toUpperCase().split(" ");
        splitNames.forEach(name => {
            if(searchValue.toUpperCase() == name){
                featured.push(product)
            }
        })

        if(product.keywords != undefined){
            product.keywords.forEach(keyword => {
                let splitKeywords = keyword.toUpperCase().split(" ");
                splitKeywords.forEach(name => {
                    if(searchValue.toUpperCase() == keyword.toUpperCase()){
                        featured.push(product)
                        console.log(searchValue.toUpperCase(), keyword)
                    }
                })
            })
        }
    });

    disValue = document.getElementById("discounted").checked
    if(disValue){
        searchDiscount()
    }

    sort()
    
    draw(featured)
}

function searchDiscount() {
    disValue = document.getElementById("discounted").checked
    //console.log(disValue)

    if(disValue){
        for (let j = 0; j < featured.length; j++) {
            for (let i = 0; i < featured.length; i++) {
                if(featured[i].discount == 0){
                    featured.splice(i, 1)
                    featured.sort
                }    
            }
        }
    }if(!disValue){
        feature(featuredCategory)
    }

    sort()
    
    draw(featured)
}

// ==============

function feature(x) {
    featured = []
    featuredCategory = x

    if(x != "all"){
        products.forEach(product => {
            if(product.category == x){
                featured.push(product)
            }
        }); 
    }if(x == "all"){
        products.forEach(product => {
            featured.push(product)
        });
    }
    
    if(!isMain){
        disValue = document.getElementById("discounted").checked
        if(disValue){
            searchDiscount()
        }
    
        if(minValue != '' && maxValue != ''){
            const searchFt = [...featured]
        
            featured = []
    
            searchFt.forEach(product => {
                let tempPrice = product.price - product.price*product.discount
                if(tempPrice > minValue && tempPrice < maxValue)
                featured.push(product)
            });
        }
    }
    

    sort()
    
    draw(featured)
}

function draw(x) {
    main.innerHTML = ""
    
    x.forEach(product => {
        createProduct(product)
    }); 

    if(x.length < 1) {
        main.innerHTML = "<h1>No products match this criteria :(</h1>"
    }

    let sizeable = []
    let colorable = []

    const cartBtn = document.getElementsByClassName("cartBtn")
    const colorBtn = document.getElementsByClassName("colorBtn")
    const sizes = document.getElementsByClassName("sizes")
    const colors = document.getElementsByClassName("colors")
    for(let i = 0; i < featured.length; i++){
        cartBtn[i].addEventListener("click", function(){addToCart(featured[i])});
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

                //localStorage.setItem("cart", JSON.stringify(cart))
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


                //localStorage.setItem("cart", JSON.stringify(cart))
                //console.log(colorIs(colorable[i].color), rgb2hex(colors[i].childNodes[j].style.backgroundColor))
            });
        }
    }
}

async function getTypes(x) {
    const response = await fetch(x)
    const data = await response.json()

    types = data
    types.sort()
    createTypes()
}

async function getProducts(x) {
    const response = await fetch(x)
    const data = await response.json()

    products = data
    products.forEach(product => {
        if(product.sizes != undefined && product.size == undefined){
            product.isSizeable = true
        }else{product.isSizeable = false}
    });
    products.forEach(product => {
        if(product.colors != undefined){
            product.isColorable = true
        }else{product.isColorable = false}
    });
    products.forEach(product => {
        if(product.keywords == undefined){
            product.keywords = []
        }
        if(product.colors != undefined){
            for(let i = 0; i < product.colors.length; i++){
                product.keywords.push(product.colors[i])
            }
        }
        product.keywords.push(product.img)
        
    });
    
    feature('all')

    if(x == './main.json'){
        const productClass = document.getElementsByClassName('product')
        for (let i = 0; i < productClass.length; i++){
            productClass[i].style.margin = '1rem';
            //console.log(productClass[0])
        }
        
    }
}

async function getCategories(x) {
    const response = await fetch(x)
    const data = await response.json()

    categories = data
    categories.sort()
    createCategories()
}

// ============

function load(x) {
    let cat = "./" + x + "Categories.json"
    let prod = "./" + x + ".json"
    
    if(x == 'main'){
        fHead.style.display = 'block'
        sideB.style.display = 'none'
        featuredDiv.style.flexDirection = 'column'
        main.style.boxShadow = 'inset 0px 6px 19px -7px rgba(0,0,0,0.75)'
        
        isMain = true
    }else{
        getCategories(cat)
        fHead.style.display = 'none'
        sideB.style.display = 'block'
        featuredDiv.style.flexDirection = null
        main.style.boxShadow = null

        isMain = false
    }

    getProducts(prod)
}

getTypes('./types.json')

load("main")



    



