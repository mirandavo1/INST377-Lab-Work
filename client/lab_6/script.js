async function windowActions() {
    const endpoint = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json';

    const request = await fetch(endpoint)
    const food = await request.json()

    function findMatches(wordToMatch, food) {
        return food.filter(place => {
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
            const matchArray = findMatches(event.target.value, food);
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

}
window.onload = windowActions