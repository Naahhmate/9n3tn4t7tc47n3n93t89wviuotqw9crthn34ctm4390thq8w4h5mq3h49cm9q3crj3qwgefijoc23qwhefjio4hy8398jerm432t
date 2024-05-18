const cryptoSelect = document.getElementById('crypto');
const paymentMethodSelect = document.getElementById('payment-method');
const amountInput = document.getElementById('amount');
const amountValueSpan = document.getElementById('amount-value');
const submitButton = document.querySelector('.submit-button');
const popup = document.querySelector('.popup');
const cookieConsent = document.querySelector('.cookie-consent');
const acceptButton = document.getElementById('accept-cookies');
const declineButton = document.getElementById('decline-cookies');
const walletAddiHTML = document.getElementById('WalletAddi')
const QRCode = document.getElementById('QRCode')
const copyButton = document.getElementById('copy')
const amountValueFee = document.getElementById('amount-value-fee')
const feeAmountSpan = document.getElementById('amount-value-totalfee')
const exchangeBtn = document.getElementById("exchange");
const section = document.getElementById("sec");
const overlay = document.querySelector(".overlay");
const slider = document.getElementById('amount');
const showBtn = document.querySelector(".show-modal");
const closeBtn = document.querySelector(".close-btn");
const closePopup = document.querySelector(".close-button");
const completedBtn = document.getElementById("complete-btn");
const desc = document.getElementById("desc");
const lastSubmit = document.getElementById('last-submit')


async function checkWallet(myWalletAddress, targetWalletAddress, amount) {
    try {
        const response = await axios.get(`https://toncenter.com/api/v2/getTransactions?address=${targetWalletAddress}`);
        const transactions = response.data.transactions;

        const myTransactions = transactions.filter(transaction => transaction.out_msg.dest === myWalletAddress && transaction.in_msg.src === targetWalletAddress && transaction.in_msg.value === amount * 1000000000);

        if (myTransactions.length > 0) {
            console.log('New transaction from target wallet with specified amount detected:', myTransactions);
            return true;
        } else {
            console.log('No new transactions from target wallet with specified amount');
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

closeBtn.addEventListener('click', () => {
    section.classList.remove("active")
    overlay.style.display='none';
    overlay.style.opacity='0';
});
section.addEventListener('click', () => {
    section.classList.remove("active")
    overlay.style.display='none';
    overlay.style.opacity='0';
});


let timeoutId = null;

let Addresses = {
    "btc": {
        "Address": 'bc1q0xs5ntedugpxnrmfsavkarkc0kydr5xlunnze2'
    },
    "eth": {
        "Address": '0x309A1cDbC0831a1d10A3053eB362fd7F7BcFA656'
    },
    "usdt": {
        "Address": '0x309A1cDbC0831a1d10A3053eB362fd7F7BcFA656'
    },
    "solana": {
        "Address": 'GXXv16sBsRSwC7inPqfjtJx82MFv9KN3bnitUyKQjf9u'
    },
    "ada": {
        "Address": 'addr1qxwdwf5hmf6agerj6rp3f26sm3c62g2k6cf99dkgm4tft7uu6unf0kn463j895xrzj44phr355s4d4sj22mv3h2kjhasetn7jn'
    },
    "paypal": {
        "Address": 'roffa.reps@gmail.com'
    }
};

function selectText(nodeId) {
    const node = document.getElementById(nodeId);

    if (document.body.createTextRange) {
        const range = document.body.createTextRange();
        range.moveToElementText(node);
        range.select();
    } else if (window.getSelection) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
    } else {
        console.warn("Could not select text in node: Unsupported browser.");
    }
}

function hidePopup() {
    popup.classList.remove('show');
    overlay.classList.remove('show');
    section.classList.remove("active")
    overlay.style.display='none';
    overlay.style.opacity='0';
}

function copyToClipboard(ID) {
    var copyText = document.getElementById(ID);
    selectText(ID)
    navigator.clipboard.writeText(copyText.innerText);
}

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function throttle(fn, delay) {
    let lastCall = 0;
    return function(...args) {
      const now = Date.now();
      if (now - lastCall > delay) {
        lastCall = now;
        fn(...args);
      }
    };
  }

  function createModalMessage(type,message,cont) {
    const title = document.getElementById('title')
    const content = document.getElementById('content')
    const icon = document.getElementById('sec-icon')
    section.classList.add("active")
    title.innerText = message
    content.innerText = cont
    overlay.style.display='flex';
    overlay.style.opacity='1';
    if (type == "Normal") {
        icon.className = "fa-solid fa-circle-info"
        const icons = document.querySelectorAll('.modal-box i');
        icons.forEach((icon) => {
          icon.style.color = '#265df2';
        });
        closeBtn.style.backgroundColor='#265df2';
    } else if (type == "Error") {
        icon.className = "fa-solid fa-triangle-exclamation"
        const icons = document.querySelectorAll('.modal-box i');
        icons.forEach((icon) => {
          icon.style.color = '#f44040';
        });
        closeBtn.style.backgroundColor='#f44040';
    } else if (type == "Success") {
        icon.className = "fa-regular fa-circle-check"
        const icons = document.querySelectorAll('.modal-box i');
        icons.forEach((icon) => {
          icon.style.color = '#55eb34';
        });
        closeBtn.style.backgroundColor='#55eb34';
      }
  }

  function showPopup() {
    const selectedCrypto = cryptoSelect.value;
    const selectedPayment = paymentMethodSelect.value;
    
    if (selectedCrypto !== "none" && selectedPayment !== "none" && selectedCrypto !== selectedPayment) {
        if (selectedCrypto === "other") {
            popup.classList.remove('show');
            overlay.classList.remove('active');
            createModalMessage('Normal','Hey!',"Please join our telegram and pm one of our staff for the payment method you would like to use!")
            return
        }
        overlay.classList.add("active");
        overlay.style.display = 'flex';
        overlay.style.opacity = '1';
        popup.classList.add('show');
        return 'Success';
    } else {
        popup.classList.remove('show');
        overlay.classList.remove('active');
        createModalMessage('Error', 'Error!', 'Please check if you missed filling out any required information before starting the exchange.');
        return 'Error';
    }
  }

  function resetPopup() {
    walletAddiHTML.innerText = 'Loading..'
    QRCode.src = `assets/Load.gif`
    completedBtn.style.backgroundColor='#333';
    completedBtn.style.opacity='0.5';
    completedBtn.innerText='Waiting for payment..'
    completedBtn.cursor='default';
    completedBtn.disabled = true
    section.classList.remove("active")
    overlay.style.display='none';
    overlay.style.opacity='0';
  }

cookieConsent.classList.add('show');
document.querySelectorAll('.cookie-consent button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelector('.cookie-consent').classList.add('animate');
    });
});

