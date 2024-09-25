<script>
    export let visible = false;
    export let onClose;
    export let title = "위 이미지를 길게 눌러 저장하세요!"; // Dialog title
    export let description = ""; // Dialog description
    export let svgText;
    
    let svgDataUrl = '';

    // Subscribe to the svgStore and update svgDataUrl when the store changes
    $: {
        if (svgText) {
            loadSVGFromStore(svgText);
        }
    }

    function loadSVGFromStore(svgText) {
      // Convert the SVG text to a DOM object
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
      const svg = svgDoc.querySelector('svg');

      if (svg) {
        // Serialize the SVG to a string
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);
        
        // Determine the SVG size
        let width = svg.getAttribute('width');
        let height = svg.getAttribute('height');

        // If width or height are not set, use viewBox to determine size
        if (!width || !height) {
          const viewBox = svg.getAttribute('viewBox');
          if (viewBox) {
            const [vbX, vbY, vbWidth, vbHeight] = viewBox.split(' ').map(Number);
            width = vbWidth;
            height = vbHeight;
          } else {
            // Fallback to a default size if neither width/height nor viewBox is set
            width = 300;
            height = 300;
          }
        }

        // Create an image object
        const img = new Image();
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = function () {
          // Create a canvas with the same size as the SVG
          const canvas = document.createElement('canvas');
          canvas.width = parseFloat(width);
          canvas.height = parseFloat(height);
          const ctx = canvas.getContext('2d');

          // Draw the SVG image on the canvas
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Convert the canvas to a PNG data URL
          svgDataUrl = canvas.toDataURL('image/png');

          // Clean up the object URL
          URL.revokeObjectURL(url);
        };

        // Set the image source to the Blob URL
        img.src = url;
      }
    }



    function handleClose() {
      visible = false;
    }
  
    function handleOpen() {
      alert('Open button clicked!'); // Handle open action
    }

    // Helper function to handle background click
    function handleBackgroundClick(event) {
      if (event.target === event.currentTarget) {
        onClose();
      }
    }

  </script>
  
  <style>
    .dialog-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1202;
    }
  
    .dialog {
      width: 90%;
      max-width: 400px;
      background-color: #333;
      color: white;
      border-radius: 20px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      overflow: hidden;
      animation: fadeInUp 0.3s ease-out; /* Animation for the dialog appearance */
      z-index: 1000;
    }
  
    .dialog-header {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center; 
    }

  
    .dialog-image {
      width: 300px;
      height: 300px;
      padding-top: 32px;
      border-radius: 50%;
    }
  
    .dialog-close {
        position: absolute;
        top: 14px;
        right: 14px;
        background: none;
        border: none;
        font-size: 24px;
        color: white; /* Change color to white */
        cursor: pointer;
    }
  
    .dialog-body {
      padding: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  
    .dialog-content {
      display: flex;
      flex-direction: column;
    }
  
    .dialog-title {
      font-size: 20px;
      font-weight: bold;
      margin: 0;
      text-align: center;
      align-items: center;
      justify-content: center;
      display: flex;
    }
  
    .dialog-description {
      font-size: 14px;
      margin-top: 4px;
      color: #cccccc;
    }
  
    .dialog-footer {
      padding: 10px 20px;
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #cccccc;
    }
  
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(50%);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  </style>

  {#if visible}
  <div class="dialog-backdrop"  on:click={handleBackgroundClick} >
    <div class="dialog">
      <div class="dialog-header">
        <img src={svgDataUrl} alt="Header Image" class="dialog-image" />
        <div  class="dialog-close" on:click={onClose}>
            <img src='/icon/close.svg'  />
        </div>
      </div>
      
      <div class="dialog-body">
        <div class="dialog-content">
          <p class="dialog-title">{title}</p>
          <p class="dialog-description">{description}</p>
        </div>
       
      </div>
      <!-- <button class="dialog-button" on:click={handleOpen}>Open</button>
       -->
      <!-- Dialog Footer with Branding Information -->
      <div class="dialog-footer">
      </div>
    </div>
  </div>
  {/if}
  