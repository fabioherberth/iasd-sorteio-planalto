const iptNameOfTheWinner = document.getElementById("iptNameOfTheWinner");
const checkboxRepeat = document.getElementById("nmrRepeat");
const btnStart = document.getElementById("btnStart");
const btnRaffle = document.getElementById("btnRaffle");
const btnClear = document.getElementById("btnClear");
const btnChange = document.getElementById("btnChange");
const divStart = document.getElementById("divStart");
const divRaffle = document.getElementById("divRaffle");
const divRaffleNumber = document.getElementById("raffleNumber");
const historicalNumbers = document.getElementById("historicalNumbers");

let drawnNumbers = [];
let drawnNumber = 0;
let isRepeatNumber = false;

if(localStorage.getItem("started")) {
    divStart.classList.remove("d-flex");
    divStart.classList.add("d-none");
    divRaffle.classList.remove("d-none");
    divRaffle.classList.add("d-flex");
    nmrEnd.value = localStorage.getItem("second-value");
    let historical = localStorage.getItem("historical-numbers");
    if(historical){
        divRaffleNumber.innerText = localStorage.getItem("drawn-number");
        historicalNumbers.innerText = historical.replaceAll(",", " - ");
    }
}

btnStart.addEventListener("click", () => {

    iptNameOfTheWinner.value = "Buscando...";
    const url = "http://church-api.ddns.net:8090/draw/event/1";

    let request = new Request(url, {
        method: 'GET',
        headers: new Headers({
            "Content-Type": "application/json; charset=UTF-8"
        })
    });

    fetch(request)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      if(data.name != null) {
        iptNameOfTheWinner.value = data.name;
        return;
      }

      iptNameOfTheWinner.value = "Finalizado!";
    })
    .catch(error => console.error(error));
    
});

btnRaffle.addEventListener("click", () => {
    let firstValue = parseInt(localStorage.getItem("first-value"));
    let secondValue = parseInt(localStorage.getItem("second-value"));
    drawnNumbers = localStorage.getItem("historical-numbers") ? localStorage.getItem("historical-numbers").split(',').map(Number) : [];
    if(drawnNumbers.length < secondValue){
        carryOutDraw(firstValue, secondValue);
    }

});

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * ((max + 1) - min) + min);
}

function carryOutDraw(firstValue, secondValue) {
    if (!isRepeatNumber) {
        var rangeOfNumbers = secondValue - firstValue; 

        if (drawnNumbers.length > rangeOfNumbers) {
            return;
        }

        do {
            drawnNumber = getRandomArbitrary(firstValue, secondValue);
        } while (drawnNumbers.indexOf(drawnNumber) >= 0);
    } else {
        drawnNumber = getRandomArbitrary(firstValue, secondValue);
    }
    divRaffleNumber.innerText = drawnNumber;
    saveHistory();
}

function saveHistory() {
    drawnNumbers = localStorage.getItem("historical-numbers") ? localStorage.getItem("historical-numbers").split(',').map(Number) : [];
    if(drawnNumbers.length < nmrEnd.value && drawnNumbers.indexOf(drawnNumber)){
        drawnNumbers.push(drawnNumber);
    }
    if(drawnNumbers.length > 0) {
        localStorage.setItem("drawn-number", drawnNumber);
        localStorage.setItem("historical-numbers", drawnNumbers);
    }
    historicalNumbers.innerText = drawnNumbers.join(" - ");
}

function showRaffle() {
    divStart.classList.remove("d-flex");
    divStart.classList.add("d-none");
    divRaffle.classList.remove("d-none");
    divRaffle.classList.add("d-flex");
}

function showStart() {
    divRaffle.classList.remove("d-flex");
    divRaffle.classList.add("d-none");
    divStart.classList.remove("d-none");
    divStart.classList.add("d-flex");
}