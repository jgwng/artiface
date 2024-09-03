<script>
    import { onMount } from 'svelte';
    import BottomSheet from './component/bottom_sheet.svelte'; // Import the Bottom Sheet component
    import ColorPicker from './component/color_picker.svelte';  
    import ImageSelector from './component/image_selector.svelte';
    
    let loading = true;
    let svgElement;
    
    export let data;
    let {
      accessoriesStyleImages,
      eyesStyleImages,
      hairStyleImages,
      headStyleImages,
      mouthStyleImages,
      outfitStyleImages,
    } = data;
  
    // Fields configuration
    const fields = [
      { name: '악세사리', default: '/assets/accessories/Accesories=Stylish_Glasses.svg', items: accessoriesStyleImages, title: '악세서리 설정', id: 'accessories' },
      { name: '눈', default: '/assets/eyes/Eyes=Normal.svg', items: eyesStyleImages, title: '눈 설정', id: 'eyes' },
      { name: '헤어스타일', default: '/assets/hair/Hair=Style02.svg', items: hairStyleImages, title: '헤어스타일 설정', id: 'hair' },
      { name: '얼굴형태', default: '/assets/head/Head03.svg', items: headStyleImages, title: '얼굴형 설정', id: 'head' },
      { name: '입', default: '/assets/mouth/Mouth=Normal_Smile_2.svg', items: mouthStyleImages, title: '입 설정', id: 'mouth' },
      { name: '상의', default: '/assets/outfit/Outfit=Style04.svg', items: outfitStyleImages, title: '상의 설정', id: 'outfit' },
    ];
  
   
    // State to manage the current selected image for each field
    let selectedImages = {};
  
    // Initialize selected images with default values from fields
    fields.forEach(field => {
      selectedImages[field.id] = field.default; // Use the default image when the site is first accessed
    });
  
    // Load SVG and display it in the SVG container
    async function loadSVG(src) {
      loading = true;
      try {
        const response = await fetch(src);
        const svgText = await response.text();
  
        if (svgElement) {
          svgElement.innerHTML = svgText;
  
          const svg = svgElement.querySelector('svg');
          if (svg) {
            svg.style.width = '240px';
            svg.style.height = '240px';
            svg.style.opacity = '0';
            svg.style.backgroundColor = '#8F8F8F';
            svg.style.borderRadius = '50%';
            svg.style.transition = 'opacity 0.3s linear, transform 0.3s linear';
  
            requestAnimationFrame(() => {
              svg.style.opacity = '1';
              svg.style.transform = 'scale(1)';
            });
          }
        }
      } catch (error) {
        console.error('Error loading SVG:', error);
      } finally {
        loading = false;
      }
    }
  
    onMount(() => {
      loadSVG(`/template.svg`);
    });
  
    let isBottomSheetVisible = false;
    let isColorPickerBottomSheetVisible = false;
    let currentField = null; // Track which field is currently being updated
  
    function handleButtonClick(field) {
      currentField = field;
      showBottomSheet(true);
    }
  
    function showBottomSheet(isImage) {
      if(isImage){
        isBottomSheetVisible = true;
      }else{
        isColorPickerBottomSheetVisible = true;
      }
    }
  
    function hideBottomSheet() {
      isBottomSheetVisible = false;
      isColorPickerBottomSheetVisible = false;
    }
  
    function handleItemSelect(item) {
      if (currentField) {
        // Update the selected image for the current field
        selectedImages[currentField.id] = item.src;
        handleImageClick(item, currentField.id);
      }
      hideBottomSheet(); // Close the bottom sheet after selection
    }

    function handleColorSelect(color) {
      console.log('color :' + color);
      const svg = svgElement.querySelector('svg');
      if (svg) {
            svg.style.backgroundColor = color;
      }
      hideBottomSheet(); // Close the bottom sheet after selection
    }
  
      // Unified function to handle image updates and SVG rendering
  async function handleImageClick(item, idPrefix) {
    try {
      const response = await fetch(item.src);
      let svgText = await response.text();
      console.log('src : '+ item.src);    // Parse the SVG text into an SVG document
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, "image/svg+xml");

      // Get the entire SVG element
      const svgElement = svgDoc.querySelector('svg');

      const poseElement = document.querySelector(`[id^="${idPrefix}"]`);
      if (poseElement && svgElement) {
        // Set the innerHTML of poseElement to the full SVG element's outer HTML
        poseElement.innerHTML = svgElement.outerHTML;
      }

    } catch (error) {
      console.error('Error handling image click:', error);
    }
  }
