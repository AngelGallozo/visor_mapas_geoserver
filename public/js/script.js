// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {

    /** Objeto Mapa de Leaflet */
    const map = L.map('map', { zoomDelta: 0.25, zoomSnap: 0 }).setView(
        [-34.6, -59.1],
        9
    );

    /** Capas bases para el mapa */
    const tiles = {
        OSM: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
        Satélite: L.tileLayer(
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        ),
        Darck: L.tileLayer(
            'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        ),
    };

    // Agregar la capa base por defecto
    tiles['OSM'].addTo(map);

    // Escala gráfica
    L.control.scale().addTo(map);

    /** Control jerárquico para seleccionar las capas */
    var layerControl = null;

    Promise.all(mapasDefinicion.map(async (capa) => {
        let layer = L.tileLayer.wms("https://cida.usgs.gov/ngwmn-geoserver/ngwmn/wms?", {
            layers: capa.capaWMS,
            format: 'image/png',
            transparent: true,
            version: '1.1.0',
            opacity: capa.estilo.opacity,
        });
        return {
            titulo: capa.titulo,
            mapa: layer,
        };
    })).then(capas => {
        layerControl = L.control.layers.tree([], [
            {
                label: 'Capas',
                children: capas.map((capa) => {
                    return {
                        label: capa.titulo,
                        layer: capa.mapa,
                    };
                }),
            },
        ], {
            collapsed: false,
            openedSymbol: '<i class="fa fa-folder-open"></i>',
            closedSymbol: '<i class="fa fa-folder"></i>',
        });

        layerControl.addTo(map);
        document.getElementById('panel-capas').appendChild(layerControl.getContainer());
    });

    var controlBase = L.control.layers(tiles, null, { collapsed: false }).addTo(map);
    document.getElementById('panel-bases').appendChild(controlBase.getContainer());

    // // Medición
    // L.Measure = {
    //     linearMeasurement: "Distancia",
    //     areaMeasurement: "Área",
    //     start: "Inicio",
    //     meter: "m",
    //     kilometer: "km",
    //     squareMeter: "m²",
    //     squareKilometers: "km²",
    // };

    // L.control.measure().addTo(map);

    //Agregar funcionalidad Click a las opciones del sidebar
    setClickOptionsSidebar();
    closeSideBarForIcon();


});



// Actualizar Visualizacion Panel
function updateShowPanel(item,show=true){
     // Mostrar panel
     var idpanel = item.querySelector('a').id;
     var nombrePanel = idpanel.replace('btn-','')
     var panel = document.getElementById('panel-'+nombrePanel);

     if (show){
        panel.classList.add('show-panel')
     }else{
        panel.classList.remove('show-panel')
     }
     
}


// Agregar funcionalidad Click a las opciones del sidebar
function setClickOptionsSidebar(){
    // Selecciona todos los elementos <li> en el sidebar
    const sidebarItems = document.querySelectorAll('#sidebar .leaflet-sidebar-tabs li');
    const sidebar = document.getElementById('sidebar');
    const allContentPanels = document.getElementsByClassName('leaflet-sidebar-content')[0];

    // Itera sobre cada elemento <li>
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            // Verifica si el elemento ya tiene la clase 'active'
            if (item.classList.contains('active')) {
                // Ocultamos contenido del Panel
                allContentPanels.classList.remove('show-content')
                // Si tiene 'active', lo quita y colapsa el sidebar
                item.classList.remove('active');
                sidebar.classList.add('collapsed'); // Colapsa el sidebar
                updateShowPanel(item,false)

            } else {
                // Si no tiene 'active', quita 'active' de todos los <li>
                sidebarItems.forEach(li => {
                    li.classList.remove('active'); // Desactivo los tabs activos anteriormente
                    updateShowPanel(li,false); // Desactivo los panels activos anteriormente
                });
                // Asigna 'active' solo al elemento clicado
                item.classList.add('active');
                // Expande el sidebar
                sidebar.classList.remove('collapsed');
                updateShowPanel(item)
                // Mostramos contenido del Panel
                allContentPanels.classList.add('show-content')
            }
        });
    });
}

// Cerrar SideBar al tocar icon en el header
function closeSideBarForIcon() {
    const iconsClose = document.querySelectorAll('.leaflet-sidebar-close'); // Selecciona todos los iconos
    const sidebar = document.getElementById('sidebar');
    const sidebarItems = document.querySelectorAll('#sidebar .leaflet-sidebar-tabs li');
    const allContentPanels = document.querySelector('.leaflet-sidebar-content'); // Selecciona el contenedor del contenido

    iconsClose.forEach(icon => {
        icon.addEventListener('click', () => {
            sidebarItems.forEach(li => {
                li.classList.remove('active'); // Desactivo los tabs activos anteriormente
                updateShowPanel(li, false); // Desactivo los panels activos anteriormente
                sidebar.classList.add('collapsed'); // Colapsa el sidebar
                
                // Oculta el contenido del panel Completo
                allContentPanels.classList.remove('show-content');
            });
        });
    });
}
