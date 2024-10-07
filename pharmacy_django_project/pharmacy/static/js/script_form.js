const form = document.getElementById('form');
form.addEventListener('submit', formSend);
form.addEventListener('submit', removeLocalStorage);

const popupLinks = document.querySelectorAll('.popup-link');
const body = document.querySelector('body');
const lockPadding = document = document.querySelectorAll(".lock-padding");

let unlock = true;

const timeout = 800;

function removeLocalStorage(e){
    localStorage.removeItem('products');
}

async function formSend(e) {
    let error = formValidate(form);
    if (error === 0) {

        if (popupLinks.length > 0) {
            for (let index = 0; index < popupLinks.length; index++) {
                const popupLink = popupLinks[index];
                popupLink.addEventListener("click", function (e) {
                    localStorage.removeItem('products');
                    const popupName = popupLink.getAttribute('href').replace('#', '');
                    const curentPopup = document.getElementById(popupName);
                    popupOpen(curentPopup);
                });
            }
        }

        const popupCloseIcon = document.querySelectorAll('.close-popup');

        if (popupCloseIcon.length > 0) {
            for (let index = 0; index < popupCloseIcon.length; index++) {
                const el = popupCloseIcon[index];
                el.addEventListener('click', function (e) {
                    popupClose(el.closest('.popup'));
                });
            }
        }
        document.addEventListener('keydown', function (e) {
            if (e.which === 27) {
                const popupActive = document.querySelector('.popup.open');
                popupClose(popupActive);
            }
        });
    } else {
        alert("Будь ласка, заповніть обов'язкові поля!");
    }

}

const radioButtons = document.querySelectorAll('input[name="method"]');
let oldChecked,newChecked;
let flagCheck = 0;
for (const radioButton of radioButtons) {
    radioButton.addEventListener('change', () => {
        if(flagCheck === 0){
            oldChecked = document.querySelector('input[name="method"]:checked');
            newChecked = document.querySelector('input[name="method"]:checked');
            newChecked.nextElementSibling.nextElementSibling.style.display = 'block';
            flagCheck = 1;
        }else{
            oldChecked.nextElementSibling.nextElementSibling.style.display = 'none';
            newChecked = document.querySelector('input[name="method"]:checked');
            newChecked.nextElementSibling.nextElementSibling.style.display = 'block';
            oldChecked = document.querySelector('input[name="method"]:checked');
        }
    });
}

function popupOpen(curentPopup) {
    if (curentPopup && unlock) {
        const popupActive = document.querySelector('.popup.open');
        if (popupActive) {
            popupClose(popupActive, false);
        } else {
            bodyLock();
        }
        curentPopup.classList.add('open');
        curentPopup.addEventListener("click", function (e) {
            if (!e.target.closest('.popup__content')) {
                popupClose(e.target.closest('.popup'))
            }
        });
    }
}

function popupClose(popupActive, doUnlock = true) {
    if (unlock) {
        popupActive.classList.remove('open');
        if (doUnlock) {
            bodyUnLock();
        }
    }
}

function bodyLock() {
    const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

    if (lockPadding.length > 0) {
        for (let index = 0; index < lockPadding.length; index++) {
            const el = lockPadding[index];
            el.style.paddingRight = lockPaddingValue;
        }
    }
    body.style.paddingRight = lockPaddingValue;
    body.classList.add('lock');

    unlock = false;
    setTimeout(function () {
        unlock = true;
    }, timeout);
}

function bodyUnLock() {
    setTimeout(function () {
        if (lockPadding.length > 0) {
            for (let index = 0; index < lockPadding.length; index++) {
                const el = lockPadding[index];
                el.style.paddingRight = '0px';
            }
        }
        body.style.paddingRight = '0px';
        body.classList.remove('lock');
    }, timeout);

    unlock = false;
    setTimeout(function () {
        unlock = true;
    }, timeout);
}

function formValidate(form) {
    let error = 0;
    let formReq = document.querySelectorAll('._req');

    for (let index = 0; index < formReq.length; index++) {
        const input = formReq[index];
        formRemoveError(input);

        if /*(input.classList.contains('_email')) {
            if (emailTest(input)) {
                formAddError(input);
                error++;
            }
        } else if (input.classList.contains('_name')) {
            if (nameTest(input)) {
                formAddError(input);
                error++;
            }
        } else if */(input.getAttribute("type") === "checkbox" && input.checked === false) {
            formAddError(input);
            error++;
        } /*else {
            if (input.value === '') {
                formAddError(input);
                error++;
            }
        }*/
    }
    return error;
}

function formAddError(input) {
    input.parentElement.classList.add('_error');
    input.nextElementSibling.classList.add('_error');
    input.classList.add('_error');
}

function formRemoveError(input) {
    input.parentElement.classList.remove('_error');
    input.nextElementSibling.classList.remove('_error');
    input.classList.remove('_error');
}

function emailTest(input) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
}

function nameTest(input) {
    return !/^[А-ЯЇІЄҐ][а-яїієґ']+$/.test(input.value);
}


const orderProd = document.querySelector('.composition');
const orderList = document.querySelector('.order-modal__list');


let flag = 0;
orderProd.addEventListener('click', (e) => {
    if (flag === 0) {
        orderProd.classList.add('open');
        orderList.style.display = 'block';
        flag = 1;
    } else {
        orderProd.classList.remove('open');
        orderList.style.display = 'none';
        flag = 0;
    }
});


/*let phoneInput = document.querySelector('._phone');
phoneInput.addEventListener('keydown', function (event) {
    if (!(event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'Backspace' || event.key === 'Tab')) {

    }
    var mask = '+38 (111) 111-11-11';

    if (/[0-9\+\ \-\(\)]/.test(event.key)) {
        var currentString = this.value;
        var currentLength = currentString.length;
        if (/[0-9]/.test(event.key)) {
            if (mask[currentLength] === '1') {
                this.value = currentString + event.key;
            } else {
                for (var i = currentLength; i < mask.length; i++) {
                    if (mask[i] === '1') {
                        this.value = currentString + event.key;
                        break;
                    }
                    currentString += mask[i];
                }
            }
        }
    }
});*/




