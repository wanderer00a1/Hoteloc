maptilersdk.config.apiKey = maptilerApiKey;

const map = new maptilersdk.Map({
  container: 'map', // container's id or the HTML element to render the map
  style: maptilersdk.MapStyle.DARK,
  center: hotel.geometry.coordinates, // starting position [lng, lat]
  zoom: 14, // starting zoom
});
const marker = new maptilersdk.Marker()
  .setLngLat(hotel.geometry.coordinates)
  .setPopup(
      new maptilersdk.Popup({ offset: 25 })
        .setHTML(
          `<h3>${hotel.title}</h3><p>${hotel.location}</p>`
        )
  )
  .addTo(map);

// new maptilersdk.Marker()
//     .setLngLat(campground.geometry.coordinates)
//     .setPopup(
//         new maptilersdk.Popup({ offset: 25 })
//             .setHTML(
//                 `<h3>${campground.title}</h3><p>${campground.location}</p>`
//             )
//     )
//     .addTo(map)