async function dataHandler() {
  let mymap = mapInit();

  const endpoint =
    "https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json";

  const request = await fetch(endpoint);
  const data = await request.json();

  let markers = [];

  function findMatches(zip, data, mymap) {
    const filteredList = data.filter((place) => {
      return place.zip.startsWith(zip);
    });

    const limitedList = filteredList.slice(0, 5);

    limitedList.forEach((place, index) => {
      const has_coords = place.hasOwnProperty("geocoded_column_1");
      if (has_coords) {
        const latlong = place.geocoded_column_1.coordinates;
        const marker = latlong.reverse();
        markers.push(L.marker(marker).addTo(mymap));
        if (index === 0) mymap.setView(marker);
      }
    });

    return limitedList;
  }

  function numberwithCommas(x) {
    return x.toString().replace(/\B(?=\d{3})+(?!\d))/g, ",");
  }

  function displayMatches(event) {
    markers.forEach((marker) => {
      marker.remove();
    });
    if (event.target.value.length != 0) {
      const matchArray = findMatches(event.target.value, data, mymap);
      console.log(matchArray);
      const html = matchArray
        .map((place) => {
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
  const mymap = L.map("mapid").setView([38.9889562, -76.9441159], 13);

  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 12,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken:
        "pk.eyJ1IjoibXJuZGF2byIsImEiOiJja3V1bmdmNG82MWtrMm5rNmJmY2poemxnIn0.JpoX0fzBCvWUjx4p-1icHw",
    }
  ).addTo(mymap);

  const marker = L.marker([38.9889562, -76.9441159]).addTo(mymap);

  return mymap;
}