// Function to pick a random item from each field and update the SVG
async function updateAllFieldsWithRandomItems() {
  try {
    // Create an array of promises for updating all fields
    const updatePromises = fields.map(async (field) => {
      if (field.items.length > 0) {
        // Pick a random item from the field
        const randomIndex = Math.floor(Math.random() * field.items.length);
        const randomItem = field.items[randomIndex];
        selectedImages[field.id] = randomItem.src;
        // Update the SVG in the DOM using the random item
        await handleImageClick(randomItem, field.id);
      } else {
        console.warn(`No items available for field: ${field.id}`);
      }
    });

    // Wait for all updates to complete
    await Promise.all(updatePromises);

    console.log('All fields updated successfully');
  } catch (error) {
    console.error('Error updating fields:', error);
  }
}
  </script>
  
  <style>
    .screen {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        min-height: 100vh; /* Ensure the screen takes full height */
        background-color: black;
        color: white;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        box-sizing: border-box;
    }

    .content-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center; /* Center items vertically */
      flex-grow: 1; /* Take up remaining space */
      width: 100%;
    }

    .svg-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 240px;
      height: 240px;
      background-color: white;
      border-radius: 50%;
      margin-bottom: 20px; /* Add some space below */
      flex-shrink: 0; /* Prevent it from shrinking */
    }

    .keypad-grid {
      display: grid;
      grid-template-columns: repeat(3, 100px);
      grid-gap: 20px;
      justify-items: center;
      margin-top: auto; /* Allow margin at the top to push grid to bottom if space is available */
      margin-bottom: 20px;
    }

    .keypad-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  
    .keypad-button {
      width: 80px;
      height: 80px;
      background-color: #E5E5EA;
      border: none;
      border-radius: 50%;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      display: flex; /* Make the button a flex container */
      align-items: center; /* Center content vertically */
      justify-content: center; /* Center content horizontally */
      position: relative; /* Position relative to allow absolute positioning inside */
    }
  
    .keypad-button img {
      width: 60%; /* Set a percentage width so the image scales properly */
      height: 60%; /* Maintain the aspect ratio */
      object-fit: cover; /* Cover the area without distortion */
      border-radius: 50%; /* Make the image circular */
    }
  
    .image-button {
      width: 36px !important;
      height: 36px !important;
      border-radius: 0% !important;
    }
  
    .keypad-button:active {
      background-color: #e0e0e0;
    }
  
    .keypad-text {
      margin-top: 8px;
      font-size: 14px;
      color: white;
    }
    /* Media query for mobile browsers */
    @media (max-width: 767px) {
      .screen {
        padding: 5vh 0 12vh;
      }
      .keypad-grid {
        margin-bottom: 0px !important;
      }
    }


  </style>
  
  <div class="screen">
    <!-- Content Wrapper for SVG and Keypad Grid -->
    <div class="content-wrapper">
      <!-- Centered SVG Container -->
      <div class="svg-container" bind:this={svgElement}></div>
    </div>
     <!-- Keypad Grid -->
     <div class="keypad-grid">
      {#each fields as field}
        <div class="keypad-item">
          <button class="keypad-button" on:click={() => handleButtonClick(field)}>
            <!-- Display the selected image or default if none selected -->
            <img src={selectedImages[field.id]} alt={field.name} />
          </button>
          <div class="keypad-text">{field.name}</div>
        </div>
      {/each}
      <div class="keypad-item">
        <button class="keypad-button" on:click={updateAllFieldsWithRandomItems}>           
          <img class="image-button" src='/icon/random.svg' alt='random'/>
         </button>
        <div class="keypad-text">저장</div>
      </div>
  
      <div class="keypad-item">
        <button class="keypad-button" style="background-color:#34C759;" on:click={() => {}}>           
          <img class="image-button" src='/icon/download.svg' alt='download'/>
        </button>
        <div class="keypad-text">저장</div>
      </div>
  
      <div class="keypad-item">
        <button class="keypad-button" on:click={() => showBottomSheet(false)}>#</button>
        <div class="keypad-text">Hash</div>
      </div>
    </div>
    
  </div>
  <!-- iOS Style Bottom Sheet -->
  <BottomSheet
  visible={isBottomSheetVisible}
  onClose={hideBottomSheet}
  title={currentField ? currentField.title : ''}
>
  <ImageSelector
      items={currentField ? currentField.items : []}
      onImageClick={handleItemSelect}
  />
</BottomSheet>

<BottomSheet
  visible={isColorPickerBottomSheetVisible}
  onClose={hideBottomSheet}
  title='배경색 설정'
>
  <ColorPicker
    onColorClick={handleColorSelect}
  />
</BottomSheet>