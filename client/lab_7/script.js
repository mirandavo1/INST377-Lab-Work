async function windowActions() {
    const endpoint = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json';

    const request = await fetch(endpoint)
    const zip = await request.json()

    function findMatches(wordToMatch, zip) {
        return zip.filter(place => {
            const repex = new RegExp(wordToMatch, 'gi');
            return place.name.match(repex) || place.category.match(repex);
        });
    }

    function numberwithCommas(x) {
        return x.toString().replace(/\B(?=\d{3})+(?!\d))/g, ',');
    }

    function displayMatches(event) {
        console.log(event.target.value);
        console.log(event.target.value.length);
        if (event.target.value.length != 0) {
            const matchArray = findMatches(event.target.value, zip);
            const html = matchArray.map(place => {
                return `
            <li>
                ${place.name}, <br>
                    ${place.category} <br>\
                    <i>${place.address_line_1} <br>
                            ${place.zip}</i>
                </li>
                `}).join('');
            suggestions.innerHTML = html;
        } else {
            suggestions.innerHTML = '';
        }
    }

    const searchInput = document.querySelector('.search');
    const suggestions = document.querySelector('.suggestions');

    searchInput.addEventListener('change', displayMatches);
    searchInput.addEventListener('keyup', (evt) => { displayMatches(evt) });
    // if (!e.target.value) {
    //     document.querySelector("#results").innerHTML = "";
    //     return false;
    //   }

    var mymap = L.map('mapid').setView([51.505, -0.09], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'your.mapbox.access.token'
}).addTo(mymap);

var marker = L.marker([51.5, -0.09]).addTo(mymap);

}
window.onload = windowActions