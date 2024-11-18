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
let div_search = null;
let select_region = null;
let search_input = null;
let themeIcon = null;
let div_content = null;
let CountriesInfo = null;
let CountriesInfoFiltered = null;
let cur = 0;
function getAllCountries(region = null) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = "https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital";
        if (region) {
            url = url.replace("all", `region/${region}`);
        }
        return fetch(url)
            .then((response) => response.json())
            .then((data) => data)
            .catch((err) => {
            fetch("./data.json").then((response) => response.json());
        });
    });
}
function getOneCountry(name) {
    return __awaiter(this, void 0, void 0, function* () {
        return fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,nativeName,population,region,subregion,capital,topLevelDomain,currencies,languages,borders,flags`)
            .then((response) => response.json())
            .then((data) => data);
    });
}
function displayCountryResume(Countries = CountriesInfo) {
    while (cur < Countries.length && window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        let card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
				<a href="?name=${Countries[cur].name.common.replace(" ", "_")}">
				<div class="card-flag">
					<img src="${Countries[cur].flags.svg}" alt="${Countries[cur].name.common} flag" />
				</div>
				<div class="card-body">
					<h2>${Countries[cur].name.common}</h2>
					<p>Population: ${Countries[cur].population.toLocaleString()}</p>
					<p>Region: ${Countries[cur].region}</p>
					<p>Capital: ${Countries[cur].capital}</p>
				</div>
				</a>
			`;
        div_content.appendChild(card);
        cur++;
    }
}
function displayOneCountry(country) {
    let flag_div = document.createElement("div");
    let flag_img = document.createElement("img");
    let info_div = document.createElement("div");
    let info_ul = document.createElement("ul");
    info_ul.innerHTML = `
		<li><h2>${country.name.common}</h2></li>
		<li>Native Name: ${country.name.common}</li>
		<li>Population: ${country.population.toLocaleString()}</li>
		<li>Region: ${country.region}</li>
		<li>Sub Region: ${country.subregion}</li>
		<li>Capital: ${country.capital}</li>
		<li>Top Level Domain: ${country.topLevelDomain}</li>
		<li>Currencies: ${Object.keys(country.currencies).map((currency) => currency.name).join(", ")}</li>
		<li>Languages: ${Object.keys(country.languages).map((language) => language.name).join(", ")}</li>
		<li>Borders: ${country.borders.join(", ")}</li>
	`;
    flag_img.src = country.flags.svg;
    flag_img.alt = `${country.name.common} flag`;
    flag_div.appendChild(flag_img);
    info_div.appendChild(info_ul);
    div_content.appendChild(flag_div);
    div_content.appendChild(info_div);
}
function filtrerResultats() {
    // let region = select_region.value;
    let search = search_input.value;
    CountriesInfoFiltered = CountriesInfo.filter((country) => country.name.common.toLowerCase().includes(search.toLowerCase()));
    cur = 0;
    div_content.innerHTML = "";
    displayCountryResume(CountriesInfoFiltered);
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
    div_search = document.getElementById("search");
    select_region = document.getElementById("filter-select");
    search_input = document.getElementById("search-input");
    div_content = document.getElementById("content");
    btn_themeToggle.addEventListener("click", swapTheme, false);
    select_region.addEventListener("change", filtrerResultats, false);
    search_input.addEventListener("input", filtrerResultats, false);
    let name = new URLSearchParams(window.location.search);
    if (name.size > 0) {
        div_content.classList.add("unique");
        div_content.classList.remove("gallery");
        div_search.hidden = true;
        getOneCountry(name.get("name").replace("_", " ")).then((data) => {
            displayOneCountry(data[0]);
        });
    }
    else {
        console.log("INDEX");
        div_content.classList.remove("unique");
        div_content.classList.add("gallery");
        getAllCountries().then((data) => {
            CountriesInfo = data;
            filtrerResultats();
        });
        window.onscroll = function () {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                displayCountryResume();
            }
        };
        window.addEventListener("resize", (ev) => displayCountryResume(), false); // Had to add (ev) to avoid error
    }
}
window.addEventListener("DOMContentLoaded", initialisation);
//# sourceMappingURL=script.js.map