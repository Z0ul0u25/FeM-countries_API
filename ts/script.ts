"use strict";

let btn_themeToggle = null;
let select_region = null;

let themeIcon = null;
let divCountries = null;
let CountriesInfo = null;

let cur = 0;

async function getAllCountries(region: string = null): Promise<any> {
	console.log(region);
	let url =
		"https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital";

	if (region) {
		url = url.replace("all", `region/${region}`);
	}
	console.log(url);
	return fetch(url)
		.then((response) => response.json())
		.then((data) => data);
}

async function getOneCountry(name: string): Promise<any> {
	return fetch(
		`https://restcountries.com/v3.1/name/${name}?fields=nativeName,population,region,subregion,capital,topLevelDomain,currencies,languages,borders,flags`
	)
		.then((response) => response.json())
		.then((data) => data);
}

function displayCountryResume(): void {
	if (cur < CountriesInfo.length) {
		while (
			window.innerHeight + window.scrollY >=
			document.body.offsetHeight
		) {
			let card = document.createElement("div");
			card.classList.add("card");
			card.innerHTML = `
				<a href="?name=${CountriesInfo[cur].name.common.replace(" ", "_")}">
				<div class="card-flag">
					<img src="${CountriesInfo[cur].flags.png}" alt="${
				CountriesInfo[cur].name.common
			} flag" />
				</div>
				<div class="card-body">
					<h2>${CountriesInfo[cur].name.common}</h2>
					<p>Population: ${CountriesInfo[cur].population.toLocaleString()}</p>
					<p>Region: ${CountriesInfo[cur].region}</p>
					<p>Capital: ${CountriesInfo[cur].capital}</p>
				</div>
				</a>
			`;

			divCountries.appendChild(card);
			cur++;
		}
	}
}

function filtrerResultats(): void {
	console.log("Filtre");
	let region = select_region.value;
	getAllCountries(region).then((data) => {
		CountriesInfo = data;
		cur = 0;
		divCountries.innerHTML = "";
		displayCountryResume();
	});
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
	themeIcon = document.getElementById("theme-icon");
	select_region = document.getElementById("filter-select");

	divCountries = document.getElementById("countries");

	btn_themeToggle.addEventListener("click", swapTheme, false);
	select_region.addEventListener("change", filtrerResultats, false);

	let name = new URLSearchParams(window.location.search);
	if (name.size > 0) {
		console.log(name.get("name").replace("_", " "));
		getOneCountry(name.get("name").replace("_", " ")).then((data) => {
			console.log(data);
		});
	} else {
		console.log("INDEX");
		getAllCountries().then((data) => {
			CountriesInfo = data;
			displayCountryResume();
		});

		window.onscroll = function () {
			if (
				window.innerHeight + window.scrollY >=
				document.body.offsetHeight
			) {
				displayCountryResume();
			}
		};
	}
}

window.addEventListener("DOMContentLoaded", initialisation);
