 mapboxgl.accessToken = "<%= mapToken %>";


    console.log(
        "Mapbox token exists:",
        !!mapboxgl.accessToken
    );


    // ==========================================
    // CREATE MAP
    // ==========================================

    const map = new mapboxgl.Map({

        container: "map",

        style: "mapbox://styles/mapbox/streets-v12",

        center: [78.9629, 20.5937],

        zoom: 4

    });