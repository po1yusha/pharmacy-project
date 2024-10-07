document.addEventListener('DOMContentLoaded', () => {

    const productsBtn = document.querySelectorAll('.medicaments-button');
    const cartProductsList = document.querySelector('.cart-header__list');
    const popup = document.querySelector('.popup');
    const cartQuantity = document.querySelector('.amount');
    const fullPrice = document.querySelector('.fullprice');
    let price = 0;
    let randomId = 0;

    const priceWithoutSpaces = (str) => {
        return str.replace(/\s/g, '');
    };

    const normalPrice = (str) => {
        return String(str).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
    };

    const plusFullPrice = (currentPrice) => {
        return price += currentPrice;
    };

    const minusFullPrice = (currentPrice) => {
        return price -= currentPrice;
    };

    const printFullPrice = () => {
        fullPrice.textContent = `${normalPrice(Math.round(price * 10) / 10)} ₴`;
    };

    const printQuantity = () => {
        let length = 0;
        for (let i = 0; i < cartProductsList.children.length; i++) {
            length += parseInt(cartProductsList.querySelectorAll('.product-counter')[i].textContent)
        }
        cartQuantity.textContent = length;
        length > 0 ? popup.classList.add('active') : popup.classList.remove('active');
    };

    const generateCartProduct = (img, title, price, id) => {
        return `
     <li class="cart-header__item">
       <article class="cart-content__product cart-product" data-id="${id}">
         <img src="${img}" alt="Медикамент" class="cart-product__image">
             <div class="cart-product__text">
                 <h3 class="cart-product__title">
                     ${title}
                 </h3>
                 <div class="cart-product__counter">
                     <button class="minus">-</button>
                     <span class="product-counter">1</span>
                     <button class="plus">+</button>
                 </div>
                 <span class="cart-product__price">${normalPrice(price)} ₴</span>
             </div>
             <button class="cart-product__delete" aria-label="Delete">X</button>
     </article>
 </li>`
    };

    const plusProduct = (productParent) => {
        let id = productParent.querySelector('.cart-product').dataset.id;
        if (document.querySelector(`.cart-product[data-id="${id}"]`).querySelector('.product-counter').textContent === null) {
            ++document.querySelector(`.cart-product[data-id="${id}"]`).querySelector('.product-counter').textContent;
        }
        ++document.querySelector(`.cart-product[data-id="${id}"]`).querySelector('.product-counter').textContent;
        let currentPrice = parseFloat(priceWithoutSpaces(document.querySelector(`.medicaments__item[data-id="${id}"]`).querySelector('.medicaments__item__price').textContent));
        plusFullPrice(currentPrice);
        printFullPrice();
        printQuantity();
        updateStorage();
    };

    const minusProduct = (productParent) => {
        let id = productParent.querySelector('.cart-product').dataset.id;
        if (document.querySelector(`.cart-product[data-id="${id}"]`).querySelector('.product-counter').textContent > 1) {
            --document.querySelector(`.cart-product[data-id="${id}"]`).querySelector('.product-counter').textContent;
            let currentPrice = parseFloat(priceWithoutSpaces(document.querySelector(`.medicaments__item[data-id="${id}"]`).querySelector('.medicaments__item__price').textContent));
            minusFullPrice(currentPrice);
            printFullPrice();
            printQuantity();
            updateStorage();
        } else {
            deleteProducts(productParent);
        }
    };

    const deleteProducts = (productParent) => {
        let id = productParent.querySelector('.cart-product').dataset.id;
        document.querySelector(`.medicaments__item[data-id="${id}"]`).querySelector('.medicaments-button').disabled = false;
        let currentPrice = parseFloat(priceWithoutSpaces(productParent.querySelector('.cart-product__price').textContent)) * document.querySelector(`.cart-product[data-id="${id}"]`).querySelector('.product-counter').textContent;
        minusFullPrice(currentPrice);
        printFullPrice();
        productParent.remove();
        printQuantity();

        updateStorage();
    };

    productsBtn.forEach(el => {
        el.closest('.medicaments__item').setAttribute('data-id', randomId++);
        el.addEventListener('click', (e) => {
            let self = e.currentTarget;
            let parent = self.closest('.medicaments__item');
            let id = parent.dataset.id;
            let img = parent.querySelector('.medicaments_img').getAttribute('src');
            let title = parent.querySelector('.medicaments__item__title').textContent;
            let priceNumber = parseFloat(priceWithoutSpaces(parent.querySelector('.medicaments__item__price').textContent));

            plusFullPrice(priceNumber);
            printFullPrice();
            cartProductsList.insertAdjacentHTML('afterbegin', generateCartProduct(img, title, priceNumber, id));
            printQuantity();

            self.disabled = true;

            updateStorage();
        });
    });

    cartProductsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('plus')) {
            plusProduct(e.target.closest('.cart-header__item'));
        }
    });

    cartProductsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('minus')) {
            minusProduct(e.target.closest('.cart-header__item'));
        }
    });

    cartProductsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('cart-product__delete')) {
            deleteProducts(e.target.closest('.cart-header__item'));
        }
    });

    const countSum = () => {
        document.querySelectorAll('.cart-header__item').forEach(el => {
            let id = el.querySelector('.cart-product').dataset.id;
            price += parseFloat(priceWithoutSpaces(el.querySelector('.cart-product__price').textContent)) * document.querySelector(`.cart-product[data-id="${id}"]`).querySelector('.product-counter').textContent;
        });
    };

    const initialState = () => {
        if (localStorage.getItem('products') !== null) {
            cartProductsList.innerHTML = localStorage.getItem('products');
            printQuantity();
            countSum();
            printFullPrice();

            document.querySelectorAll('.cart-content__product').forEach(el => {
                let id = el.dataset.id;
                document.querySelector(`.medicaments__item[data-id="${id}"]`).querySelector('.medicaments-button').disabled = true;
            });
        }
    };

    initialState();

    function storageAvailable(type) {
        try {
            var storage = window[type];
            x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch (e) {
            return false;
        }
    }

    const updateStorage = () => {
        let html = cartProductsList.innerHTML;
        html = html.trim();
        if (html.length && document.querySelector('._req').checked === true && storageAvailable('localStorage')) {
            localStorage.setItem('products', html);
        } else {
            localStorage.removeItem('products');
        }
    };

    popup.addEventListener('click', e => {
        if (e.target.classList.contains('make-order')) {

        }
    });

});
