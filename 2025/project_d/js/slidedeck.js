/**
 * A slide deck object
 */
class SlideDeck {
  /**
   * Constructor for the SlideDeck object.
   * @param {Node} container The container element for the slides.
   * @param {NodeList} slides A list of HTML elements containing the slide text.
   * @param {L.map} map The Leaflet map where data will be shown.
   * @param {object} slideOptions The options to create each slide's L.geoJSON
   *                              layer, keyed by slide ID.
   * @param {object} datasets The loaded datasets, keyed by dataset name.
   */
  constructor(container, slides, map, slideOptions = {}, datasets = {}) {
    this.container = container;
    this.slides = slides;
    this.map = map;
    this.slideOptions = slideOptions;
    this.datasets = datasets;

    this.dataLayer = L.layerGroup().addTo(map);
    this.currentSlideIndex = 0;
  }

  /**
   * ### updateDataLayer
   *
   * The updateDataLayer function will clear any markers or shapes previously
   * added to the GeoJSON layer on the map, and replace them with the data
   * from the specified datasets.
   *
   * @param {Array} datasetNames Array of dataset names to display
   * @param {object} options Options for each dataset
   * @return {Array} Array of GeoJSON layers that have been added to the data layer group.
   */
  updateDataLayer(datasetNames, options = {}) {
    this.dataLayer.clearLayers();
    const layers = [];

    for (const datasetName of datasetNames) {
      const data = this.datasets[datasetName];
      if (!data) continue;

      const layerOptions = {
        pointToLayer: (feature, latlng) => {
          // Create circle markers for metro stations
          if (datasetName === 'metro-stations') {
            const style = options.layerStyles && options.layerStyles[datasetName] ?
                         options.layerStyles[datasetName](feature) :
                         {
                           radius: 2,
                           fillColor: '#b7d4fcff',
                           color: '#ffffff',
                           weight: 1,
                           opacity: 0.8,
                           fillOpacity: 0.6,
                         };
            return L.circleMarker(latlng, style);
          }
          // Default marker for other point features
          return L.marker(latlng);
        },
        style: options.layerStyles && options.layerStyles[datasetName] ?
               options.layerStyles[datasetName] :
               (feature) => {
                 // Use the color from GeoJSON properties if available for metro, otherwise use defaults
                 if (datasetName === 'metro' && feature.properties && feature.properties.color) {
                   return {
                     color: `#${feature.properties.color}`,
                     weight: 4,
                     opacity: 0.8,
                   };
                 } else if (datasetName === 'metrobus') {
                   return {
                     color: '#FF6B35',
                     weight: 3,
                     opacity: 0.7,
                     dashArray: '5, 5',
                   };
                 } else if (datasetName === 'metro-stations') {
                   // Default style for metro stations (this is for line features, circle styles are in pointToLayer)
                   return {
                     radius: 2,
                     fillColor: '#cbe1ffff',
                     color: '#ffffff',
                     weight: 1,
                     opacity: 0.8,
                     fillOpacity: 0.6,
                   };
                 }
                 return {
                   color: '#c4ddffff',
                   weight: 2,
                   opacity: 0.6,
                 };
               },
        onEachFeature: options.layerTooltips && options.layerTooltips[datasetName] ?
                      options.layerTooltips[datasetName] :
                      (feature, layer) => {
                        if (datasetName === 'metro-stations' && feature.properties && feature.properties.NOMBRE) {
                          const stationName = feature.properties.NOMBRE;
                          const lineNumber = feature.properties.LINEA;
                          const stationType = feature.properties.TIPO || 'Station';
                          layer.bindTooltip(`${stationName}<br>Line ${lineNumber}<br>${stationType}`);
                        } else if (feature.properties && feature.properties.LINEA && feature.properties.RUTA) {
                          const lineNumber = feature.properties.LINEA;
                          const routeName = feature.properties.RUTA;
                          const systemName = datasetName === 'metro' ? 'Metro' : 'Metrobús';
                          layer.bindTooltip(`${systemName} Line ${lineNumber}: ${routeName}`);
                        }
                      },
      };

      const geoJsonLayer = L.geoJSON(data, layerOptions).addTo(this.dataLayer);
      layers.push(geoJsonLayer);
    }

    return layers;
  }

