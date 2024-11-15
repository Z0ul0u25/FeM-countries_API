"use strict";

let btn_themeToggle: HTMLElement = null;
let div_search: HTMLElement = null;
let select_region: HTMLSelectElement = null;
let search_input: HTMLInputElement = null;

let themeIcon: HTMLImageElement = null;
let div_Countries: HTMLElement = null;
let CountriesInfo: Array<any> = null;
let CountriesInfoFiltered: Array<any>= null;

let cur: number= 0;

async function getAllCountries(region: string = null): Promise<any> {
	let url: string = "https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital";

	if (region) {
		url = url.replace("all", `region/${region}`);
	}

	return fetch(url)
		.then((response) => response.json())
		.then((data) => data)
		.catch((err) => {
			fetch("./data.json").then((response) => response.json());
		});
}

async function getOneCountry(name: string): Promise<any> {
	return fetch(
		`https://restcountries.com/v3.1/name/${name}?fields=name,nativeName,population,region,subregion,capital,topLevelDomain,currencies,languages,borders,flags`
	)
		.then((response) => response.json())
		.then((data) => data);
}

function displayCountryResume(Countries: Array<any> = CountriesInfo): void {
	while (cur < Countries.length && window.innerHeight + window.scrollY >= document.body.offsetHeight) {
		let card: HTMLElement = document.createElement("div");
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

		div_Countries.appendChild(card);
		cur++;
	}
}

function displayOneCountry(country): void {
	console.log(country);

	let flag_div: HTMLElement = document.createElement("div");
	let flag_img: HTMLImageElement = document.createElement("img");

	flag_img.src = country.flags.svg;
	flag_img.alt = `${country.name.common} flag`;

	flag_div.appendChild(flag_img);
	div_Countries.appendChild(flag_div);
}

function filtrerResultats(): void {
	// let region = select_region.value;
	let search: string = search_input.value;

	CountriesInfoFiltered = CountriesInfo.filter((country) => country.name.common.toLowerCase().includes(search.toLowerCase()))
	cur = 0;
	div_Countries.innerHTML = "";
	displayCountryResume(CountriesInfoFiltered);
}

function swapTheme(): void {
	if (document.body.classList.toggle("dark")) {
		themeIcon.src = "images/moon-full.svg";
	}

	if (document.body.classList.toggle("light")) {
		themeIcon.src = "images/moon-empty.svg";
	}
}

function initialisation(): void {
	btn_themeToggle = document.getElementById("theme-toggle");
	themeIcon = <HTMLImageElement>document.getElementById("theme-icon");
	div_search = document.getElementById("search");
	select_region = <HTMLSelectElement>document.getElementById("filter-select");
	search_input = <HTMLInputElement>document.getElementById("search-input");

	div_Countries = document.getElementById("countries");

	btn_themeToggle.addEventListener("click", swapTheme, false);
	select_region.addEventListener("change", filtrerResultats, false);
	search_input.addEventListener("input", filtrerResultats, false);

	let name: URLSearchParams = new URLSearchParams(window.location.search);
	if (name.size > 0) {
		console.log(name.get("name").replace("_", " "));
		div_search.hidden = true;
		getOneCountry(name.get("name").replace("_", " ")).then((data) => {
			displayOneCountry(data[0]);
		});
	} else {
		console.log("INDEX");
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
