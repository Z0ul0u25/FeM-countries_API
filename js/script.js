function getAllCountries(region = null) {
    let url = 'https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital';
    if (region) {
        url.replace('all', `region/${region}`);
    }
    return fetch(url)
        .then((response) => response.json())
        .then((data) => data);
}
function getOneCountry(name) {
    return fetch(`https://restcountries.com/v3.1/name/${name}?fields=nativeName,population,region,subregion,capital,topLevelDomain,currencies,languages,borders,flags`)
        .then((response) => response.json())
        .then((data) => data);
}
function initialisation() {
    let name = new URLSearchParams(window.location.search);
    if (name.size > 0) {
        console.log(name.get('name'));
    }
    else {
        console.log('INDEX');
    }
}
window.addEventListener('DOMContentLoaded', initialisation);
//# sourceMappingURL=script.js.map