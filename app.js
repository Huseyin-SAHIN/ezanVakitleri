const imsakDiv = document.querySelector("#imsak");
const gunesDiv = document.querySelector("#gunes");
const ogleDiv = document.querySelector("#ogle");
const ikindiDiv = document.querySelector("#ikindi");
const aksamDiv = document.querySelector("#aksam");
const yatsiDiv = document.querySelector("#yatsi");
const tarih = document.querySelector("#tarih")

const kalanSaat = document.querySelector("#kalanSaat");
const kalanDakika = document.querySelector("#kalanDakika");
const kalanSaniye = document.querySelector("#kalanSaniye");

const timeList = document.querySelector(".vakitler ul");

let nowDate, nowSeconds, nowMinutes, nowHours, nowDay, nowMonth, nowFullYear;
let nowTime, imsakVakti, gunesVakti, ogleVakti, ikindiVakti, aksamVakti, yatsiVakti;

let nextDay = false;
loading();

if (localStorage.getItem("locationCity") === null || localStorage.getItem("locationDistrict") === null || localStorage.getItem("locationCity") === JSON.stringify("") || localStorage.getItem("locationDistrict") === JSON.stringify("")) {
    localStorage.setItem("locationCity", JSON.stringify("565"));
    localStorage.setItem("locationDistrict", JSON.stringify("9807"));
}

const submit = document.querySelector("#submit");
const locationButton = document.querySelector(".locationButton");
const optionCity = document.querySelector("#city");
const optionDistrict = document.querySelector("#district");

submit.addEventListener("click", () => {
    localStorage.setItem("locationCity", JSON.stringify(optionCity.value));
    localStorage.setItem("locationDistrict", JSON.stringify(optionDistrict.value));
    const location = document.querySelector("#location");
    location.style.display = "none";
})

locationButton.addEventListener("click", () => {
    const location = document.querySelector("#location");
    location.style.display = "flex";
});

function getNow() {
    let now = new Date();
    if (nextDay === true) {
        now.setDate(now.getDate() + 1);
        nowTime = -(1440 - totalMinutes(`${nowHours}:${nowMinutes}`));
    }
    nowSeconds = now.getSeconds();
    nowMinutes = now.getMinutes();
    nowHours = now.getHours();
    nowDay = now.getDate();
    nowMonth = now.getMonth() + 1;
    nowFullYear = now.getFullYear();

    nowSeconds = twoDigits(nowSeconds);
    nowMinutes = twoDigits(nowMinutes);
    nowHours = twoDigits(nowHours);
    nowDay = twoDigits(nowDay);
    nowMonth = twoDigits(nowMonth);

    nowDate = `${nowDay}.${nowMonth}.${nowFullYear}`
}

function twoDigits(digit) {
    if (digit < 10) {
        return digit.toLocaleString('tr-TR', {
            minimumIntegerDigits: 2,
            useGrouping: false
        });
    }
    return digit;
}

async function getSehirler() {
    try {
        const response = await fetch("https://ezanvakti.herokuapp.com/sehirler/2");
        if (!response.ok) {
            throw new Error("Network response was not OK");
        }
        const data = await response.json();

        optionCity.insertAdjacentHTML("beforeend", data.map(city => `<option value="${city.SehirID}">${city.SehirAdi}</option>`).join(""));

        const locationCity = document.querySelector("#locationCity");

        for (let i = 0; i < optionCity.length; i++) {
            if (optionCity[i].value === JSON.parse(localStorage.getItem("locationCity"))) {
                locationCity.innerHTML = optionCity[i].innerHTML;
                optionCity.selectedIndex = i;
                break;
            }
        }

        optionCity.addEventListener("change", function () {
            locationCity.innerHTML = optionCity[optionCity.selectedIndex].innerHTML;
            for (let i = 0; i < optionDistrict.length; i++) {
                optionDistrict[i].remove();
            }
            getIlceler(this.value);
        });
        getIlceler(JSON.parse(localStorage.getItem("locationCity")));
    } catch { errorNotification() }
}

