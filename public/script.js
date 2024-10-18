// Esperar que el DOM esté completamente cargado antes de inicializar el mapa
document.addEventListener('DOMContentLoaded', function () {
    // Inicializa el mapa centrado en una ubicación adecuada
    var map = L.map('map').setView([-34.570, -59.105], 12); // Ajusta la latitud, longitud y zoom

    // Capa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Capa WMS de GeoServer - Capa 'geonode:caps'
    var capsLayer = L.tileLayer.wms("https://geo.cidetic.unlu.edu.ar/geoserver/geonode/wms?", {
        layers: 'geonode:caps',  // Nombre de la capa
        format: 'image/png',      // Formato de la imagen
        transparent: true,        // Capa transparente
        version: '1.1.0',         // Versión WMS
        attribution: "Capa WMS de GeoServer - UNLu"
    });

    // Capa WMS de GeoServer - Capa 'geonode:areas_urbanas'
    var urbanAreasLayer = L.tileLayer.wms("https://geo.cidetic.unlu.edu.ar/geoserver/geonode/wms?", {
        layers: 'geonode:areas_urbanas',  // Nombre de la capa
        format: 'image/png',              // Formato de la imagen
        transparent: true,                // Capa transparente
        version: '1.1.0',                 // Versión WMS
        attribution: "Capa WMS de GeoServer - UNLu"
    });

    // Añadir ambas capas al mapa
    capsLayer.addTo(map);
    urbanAreasLayer.addTo(map);
});
