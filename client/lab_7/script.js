async function dataHandler() {
  const endpoint =
    "https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json";

  const request = await fetch(endpoint);
  const zip = await request.json();

  function findMatches(wordToMatch, zip) {
    const filteredList = zip.filter((place) => {
      const repex = new RegExp(wordToMatch, "gi");
      zip = zip.slice(0, 5);
    });

    zip.forEach((place) => {
      const has_coords = place.hasOwnProperty("geocoded_column_1");
      if (has_coords) {
        const latlong = place.geocoded_column_1.coordinates;
        const marker = latlong.reverse();
        //   L.marker.addTo(document.querySelector('#mapid'));
      }
      // return place.name.match(repex) || place.category.match(repex) && has_coords;
    });
    return place.zip.match(repex);
  }

  function numberwithCommas(x) {
    return x.toString().replace(/\B(?=\d{3})+(?!\d))/g, ",");
  }

  function displayMatches(event) {
    if (event.target.value.length != 0) {
      const matchArray = findMatches(event.target.value, zip);
      const html = matchArray
        .map((place, index) => {
          return `<li class= "background">
            <span class="name"> ${place.name} </span><br>
                <i>${place.address_line_1} <br>
                        ${place.zip}</i>
            </li>`;
        })
        .join("");
      suggestions.innerHTML = html;
    } else {
      suggestions.innerHTML = "";
    }
  }

  const searchInput = document.querySelector(".search");
  const suggestions = document.querySelector(".suggestions");

  searchInput.addEventListener("input", displayMatches);

  //   searchInput.addEventListener("change", displayMatches);
  //   searchInput.addEventListener("keyup", (evt) => {
  //     displayMatches(evt);
  //   });
  // if (!e.target.value) {
  //     document.querySelector("#results").innerHTML = "";
  //     return false;
  //   }
}
window.onload = dataHandler;

function mapInit() {
  var mymap = L.map("mapid").setView([38.9331363, -76.7725779], 13);

  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken:
        "pk.eyJ1IjoibXJuZGF2byIsImEiOiJja3V1bmdmNG82MWtrMm5rNmJmY2poemxnIn0.JpoX0fzBCvWUjx4p-1icHw",
    }
  ).addTo(mymap);
}

mapInit();
