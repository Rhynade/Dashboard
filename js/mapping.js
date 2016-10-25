$(document).ready(function() {
    map = L.map("mapid").setView([1.3521, 103.8198], 11);

    L.tileLayer("http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        // attribution: "<a target="_blank" href="https://developers.data.gov.sg/datagovsg-apis/apis/get/transport/taxi-availability">data.gov.sg</a>",
        maxZoom: 17
    }).addTo(map);

    function getColor(psf) {
        var hue = Math.floor((45 - val) * 120 / 45);  // go from green to red
        var saturation = Math.abs(val - 23)/23;   // fade to white as it approaches 50
    }

    var colorFunction = new L.HSLHueFunction(new L.Point(0, 120), new L.Point(100, 20));

    // Get Data
    $.getJSON( "data/psf.json", function( data ) {  
        // Attribution: http://stackoverflow.com/questions/17371039/how-to-add-markers-bulk-in-leaflet

        var markerArray = [];

        data.forEach( function(record) {
            markerArray.push(L.circleMarker([record["lat"], record["lon"]], {
                color: null,
                fillColor: colorFunction.evaluate(record["rank"]/2595*100),
                fillOpacity: 0.5,
                radius: 5
            }).bindPopup("latitude: " + record["lat"] + "<br> longitude: " + record["lon"] + "<br> psf: " + record["PSF"]));
        });

        var group = L.layerGroup(markerArray).addTo(map);
    }); 


    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 5, 10, 15, 20, 25],
        rank   = [0, 631, 1529, 2155, 2407, 2499]
        labels = [];

        div.innerHTML += "<p><strong>Price/Sqft</strong></p>"
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background-color:'  + colorFunction.evaluate(rank[i]/2595 * 100) + ';"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
    };

    legend.addTo(map);

});
