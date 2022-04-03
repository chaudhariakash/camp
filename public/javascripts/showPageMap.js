mapboxgl.accessToken = 'pk.eyJ1IjoiYWthc2hjaGF1ZGhhcmkyMDIwIiwiYSI6ImNsMTA0enNxcTB3YWgzaW8xd2h2MnphN2MifQ.cCFeBKRBBNAnIKARWXkioQ';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
center:campground.geometry.coordinates,
zoom:9
});
map.addControl(new mapboxgl.NavigationControl());



new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.title}</h3><p>${campground.location}</p>`
            )
    )
    .addTo(map)