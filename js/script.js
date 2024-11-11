"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let btn_themeToggle = null;
let themeIcon = null;
let divCountries = null;
let CountriesInfo = null;
let cur = -1;
function getAllCountries(region = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = "https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital";
        if (region) {
            url.replace("all", `region/${region}`);
        }
        return fetch(url)
            .then((response) => response.json())
            .then((data) => data);
    });
}
function getOneCountry(name) {
    return __awaiter(this, void 0, void 0, function* () {
        return fetch(`https://restcountries.com/v3.1/name/${name}?fields=nativeName,population,region,subregion,capital,topLevelDomain,currencies,languages,borders,flags`)
            .then((response) => response.json())
            .then((data) => data);
    });
}
function displayCountryResume() {
    if (++cur < CountriesInfo.length) {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            let card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
				<img src="${CountriesInfo[cur].flags.png}" alt="${CountriesInfo[cur].name.common}" />
				<div class="card-body">
					<h2>${CountriesInfo[cur].name.common}</h2>
					<p>Population: ${CountriesInfo[cur].population}</p>
					<p>Region: ${CountriesInfo[cur].region}</p>
					<p>Capital: ${CountriesInfo[cur].capital}</p>
				</div>
			`;
            divCountries.appendChild(card);
        }
    }
    console.log(cur);
}
function swapTheme() {
    if (document.body.classList.toggle("dark")) {
        themeIcon.src = "images/moon-full.svg";
    }
    if (document.body.classList.toggle("light")) {
        themeIcon.src = "images/moon-empty.svg";
    }
}
function initialisation() {
    btn_themeToggle = document.getElementById("theme-toggle");
    themeIcon = document.getElementById("theme-icon");
    divCountries = document.getElementById("countries");
    btn_themeToggle.addEventListener("click", swapTheme, false);
    let name = new URLSearchParams(window.location.search);
    if (name.size > 0) {
        console.log(name.get("name"));
    }
    else {
        console.log("INDEX");
        getAllCountries().then((data) => {
            CountriesInfo = data;
            while (document.body.offsetHeight < window.innerHeight) {
                displayCountryResume();
            }
        });
        window.onscroll = function () {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                displayCountryResume();
            }
        };
    }
}
window.addEventListener("DOMContentLoaded", initialisation);
//# sourceMappingURL=script.js.map