acceptButton.addEventListener('click', () => {
    setCookie('cookie_consent', 'true', 30);
});

declineButton.addEventListener('click', () => {
    setCookie('cookie_consent', 'false', 30);
});

if (getCookie('cookie_consent')) {
    cookieConsent.style.display = 'none';
}

submitButton.addEventListener('click', () => {
    const selectedCrypto = cryptoSelect.value;
    const cryptoInfo = Addresses[selectedCrypto];
    if (selectedCrypto) {
        popup.classList.add('show');
        overlay.classList.add('show');
    } else {
        alert("Error!")
    }
});

overlay.addEventListener('click', () => {
    popup.classList.remove('show');
    overlay.classList.remove('show');
    overlay.style.display='none';
    overlay.style.opacity='0';
    resetPopup()
});

copyButton.addEventListener('click', throttle(() => {
    copyButton.style.backgroundColor = "rgb(33, 255, 0)";
    copyButton.innerText = "Copied";
    copyToClipboard('WalletAddi');
    
    setTimeout(() => {
      copyButton.style.backgroundColor = "#9900ff";
      copyButton.innerText = "Copy";
    }, 2000);
  }, 500));

amountInput.addEventListener('input', () => {
    const amountValue = parseFloat(amountInput.value);
    const feeAmount = amountValue * 0.02;
    const amountAfterFee = amountValue - feeAmount;
  
    amountValueFee.innerHTML = `After fee: $${amountAfterFee.toFixed(2)} <br></br>`;
    amountValueSpan.textContent = `$${amountValue.toFixed(2)}`;
    feeAmountSpan.textContent = `Fee: $${feeAmount.toFixed(2)}`;
});

exchangeBtn.addEventListener('click', () => {
    let responce = showPopup()
    console.log('responce: '+responce)
    if (responce == 'Success') {
        const selectedCrypto = cryptoSelect.value;
        const cryptoInfo = Addresses[selectedCrypto];
        walletAddiHTML.innerText = cryptoInfo.Address
        QRCode.src = `assets/QR-${selectedCrypto.toString().toUpperCase()}.png`
    }
});

closePopup.addEventListener('click', () => {
    resetPopup()
})

slider.addEventListener('input', () => {
    const sliderValue = slider.value;
    const sliderMin = slider.min;
    const sliderMax = slider.max;
    const translationRange = 30;
    const currentValue = slider.value;
    const percentage = (currentValue - sliderMin) / (sliderMax - sliderMin);
    const translation = (percentage * translationRange) - (translationRange / 2);
    const skewValue = (percentage * 2) - 1;

  slider.style.transform = `translateX(${translation}px) skewX(${-skewValue}deg)`;
  slider.style.transform = `translateX(${translation}px) skewY(${-skewValue}deg)`;
});

exchangeBtn.addEventListener('click', () => {
    completedBtn.disabled = true;

    setTimeout(function() {
      if (document.getElementsByClassName('.popup.show')) {
        completedBtn.style.backgroundColor='#55eb34';
        completedBtn.style.opacity='1';
        completedBtn.innerText='Next'
        completedBtn.disabled = false
        completedBtn.style.cursor='pointer';
      }
    }, 3000);
});

completedBtn.addEventListener('click', () => {
    overlay.classList.remove('active');
    popup.classList.add('showInfo')
});

const words = ["Start Exchanging", "Future of Exchanging"];

const dynamicText = document.querySelector('.form-title span')
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typeEffect = () => {
    const currentWord = words[wordIndex];
    const currentChar = currentWord.substring(0, charIndex);
    dynamicText.textContent = currentChar;
    dynamicText.classList.add("stop-blinking");
    if (!isDeleting && charIndex < currentWord.length) {
        charIndex++;
        setTimeout(typeEffect, 100);
    } else if (isDeleting && charIndex > 0) {
        charIndex--;
        setTimeout(typeEffect, 50);
    } else {
        isDeleting = !isDeleting;
        dynamicText.classList.remove("stop-blinking");
        wordIndex = !isDeleting ? (wordIndex + 1) % words.length : wordIndex;
        setTimeout(typeEffect, 1200);
    }
}
typeEffect();

const emailInput = document.getElementById('#email');
const phoneInput = document.getElementById('#phone');

function validateEmail(email) {
    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/;
    return pattern.test(email);
}

lastSubmit.addEventListener('click', () => {
    if (validateEmail(emailInput.value)) {
        console.log('Valid Email Address');
    } else {
        console.log('Invalid Email Address');
    }
});