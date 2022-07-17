const productsContainer = document.querySelector('#products-container');

getProducts();

async function getProducts() {
    const response = await fetch('./js/products.json');
    const productsArray = await response.json();
	renderProducts(productsArray);
}

function renderProducts(productsArray) {
    productsArray.forEach(function (item) {
        const productHTML = `<div class="col-md-6">
        <div class="card" data-id="${item.id}">
            <img class="product-img" src="./images/${item.imgSrc}" alt="">
            <div class="card-body text-center">
                <h5 class="item-title">${item.title}</h5>
                <div class="ditails-wrapper">
                    <div class="items counter-wrapper">
                        <div class="items_control" data-action="minus">-</div>
                        <div class="items_current" data-counter>1</div>
                        <div class="items_control" data-action="plus">+</div>
                    </div>
                    <div class="price">
                        <div class="price__currency">${item.price}$</div>
                    </div>
                </div>
                <button data-cart class="btn btn-block btn-outline-dark"> +add </button>
            </div>
        </div>
    </div>`;
        productsContainer.insertAdjacentHTML('beforeend', productHTML);
    });
}

const btnMinus = document.querySelector('[data-action="minus"]');
const btnPlus = document.querySelector('[data-action="plus"]');
const counter = document.querySelector('[data-counter]');
const cartWrapper = document.querySelector('.cart-wrapper');

window.addEventListener('click', (event) => {
    let counter;
    // event.target.dataset.action - так мы проверяем элементы с data-* = "*"
    // event.target.closest - так находим родителя
    // counterWrapper.querySelector('[data-counter]') - и так находим у этого родителя
    if (event.target.dataset.action === 'plus' || event.target.dataset.action === 'minus') {
        const counterWrapper = event.target.closest('.counter-wrapper');
        counter = counterWrapper.querySelector('[data-counter]');
    }
    if (event.target.dataset.action === 'plus') {
        counter.innerText = ++counter.innerText;
    }
    if (event.target.dataset.action === 'minus') {
        if (parseInt(counter.innerText) > 1) {
            counter.innerText = --counter.innerText;
        }
        else if (event.target.closest('.cart-wrapper') && parseInt(counter.innerText) === 1) {
            // если родитель .cart-wrapper и counter === 1, то удаляем товар из корзины
            console.log('IN CART!!!!');
            event.target.closest('.cart-item').remove();
            toggleCartStatus();
            calcCartPriceAndDelivery();
        }
    }
    if (event.target.hasAttribute('data-action') && event.target.closest('.cart-wrapper')) {
        calcCartPriceAndDelivery();
    }
    if (event.target.hasAttribute('data-cart')) {
        const card = event.target.closest('.card');
        const productInfo = {
            id: card.dataset.id,
            imgSrc: card.querySelector('.product-img').getAttribute('src'),
            title: card.querySelector('.item-title').innerText,
            price: card.querySelector('.price__currency').innerText,
            counter: card.querySelector('[data-counter]').innerText,
        };
       
        const itemInCart = cartWrapper.querySelector(`[data-id="${productInfo.id}"]`);
        if (itemInCart) {
            const counterElement = itemInCart.querySelector('[data-counter]');
            counterElement.innerText = parseInt(counterElement.innerText) + parseInt(productInfo.counter);
        } else {
            const cartItemHTML = `<div class="cart-item" data-id="${productInfo.id}">
            <div class="cart-item__top">

                 <div class="cart-item__img col">
                     <img class="img2" src="${productInfo.imgSrc}" alt="${productInfo.title}">
                 </div>

                 <div class="cart-item__desc col">
                     <div class="cart-item__title"><strong>${productInfo.title}</strong></div>
                     <div class="cart-item__details">
                         <div class="items items--small counter-wrapper">
                             <div class="items_control" data-action="minus">-</div>
                             <div class="items_current" data-counter="">${productInfo.counter}</div>
                             <div class="items_control" data-action="plus">+</div>
                         </div>
                         <div class="price">
                            <div class="price__currency ms-4 mt-2">${productInfo.price}</div>
                         </div>
                    </div>
                </div>

             </div>
         </div>`;
            // Отобразим товар в корзине
            cartWrapper.insertAdjacentHTML('beforeend', cartItemHTML);
        }
    card.querySelector('[data-counter]').innerText = '1';
    toggleCartStatus();
    calcCartPriceAndDelivery();
    }
})
// event.target.hasAttribute('data-cart') - так мы проверяем элементы с data-*
// складываем
function calcCartPriceAndDelivery() {
    const priceElements = cartWrapper.querySelectorAll('.price__currency');
    const totalPriceEl = document.querySelector('.total-price');
    const deliveryCost = document.querySelector('.delivery-cost');
    const cartDelivery = document.querySelector('[data-cart-delivery]');

    let priceTotal = 0;

    priceElements.forEach(function (item) {
        const amountEl = item.closest('.cart-item').querySelector('[data-counter]');
        priceTotal += parseInt(item.innerText) * parseInt(amountEl.innerText);
    });
    totalPriceEl.innerText = priceTotal;

    if (priceTotal > 0) {
        cartDelivery.classList.remove('none');
    } else {
        cartDelivery.classList.add('none');
    }
    if (priceTotal >= 20) {
        deliveryCost.classList.add('free');
        deliveryCost.innerText = 'free';
    } else {
        deliveryCost.classList.remove('free');
        deliveryCost.innerText = '20$';
    }
}

function toggleCartStatus() {

    const cartWrapper = document.querySelector('.cart-wrapper');
    const cartEmptyBadge = document.querySelector('[data-cart-empty]');
    const orderForm = document.querySelector('#order-form');

    if (cartWrapper.children.length > 0) {
        console.log('FULL');
        cartEmptyBadge.classList.add('none');
        orderForm.classList.remove('none');
    } else {
        console.log('EMPTY');
        cartEmptyBadge.classList.remove('none');
        orderForm.classList.add('none');
    }
}


