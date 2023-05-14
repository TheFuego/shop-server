function notification() {
    const notificationDiv = document.createElement('div')
    notificationDiv.textContent = 'Order placed!'
    notificationDiv.classList.add('tooltip')
    notificationDiv.classList.add('tooltip-bought')
    document.getElementById('order').appendChild(notificationDiv)

    setTimeout(function () {
        notificationDiv.remove()
    }, 2000)

    console.log('ok')
}

function simplify(x) {
    let totalPrice = (x.price - Math.floor(x.price * x.discount)) * x.number
    return `${x.number} counts of ${x.size} ${x.color} ${x.name}, Total price: ${totalPrice}`
}

function order() {
    let cartSimplified = []
    cart.forEach(product => {
        cartSimplified.push(simplify(product))
    });
    return {
        cartOrder: cartSimplified,
        checkoutInfo: 'Items count: ' + itemsNumLet + ', Total price: ' + totalPriceLet,
        buyer: {
            name: document.getElementById('fname').value + ' ' + document.getElementById('lname').value,
            email: document.getElementById('email').value,
            phoneNumber: document.getElementById('number').value,
            address: document.getElementById('street').value + ', ' + document.getElementById('zip').value + ' ' + document.getElementById('city').value
        }
    }
}

async function sendData() {
    const data = order()

    const options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    }

    const res = await fetch('/api', options)
    const response = await res.json()
    console.log(response)
}

document.getElementById('orderBtn').onclick = function() {
    sendData()
    notification()
}