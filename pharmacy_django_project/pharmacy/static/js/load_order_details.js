function parseHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const cartItems = doc.querySelectorAll('.cart-product');
    return Array.from(cartItems).map(item => {
        return {
            id: item.dataset.id,
            imgSrc: item.querySelector('.cart-product__image').src,
            title: item.querySelector('.cart-product__title').textContent.trim(),
            quantity: parseInt(item.querySelector('.product-counter').textContent, 10),
            price: parseFloat(item.querySelector('.cart-product__price').textContent.replace(' ₴', ''))
        };
    });
}

let products = parseHTML(localStorage.getItem('products'));
let jsonProducts = JSON.stringify(products)

$('.productJson').val(jsonProducts)

let count = 0;
products.forEach(product => count += product.quantity);

let totalPrice = 0;
products.forEach(product => totalPrice += product.price * product.quantity);
totalPrice = Math.floor(totalPrice * 100) / 100;
$('.totalCost').val(totalPrice)


console.log(products);
console.log(count);


let templateForOverallInfo = `
    <div class="your-order__item">
        <h3 class="title-your-order">Ваше замовлення</h3>
    </div>
    <div class="your-order__item">
        <h2 class="goods-amount-title">Товарів в замовленні: </h2>
        <span class="goods-amount price">${count}</span>
    </div>
    <div class="your-order__item">
        <h2 class="goods-title">Товари: </h2>
        <span class="goods-price price">${totalPrice} ₴</span>
    </div>
    <div class="your-order__item">
        <h2 class="delivery-title">Доставка: </h2>
        <span class="delivery-price price">Безкоштовно</span>
    </div>
    <div class="your-order__item">
        <h2 class="summary-title">Підсумок: </h2>
        <span class="fullprice price">${totalPrice} ₴</span>
    </div>
`;

let templateForCheckbox = `
    <div class="your-order__item">
        <div class="checkbox">
            <input id="formAgreement" checked type="checkbox" name="agreement"
                class="checkbox__input _req">
            <label for="formAgreement" class="checkbox__label"><span>Підтверджуючи замовлення, я приймаю
                <a class="condition">умови угоди користувача </a> та даю згоду на обробку моїх персональних даних</span>
            </label>
        </div>
    </div>
`;

let listOfProducts = ``;

products.forEach(
    product=>
        listOfProducts += `
            <li class="order-modal__item">
                <div class="order-prod">
                    <div>
                        <img src="${product.imgSrc}" alt="" class="order-product__img">
                    </div>
                    <div class="order-product__text">
                        <h3 class="order-product__title">
                            ${product.title}
                        </h3>
                        <span class="order-product__price">
                            ${product.price} ₴
                        </span>
                    </div>
                </div>
            </li>
        `
);

let templateForAllProduct = `
    <div class="your-order__item">
        <button class="composition">Склад замовлення <i class="fa-solid fa-arrow-down"></i></button>
        <ul class="order-modal__list">
            ${listOfProducts}
        </ul>
    </div>
`;

let result = templateForOverallInfo + templateForAllProduct + templateForCheckbox;

$('.your-order').append(result)