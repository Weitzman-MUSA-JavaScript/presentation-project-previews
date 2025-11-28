# Inside Mexico City's High-Capacity Transit: <br> Metro and Metrobús Shaping Flows of People, Places, and Possibility

**Author:** Zhanchao Yang  
**Date:** October 3, 2025 <br>
https://zyang91.github.io/mexico-city-metro-storymap/

## Project Overview

This interactive story map explores Mexico City's comprehensive high-capacity transit system, featuring both the Metro and Metrobús (Bus Rapid Transit) networks. Through data visualization and narrative storytelling, the project illustrates how these transportation systems anchor daily life at a metropolitan scale, connecting distant neighborhoods and shaping urban flows across one of the world's largest cities. This project is deployed via GitHub Pages. 

### Content Overview

The story map covers multiple dimensions of Mexico City's transit system:

1. **Metro System**
   - **Origins**: Launched in 1969 with color-coded lines and distinctive station pictograms that became part of the city's visual identity
   - **Current State**: A dozen lines and nearly 200 stations providing frequent service across radial and cross-town corridors
   - **Recent Upgrades**: Infrastructure modernization, rolling stock renewal, operations improvements, and enhanced wayfinding
   - **Rider Experience & Safety**: Platform management, lighting and CCTV improvements, and enhanced accessibility features

2. **Metrobús (BRT) System**
   - **Origins**: Launched in 2005 with center-running busways, off-board fare collection, and level boarding
   - **Growth & Electrification**: Multiple corridors connecting major hubs, fleet renewal with articulated vehicles, and zero-emission buses

3. **System Integration & Equity**
   - **Transfers and MI Card**: Unified fare system simplifying interchanges between Metro, Metrobús, and other modes
   - **Equity & Access**: First-/last-mile connections including safer crossings, improved sidewalks, feeder buses, and bike links
   - **Accessibility**: Retrofits including ramps, elevators, and tactile paving for universal access

4. **Sustainability & Urban Impact**
   - **Climate Benefits**: Mode shift reduces carbon emissions, congestion, and frees street space
   - **Public Space**: Enhanced streetscapes with trees, shade, seating, and stormwater management
   - **Operations & Resilience**: Preventive maintenance, power redundancy, drainage systems, and transparent performance reporting

5. **Future Vision**: Reliable core service, zero-emission fleets, equitable coverage, orbital links, and upgraded stations supporting a healthier, more connected, and resilient Mexico City

## Target Audience

- **Urban planning professionals** seeking insights into large-scale transit system design and implementation
- **Mexico City residents** wanting better to understand their transit system's evolution and future
- **International visitors** planning to navigate the city's public transportation

## Data Sources

### Transit Network Data
- **Mexico City Metro Lines**: GeoJSON data (`data/lines.geojson`) containing geometry and properties for all 12 metro lines with color coding
- **Metro Stations**: GeoJSON data (`data/metro-station.geojson`) with locations and attributes for approximately 195 stations
- **Metrobús Network**: GeoJSON data (`data/metrobus.geojson`) containing BRT corridor geometries and properties

### Primary Data Sources
- **Sistema de Transporte Colectivo Metro** (Mexico City Metro): Official metro system data and network information - https://metro.cdmx.gob.mx/
- **Mexico City Government Open Data Portal**: https://mexicocity.cdmx.gob.mx/

### Map Imagery & Attribution
- **MapBox Layer**: https://www.mapbox.com/maps/light
- **Base Map Data**: © OpenStreetMap contributors - https://www.openstreetmap.org/copyright
- **Station Icons**: Wikipedia - https://en.wikipedia.org/wiki/Mexico_City_Metro

## Technical Details

### Technology Stack
- **Mapping Library**: [Leaflet.js](https://leafletjs.com/) v1.9.4 - Open-source JavaScript library for interactive maps
- **Template**: Scrollytelling template from MUSA-JavaScript course
- **Data Format**: GeoJSON for all geographic data
- **Languages**: HTML5, CSS3, JavaScript (ES6 modules)

### Key Libraries & Dependencies
- **Leaflet.js**: Core mapping functionality, layer management, and geographic data visualization
- **Custom SlideDeck Module**: Manages scroll-based narrative progression and map synchronization
- **Google Fonts**: Playfair Display and Lora typefaces for enhanced typography

### Project Structure
```
mexico-city-metro-storymap/
├── index.html              # Main story map HTML
├── css/
│   └── index.css          # Styling for the story map
├── js/
│   ├── index.js           # Main JavaScript file with map configuration and slide options
│   └── slidedeck.js       # SlideDeck class for scroll-driven map updates
├── data/
│   ├── lines.geojson      # Metro line geometries
│   ├── metro-station.geojson  # Metro station point data
│   └── metrobus.geojson   # Metrobús corridor geometries
└── pic/                   # Images and icons used throughout the story map
```



## Acknowledgments

### Data Providers
- **Sistema de Transporte Colectivo Metro** for providing comprehensive metro system data
- **Metrobús** for BRT network information and their ongoing commitment to serving millions of residents daily

### Research & Inspiration
- **Dr. Erick Guerra** for his research on the Mexico City transit system, which inspired this storymap

### Technical Support
- **Prof. Mjumbe Poe** for valuable technical support and guidance
- **Leaflet.js community** for mapping tools and documentation
- **MUSA-JavaScript course** for the scrollytelling template and narrative structure

### Images & Assets
- Various images sourced from official Mexico City government websites, Wikipedia, and stock photo repositories (see individual image credits in the story map)

---

*This story map demonstrates the power of combining geographic data, interactive visualization, and narrative storytelling to communicate complex urban systems and their impact on metropolitan life. The project aims to highlight the vital role of public transit in creating more sustainable, equitable, and connected cities.*

*Work for MUSA-Javascript course*