  /**
   * ### getSlideDatasets
   *
   * Get the datasets to display for a given slide.
   *
   * @param {HTMLElement} slide The slide's HTML element
   * @return {Array} Array of dataset names for this slide
   */
  getSlideDatasets(slide) {
    const options = this.slideOptions[slide.id];
    return options && options.datasets ? options.datasets : ['metro'];
  }

  /**
   * ### hideAllSlides
   *
   * Add the hidden class to all slides' HTML elements.
   *
   * @param {NodeList} slides The set of all slide elements, in order.
   */
  hideAllSlides() {
    for (const slide of this.slides) {
      slide.classList.add('hidden');
    }
  }

  /**
   * ### syncMapToSlide
   *
   * Go to the slide that mathces the specified ID.
   *
   * @param {HTMLElement} slide The slide's HTML element
   */
  async syncMapToSlide(slide) {
    const datasetNames = this.getSlideDatasets(slide);
    const options = this.slideOptions[slide.id];
    const layers = this.updateDataLayer(datasetNames, options);

    /**
     * Create a temporary event handler that will show tooltips on the map
     * features, after the map is done "flying" to contain the data layer.
     */
    const handleFlyEnd = () => {
      if (slide.showpopups) {
        layers.forEach((layer) => {
          layer.eachLayer((l) => {
            l.bindTooltip(l.feature.properties.label, { permanent: true });
            l.openTooltip();
          });
        });
      }
      this.map.removeEventListener('moveend', handleFlyEnd);
    };

    const boundsOptions = window.innerWidth > 600 ? {paddingBottomRight: [496, 0]} : {};

    this.map.addEventListener('moveend', handleFlyEnd);
    if (options && options.bounds) {
      this.map.flyToBounds(options.bounds, boundsOptions);
    } else {
      // Calculate combined bounds from all layers
      let combinedBounds = null;
      layers.forEach((layer) => {
        const layerBounds = layer.getBounds();
        if (layerBounds.isValid()) {
          combinedBounds = combinedBounds ? combinedBounds.extend(layerBounds) : layerBounds;
        }
      });

      if (combinedBounds && combinedBounds.isValid()) {
        this.map.flyToBounds(combinedBounds, boundsOptions);
      }
    }
  }

  /**
   * Show the slide with ID matched by currentSlideIndex. If currentSlideIndex is
   * null, then show the first slide.
   */
  syncMapToCurrentSlide() {
    const slide = this.slides[this.currentSlideIndex];
    this.syncMapToSlide(slide);
  }

  /**
   * Increment the currentSlideIndex and show the corresponding slide. If the
   * current slide is the final slide, then the next is the first.
   */
  goNextSlide() {
    this.currentSlideIndex++;

    if (this.currentSlideIndex === this.slides.length) {
      this.currentSlideIndex = 0;
    }

    this.syncMapToCurrentSlide();
  }

  /**
   * Decrement the currentSlideIndes and show the corresponding slide. If the
   * current slide is the first slide, then the previous is the final.
   */
  goPrevSlide() {
    this.currentSlideIndex--;

    if (this.currentSlideIndex < 0) {
      this.currentSlideIndex = this.slides.length - 1;
    }

    this.syncMapToCurrentSlide();
  }

  /**
   * ### preloadFeatureCollections
   *
   * All data is already loaded in the constructor, so this method is now
   * a no-op but kept for compatibility.
   */
  preloadFeatureCollections() {
    // Data is already preloaded in constructor
  }

  /**
   * Calculate the current slide index based on the current scroll position.
   */
  calcCurrentSlideIndex() {
    const scrollPos = window.scrollY - this.container.offsetTop;
    const windowHeight = window.innerHeight;

    let i;
    for (i = 0; i < this.slides.length; i++) {
      const slidePos =
        this.slides[i].offsetTop - scrollPos + windowHeight * 0.7;
      if (slidePos >= 0) {
        break;
      }
    }

    if (i !== this.currentSlideIndex) {
      this.currentSlideIndex = i;
      this.syncMapToCurrentSlide();
    }
  }
}

export { SlideDeck };