async function getIlceler(ilce) {
    try {
        const response = await fetch(`https://ezanvakti.herokuapp.com/ilceler/${ilce}`);
        if (!response.ok) {
            throw new Error("Network response was not OK");
        }
        const data = await response.json();

        optionDistrict.insertAdjacentHTML("beforeend", data.map(district => `<option value="${district.IlceID}">${district.IlceAdi}</option>`).join(""));

        optionDistrict.addEventListener("change", function () {
            getVakitler(this.value);
        });

        for (let i = 0; i < optionDistrict.length; i++) {
            if (optionDistrict[i].value === JSON.parse(localStorage.getItem("locationDistrict"))) {
                optionDistrict.selectedIndex = i;
                break;
            }
        }

        getVakitler(JSON.parse(localStorage.getItem("locationDistrict")))
            .then(data => {
                firstUpload();
                getNow();

                for (let i = 0; i < data.length; i++) {
                    if (data[i].MiladiTarihKisa === nowDate) {
                        tarih.textContent = data[i].MiladiTarihUzun
                        imsakVakti = data[i].Imsak;
                        gunesVakti = data[i].Gunes;
                        ogleVakti = data[i].Ogle;
                        ikindiVakti = data[i].Ikindi;
                        aksamVakti = data[i].Aksam;
                        yatsiVakti = data[i].Yatsi;

                        imsakDiv.innerHTML = imsakVakti;
                        gunesDiv.innerHTML = gunesVakti;
                        ogleDiv.innerHTML = ogleVakti;
                        ikindiDiv.innerHTML = ikindiVakti;
                        aksamDiv.innerHTML = aksamVakti;
                        yatsiDiv.innerHTML = yatsiVakti;

                        timeZone();
                    }
                }
            })
            .catch(() => errorNotification);
    } catch { errorNotification() }
}

async function getVakitler(vakit) {
    try {
        const response = await fetch(`https://ezanvakti.herokuapp.com/vakitler/${vakit}`);
        if (!response.ok) {
            throw new Error("Network response was not OK");
        }
        const data = await response.json();
        return data;
    } catch { errorNotification() }
}

function errorNotification() {
    firstUpload();
    const error = document.createElement("div");
    error.classList.add("error");
    error.innerHTML = "Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.";
    document.body.appendChild(error);
    setTimeout(() => {
        error.remove();
    }, 3000);
}

function totalMinutes(hours) {
    return Number(hours.split(":")[0] * 60) + Number(hours.split(":")[1])
}

function timeZone() {
    nowTime = totalMinutes(`${nowHours}:${nowMinutes}`);
    getNow();
    const imsak = totalMinutes(imsakVakti);
    const gunes = totalMinutes(gunesVakti);
    const ogle = totalMinutes(ogleVakti);
    const ikindi = totalMinutes(ikindiVakti);
    const aksam = totalMinutes(aksamVakti);
    const yatsi = totalMinutes(yatsiVakti);

    if (nowTime < 0) {
        kalanZaman(imsak);
        controlActivity(0);
    }
    else if (nowTime > 0 && nowTime < imsak) {
        nextDay = false;
        getNow();
        kalanZaman(imsak)
        controlActivity(0);
    }
    else if (nowTime >= imsak && nowTime < gunes) {
        kalanZaman(gunes)
        ezanOku(imsak, 45);
        controlActivity(1);
    }
    else if (nowTime >= gunes && nowTime < ogle) {
        kalanZaman(ogle)
        ezanOku(ogle);
        controlActivity(2);
    }
    else if (nowTime >= ogle && nowTime < ikindi) {
        kalanZaman(ikindi)
        ezanOku(ikindi);
        controlActivity(3);
    }
    else if (nowTime >= ikindi && nowTime < aksam) {
        kalanZaman(aksam)
        ezanOku(aksam);
        controlActivity(4);
    }
    else if (nowTime >= aksam && nowTime < yatsi) {
        kalanZaman(yatsi);
        ezanOku(yatsi);
        controlActivity(5);
    }
    else {
        nextDay = true;
        getNow();
        timeZone();
    }
}


function kalanZaman(vakit) {
    kalanSaat.innerHTML = twoDigits(Math.floor((vakit - nowTime) / 60));
    kalanDakika.innerHTML = twoDigits(Math.floor((vakit - nowTime) % 60) - 1);
    if (kalanDakika.innerHTML < 0) {
        kalanDakika.innerHTML = 59;
        kalanSaat.innerHTML = twoDigits(kalanSaat.innerHTML - 1);
    }

    kalanSaniye.innerHTML = twoDigits(60 - nowSeconds);

    if (nowSeconds === "00") {
        kalanSaniye.innerHTML = "00";
    }

    setTimeout(() => {
        timeZone();
    }, 1000);
}

function ezanOku(vakit, time = 0) {
    if (nowTime === vakit + time - 1 && nowSeconds === "00") {
        const ezanMp3 = new Audio("music/ezan.mp3");
        ezanMp3.play();
    }
}

function loading() {
    const div = document.createElement("div")
    div.classList.add("loading")
    document.body.appendChild(div)
}

function firstUpload() {
    const frame = document.querySelector(".frame");
    frame.style.opacity = "1";
    frame.style.transition = "0.5s";
    document.querySelector(".loading").style.display = "none";
}

function controlActivity(e) {
    for (let i = 0; i < e; i++) {
        timeList.children[i].classList = ("passive")
    }

    timeList.children[e].classList = ("active")
}

getSehirler();