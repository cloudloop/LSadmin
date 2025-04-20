<script lang="ts">
    import { onMount } from 'svelte';
    import { env } from '$env/dynamic/public';
    let map: google.maps.Map;
    let geocoder: google.maps.Geocoder;
    let savedPlaces: { lat: number; lng: number; address: string }[] = [];
    let lastClick: google.maps.LatLng | null = null; // Define the lastClick variable
  
    onMount(() => {
      const initMap = () => {
        map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
          center: { lat: 59.3293, lng: 18.0686 }, // Stockholm
          zoom: 13,
        });
        geocoder = new google.maps.Geocoder();
  
        // Track the cursor position when moving over the map
        map.addListener("mousemove", (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            lastClick = e.latLng;
          }
        });

        // Original click event handler kept for compatibility
        map.addListener("click", (e: google.maps.MapMouseEvent) => {
          if (!e.latLng) return;
          
          lastClick = e.latLng; // Update lastClick when clicking too
  
          geocoder.geocode({ location: e.latLng }, (results, status) => {
            if (status === "OK" && results && results[0]) {
              const place = {
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
                address: results[0].formatted_address,
              };
              savedPlaces = [...savedPlaces, place]; // Use reactive assignment
              new google.maps.Marker({ position: e.latLng, map });
              console.log("Saved:", place);
            } else {
              console.error("Geocoder failed:", status);
            }
          });
        });
      };
  
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${env.PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.onload = initMap;
      document.head.appendChild(script);

      const onKey = (e: KeyboardEvent) => {
        if (e.code === 'Space' && lastClick && geocoder) {
          e.preventDefault(); // Prevent page scrolling on spacebar
          
          geocoder.geocode({ location: lastClick }, (results, status) => {
            if (status === "OK" && results && results[0]) {
              const place = {
                lat: lastClick!.lat(),
                lng: lastClick!.lng(),
                address: results[0].formatted_address,
              };
              savedPlaces = [...savedPlaces, place]; // Use reactive assignment
              new google.maps.Marker({ position: lastClick, map });
              console.log("Saved place with spacebar:", place);
            } else {
              console.error("Geocoder failed:", status);
            }
          });
        }
        
        // Remove last location on backspace
        if (e.code === 'Backspace') {
          // Only prevent default if not inside an input field
          if (!(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
            e.preventDefault();
            removeLastPlace();
          }
        }
      };
      
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    });
  
    function downloadCSV() {
      if (savedPlaces.length === 0) {
        alert("No places saved yet!");
        return;
      }
      const header = "Latitude,Longitude,Address\n";
      const rows = savedPlaces.map(p => `${p.lat},${p.lng},"${p.address}"`).join("\n");
      const blob = new Blob([header + rows], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "saved_places.csv";
      a.click();
      URL.revokeObjectURL(url);
    }

    function removeLastPlace() {
      if (savedPlaces.length > 0) {
        savedPlaces = savedPlaces.slice(0, -1);
        // Remove the last marker from the map (if we had stored references to them)
        console.log("Last place removed. Remaining places:", savedPlaces.length);
      } else {
        console.log("No places to remove!");
      }
    }
</script>
  
<style>
    :global(body) {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
    
    .container {
      display: flex;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      position: relative;
    }
    
    .sidebar {
      width: 350px;
      padding: 1.25rem;
      background: #f8f9fa;
      color: #212529;
      overflow-y: auto;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
      z-index: 10;
      border-right: 1px solid #e9ecef;
    }
    
    .map {
      flex: 1;
      position: relative;
    }
    
    .title {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: #343a40;
      border-bottom: 2px solid #4285f4;
      padding-bottom: 0.5rem;
    }
    
    .instructions {
      margin-bottom: 1.25rem;
      padding: 1rem;
      background: #e8f4fd;
      border-left: 4px solid #4285f4;
      border-radius: 4px;
      font-size: 0.9rem;
      line-height: 1.5;
    }
    
    .instructions p {
      margin: 0.5rem 0;
    }
    
    .instructions strong {
      color: #1a73e8;
    }
    
    .buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }
    
    button {
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 4px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .primary-btn {
      background-color: #4285f4;
      color: white;
    }
    
    .primary-btn:hover {
      background-color: #1a73e8;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }
    
    .secondary-btn {
      background-color: #f1f3f4;
      color: #5f6368;
    }
    
    .secondary-btn:hover {
      background-color: #e8eaed;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    
    .danger-btn {
      background-color: #ea4335;
      color: white;
    }
    
    .danger-btn:hover {
      background-color: #d93025;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }
    
    .places-container {
      max-height: calc(100vh - 320px);
      overflow-y: auto;
      padding-right: 0.5rem;
    }
    
    .places-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
      font-weight: 500;
      color: #5f6368;
    }
    
    .place {
      background: white;
      padding: 0.75rem 1rem;
      margin-bottom: 0.75rem;
      border-radius: 4px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      animation: fadeIn 0.3s ease;
    }
    
    .place strong {
      color: #1a73e8;
      display: block;
      margin-bottom: 0.25rem;
      font-size: 0.95rem;
    }
    
    .place-coords {
      color: #5f6368;
      font-size: 0.85rem;
    }
    
    .no-places {
      text-align: center;
      color: #5f6368;
      padding: 2rem 0;
      font-style: italic;
    }
    
    .keyboard-shortcut {
      display: inline-block;
      background: #e8eaed;
      padding: 0.2rem 0.5rem;
      border-radius: 3px;
      font-size: 0.8rem;
      color: #5f6368;
      margin-left: 0.25rem;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
    
  <div class="container">
    <div class="sidebar">
      <div class="title">Location Saver</div>
      
      <div class="instructions">
        <p><strong>How to use:</strong></p>
        <p>• Move cursor over map & press <span class="keyboard-shortcut">Space</span> to save location</p>
        <p>• Click directly on map to save location</p>
        <p>• Press <span class="keyboard-shortcut">Backspace</span> to remove last saved location</p>
      </div>
      
      <div class="buttons">
        <button class="primary-btn" on:click={downloadCSV}>
          Download CSV ({savedPlaces.length})
        </button>
        <button class="secondary-btn" on:click={removeLastPlace}>
          Remove Last
        </button>
        {#if savedPlaces.length > 0}
          <button class="danger-btn" on:click={clearAllPlaces}>
            Clear All
          </button>
        {/if}
      </div>
      
      <div class="places-header">
        <span>Saved Locations ({savedPlaces.length})</span>
      </div>
      
      <div class="places-container">
        {#if savedPlaces.length === 0}
          <div class="no-places">No locations saved yet</div>
        {:else}
          {#each savedPlaces as place, i}
            <div class="place">
              <strong>{i+1}. {place.address}</strong>
              <div class="place-coords">
                ({place.lat.toFixed(5)}, {place.lng.toFixed(5)})
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </div>
    
    <div id="map" class="map"></div>
  </div>