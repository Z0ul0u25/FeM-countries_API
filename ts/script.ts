"use strict";

let btn_themeToggle: HTMLElement = null;
let div_search: HTMLElement = null;
let select_region: HTMLSelectElement = null;
let search_input: HTMLInputElement = null;
let button_return: HTMLElement = null;

let themeIcon: HTMLImageElement = null;
let div_content: HTMLElement = null;
let CountriesInfo: Array<any> = null;
let CountriesInfoFiltered: Array<any> = null;

let cur: number = 0;

async function getAllCountries(region: string = null): Promise<any> {
	let url: string = "https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital,cca3";
	// Uncomment the following line to test the fallback
	// url = "DEBUG";

	if (region) {
		// replace "all" by the region filter
		url = url.replace("all", `region/${region}`);
	}
	let response = await fetch(url);

	// Fallback to local data if API is down
	if (!response.ok) {
		response = await fetch("../data.json");
	}

	return response.json();
}

async function getOneCountry(cca3: string): Promise<any> {
	let url: string = `https://restcountries.com/v3.1/alpha/${cca3}?fields=name,nativeName,population,region,subregion,capital,topLevelDomain,currencies,languages,borders,flags`;
	// Uncomment the following line to test the fallback
	// url = "DEBUG";

	let response = await fetch(url);
	if (!response.ok) {
		response = await fetch("../data.json");
	}

	return response.json();
}

async function getBorderCountryFullName(cca3: string): Promise<any> {
	let url: string = `https://restcountries.com/v3.1/alpha/${cca3}?fields=name,cca3`;
	// Uncomment the following line to test the fallback
	// url = "DEBUG";

	let response = await fetch(url);

	if (!response.ok) {
		response = await fetch("../data.json");
	}

	return response.json();
}

function displayCountryResume(): void {
	while (cur < CountriesInfoFiltered.length && window.innerHeight + window.scrollY >= document.body.offsetHeight) {
		let card: HTMLElement = document.createElement("div");
		card.classList.add("card");
		card.innerHTML = `
				<a href="?name=${CountriesInfoFiltered[cur].cca3}">
				<div class="card-flag">
					<img src="${CountriesInfoFiltered[cur].flags.svg}" alt="${CountriesInfoFiltered[cur].name.common} flag" />
				</div>
				<div class="card-body">
					<h2>${CountriesInfoFiltered[cur].name.common}</h2>
					<ul>
					<li>Population: ${CountriesInfoFiltered[cur].population.toLocaleString()}</li>
					<li>Region: ${CountriesInfoFiltered[cur].region}</li>
					<li>Capital: ${CountriesInfoFiltered[cur].capital}</li>
					</ul>
				</div>
				</a>
			`;

		div_content.appendChild(card);
		cur++;
	}
}

function displayOneCountry(country): void {
	let flag_div: HTMLElement = document.createElement("div");
	let flag_img: HTMLImageElement = document.createElement("img");

	let info_div: HTMLElement = document.createElement("div");
	let info_ul: HTMLElement = document.createElement("ul");

	let nativeNamesObj: Object = {};
	for (const NAME in country.name.nativeName) {
		nativeNamesObj[country.languages[NAME]] = country.name.nativeName[NAME].common;
	}

	info_ul.innerHTML = `
		<li><h2>${country.name.common}</h2></li>
		<li>Native Name:
			<ul>
				<li>${Object.keys(nativeNamesObj)
					.map((key) => key + ": " + nativeNamesObj[key])
					.join("</li><li>")}
				</li>
			</ul>
		</li>
		<li>Population: ${country.population.toLocaleString()}</li>
		<li>Region: ${country.region}</li>
		<li>Sub Region: ${country.subregion}</li>
		<li>Capital: ${country.capital}</li>
		<li>Top Level Domain: ${country.topLevelDomain}</li>
		<li>Currencies: ${Object.values(country.currencies)
			.map((currency: any) => currency.name)
			.join(", ")}</li>
		<li>Languages: ${Object.values(country.languages)
			.map((language: any) => language)
			.join(", ")}</li>`;

	if (country.borders.length == 0) {
		info_ul.innerHTML += `<li>Borders: None</li>`;
	} else {
		info_ul.innerHTML += `<li>Borders: <ul id="borders"></ul></li>`;
		country.borders.forEach((border: string) => {
			getBorderCountryFullName(border).then((data) => {
				if (data.length > 1) {
					data = data.filter((country) => border.includes(country.cca3))[0];
				}
				document.getElementById(
					"borders"
				).innerHTML += `<li class="link_country"><a href="?name=${data.cca3}">${
					data.name.common
				}</a></li>`;
			});
		});
	}

	flag_img.src = country.flags.svg;
	flag_img.alt = `${country.name.common} flag`;

	flag_div.classList.add("flag");
	flag_div.appendChild(flag_img);
	info_div.appendChild(info_ul);

	div_content.classList.add("info");
	div_content.appendChild(flag_div);
	div_content.appendChild(info_div);
}

function filtrerResultats(): void {
	let search: string = search_input.value;

	CountriesInfoFiltered = CountriesInfo.filter((country) =>
		country.name.common.toLowerCase().includes(search.toLowerCase())
	);
	if (select_region.value != "all") {
		CountriesInfoFiltered = CountriesInfoFiltered.filter((country) => country.region == select_region.value);
	}
	cur = 0;
	div_content.innerHTML = "";
	displayCountryResume();
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
	button_return = document.getElementById("button_return");

	div_content = document.getElementById("content");

	btn_themeToggle.addEventListener("click", swapTheme, false);
	select_region.addEventListener("change", filtrerResultats, false);
	search_input.addEventListener("input", filtrerResultats, false);

	let cca3: URLSearchParams = new URLSearchParams(window.location.search);
	if (cca3.size > 0) {
		// Country page
		div_content.classList.add("unique");

		div_search.hidden = true;
		button_return.hidden = false;
		getOneCountry(cca3.get("name")).then((data) => {
			if (data.length > 1) {
				data = data.filter((country) => cca3.get("name").includes(country.cca3))[0];
			}
			displayOneCountry(data);
		});
	} else {
		// Index page
		div_content.classList.add("gallery");

		getAllCountries().then((data) => {
			CountriesInfo = data;
			filtrerResultats();
		});

		window.onscroll = function () {
			if (
				window.innerHeight + window.scrollY >= document.body.offsetHeight &&
				cur < CountriesInfoFiltered.length
			) {
				displayCountryResume();
			}
		};
		window.addEventListener("resize", (ev) => displayCountryResume(), false); // Had to add (ev) to avoid error
	}
}

window.addEventListener("DOMContentLoaded", initialisation);
