import { SlideDeck } from './slidedeck.js';

const map = L.map('map', {scrollWheelZoom: false}).setView([0, 0], 0);

// ## The Base Tile Layer
const mapboxKey = 'pk.eyJ1IjoiemhhbmNoYW8iLCJhIjoiY21nYm1mOGNpMTlycTJtb2xuczUwdjY1aCJ9.KRjlJ3Siuf2p0OKSsngcGw';

const baseTileLayer = L.tileLayer(
    `https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/{z}/{x}/{y}{r}?access_token=${mapboxKey}`,
    {
      maxZoom: 16,
      attribution: '&copy; <a href="https://www.mapbox.com/" target="_blank">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
      tileSize: 512,
      zoomOffset: -1,
    },
);
baseTileLayer.addTo(map);

// ## Interface Elements
const container = document.querySelector('.slide-section');
const slides = document.querySelectorAll('.slide');

// ## load GeoJSON data
const resp = await fetch('data/lines.geojson');
const metroData = await resp.json();

const respMetrobus = await fetch('data/metrobus.geojson');
const metrobusData = await respMetrobus.json();

const respMetroStations = await fetch('data/metro-station.geojson');
const metroStationsData = await respMetroStations.json();

const slideOptions = {
  'title-slide': {
    bounds: L.geoJSON(metroData).getBounds(),
    datasets: ['metro', 'metrobus'],
    layerStyles: {
      'metrobus': (feature) => {
        return {
          color: `#${feature.properties.color}`,
          weight: 3,
          opacity: 0.7,
          dashArray: '5, 5',
        };
      },
    },
  },
  'metro-origins': {
    bounds: L.geoJSON(metroData.features.find((f) => f.properties.LINEA == '1')).getBounds(),
    datasets: ['metro', 'metro-stations'],
    layerStyles: {
      'metro': (feature) => {
        const isLine1 = feature.properties.LINEA === '1';
        return {
          color: `#${feature.properties.color}`,
          weight: isLine1 ? 5 : 2,
          opacity: isLine1 ? 1.0 : 0.3,
        };
      },
      'metro-stations': (feature) => {
        const isLine1 = feature.properties.LINEA === '01';
        return {
          radius: isLine1 ? 6 : 2,
          fillColor: isLine1 ? '#f799c3ff' : '#CCCCCC',
          color: '#ffffff',
          weight: 2,
          opacity: isLine1 ? 1.0 : 0.5,
          fillOpacity: isLine1 ? 0.9 : 0.6,
        };
      },
    },
  },
  'metro-today-upgrades': {
    datasets: ['metro', 'metro-stations'],
    layerTooltips: {
      'metro': (feature, layer) => {
        const lineNumber = feature.properties.LINEA;
        const routeName = feature.properties.RUTA;
        layer.bindTooltip(`Metro Line ${lineNumber}: ${routeName}`);
      },
      'metro-stations': (feature, layer) => {
        const stationName = feature.properties.NOMBRE;
        const lineNumber = feature.properties.LINEA;
        const stationType = feature.properties.TIPO;
        layer.bindTooltip(`${stationName}<br>Line ${lineNumber}<br>${stationType}`);
      },
    },
  },
  'metro-experience-safety': {
    datasets: ['metro', 'metro-stations'],
    layerStyles: {
      'metro-stations': (feature) => {
        const isTransferOrTerminal = feature.properties.TIPO.includes('Transbordo') ||
                                    feature.properties.TIPO.includes('Terminal');
        return {
          radius: isTransferOrTerminal ? 5 : 2,
          fillColor: isTransferOrTerminal ? '#E74C3C' : '#3498DB',
          color: '#ffffff',
          weight: 1,
          opacity: 0.9,
          fillOpacity: isTransferOrTerminal ? 0.8 : 0.6,
        };
      },
    },
  },
  'metrobus-origins': {
    datasets: ['metrobus'],
    layerStyles: {
      'metrobus': (feature) => {
        return {
          color: `#${feature.properties.color}`,
          weight: 3,
          opacity: 0.7,
          dashArray: '5, 5',
        };
      },
    },
  },
  'metrobus-growth-electrification': {
    datasets: ['metrobus'],
    layerStyles: {
      'metrobus': (feature) => {
        return {
          color: `#${feature.properties.color}`,
          weight: 3,
          opacity: 0.7,
          dashArray: '5, 5',
        };
      },
    },
  },
};

// ## The SlideDeck object
const deck = new SlideDeck(container, slides, map, slideOptions, {
  'metro': metroData,
  'metrobus': metrobusData,
  'metro-stations': metroStationsData,
});


document.addEventListener('scroll', () => deck.calcCurrentSlideIndex());

deck.preloadFeatureCollections();
deck.syncMapToCurrentSlide();
