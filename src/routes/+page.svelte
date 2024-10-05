<script>
  import { onMount } from 'svelte';
  import BottomSheet from './component/bottom_sheet.svelte';
  import ColorPicker from './component/color_picker.svelte';  
  import ImageSelector from './component/image_selector.svelte';
  import ImageConfirmSheet from './component/image_size_sheet.svelte';
  import ImageDownloadDialog from './component/image_download_dialog.svelte';
  import { get } from 'svelte/store';

  // Component state variables
  let loading = true;
  let showNoticeAlert = false;
  let svgElement;
  let selectedColor = 'rgb(243,234,222,1.0)';
  let imageHTML = '';
  
  // Visibility states for different sheets/dialogs
  let isBottomSheetVisible = false;
  let isColorPickerBottomSheetVisible = false;
  let isConfirmSheetVisible = false;
  let isImageDownloadDialogVisible = false;
  let currentField = null;

  export let data;
  let { accessoriesStyleImages, eyesStyleImages, hairStyleImages, headStyleImages, mouthStyleImages, outfitStyleImages } = data;

  // Fields configuration for icon grid
  const fields = [
      { name: '악세사리', default: '/assets/accessories/Accesories=Stylish_Glasses.svg', items: accessoriesStyleImages, title: '악세서리 설정', id: 'accessories'},
      { name: '눈', default: '/assets/eyes/Eyes12.svg', items: eyesStyleImages, title: '눈 설정', id: 'eyes'},
      { name: '헤어스타일', default: '/assets/hair/Hair=Style02.svg', items: hairStyleImages, title: '헤어스타일 설정', id: 'hair'},
      { name: '얼굴형태', default: '/assets/head/Head03.svg', items: headStyleImages, title: '얼굴형 설정', id: 'head'},
      { name: '입', default: '/assets/mouth/Mouth22.svg', items: mouthStyleImages, title: '입 설정', id: 'mouth'},
      { name: '상의', default: '/assets/outfit/Outfit=Style04.svg', items: outfitStyleImages, title: '상의 설정', id: 'outfit'},
  ];

  // Load the SVG on mount
  onMount(() => {
      handleReloadState();
      loadSVG(`/template.svg`);
  });

  function handleReloadState() {
      const isReloaded = sessionStorage.getItem("isReloaded");
      if (isReloaded) {
          showNoticeAlert = true;
      }
      sessionStorage.removeItem("isReloaded");
  }

  // Load SVG from the specified source
  async function loadSVG(src) {
      loading = true;
      try {
          let svgText = '';
         
          const response = await fetch(src);
            svgText = await response.text();
          
          if (svgElement) {
              svgElement.innerHTML = svgText;
              const svg = svgElement.querySelector('svg');
              if (svg) {
                  applySVGStyles(svg);
                  if(localStorage.length !== 0){
                    isConfirmSheetVisible = true;
                  }
              }
          }
      } catch (error) {
          console.error('Error loading SVG:', error);
      } finally {
          loading = false;
      }
  }
  function applyPrevAssets() {
    isConfirmSheetVisible = false;

    for (const field of fields) {
        // Find the corresponding element in the DOM
        const partElement = document.querySelector(`[id^="${field.id}"]`);
        
        // Retrieve the stored SVG string from localStorage
        const prevElement = localStorage.getItem(field.id);

        // If the SVG string exists and the DOM element is found, apply the saved SVG
        if (prevElement && partElement) {
            partElement.innerHTML = prevElement; // Inject the stored SVG into the DOM
        } else {
            console.warn(`No saved SVG found for ${field.id} in localStorage or element not found.`);
        }
    }
  }
  function clearPrevData() {
    isConfirmSheetVisible = false;
    localStorage.clear();
  }

  function applySVGStyles(svg) {
      svg.style.width = '240px';
      svg.style.height = '240px';
      svg.style.opacity = '0';
      svg.style.backgroundColor = selectedColor;
      svg.style.borderRadius = '50%';
      svg.style.transition = 'opacity 0.3s linear, transform 0.3s linear';

      requestAnimationFrame(() => {
          svg.style.opacity = '1';
          svg.style.transform = 'scale(1)';
      });
  }

  // Helper function to determine if the device is mobile
  function isMobileDevice() {
      return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // Handle button clicks to show bottom sheet
  function handleButtonClick(field) {
      currentField = field;
      svgElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      showBottomSheet(true);
  }

  function showBottomSheet(isImage) {
      if (isImage) {
          isBottomSheetVisible = true;
      } else {
          isColorPickerBottomSheetVisible = true;
      }
  }

  function hideBottomSheet() {
      isBottomSheetVisible = false;
      isColorPickerBottomSheetVisible = false;
      isConfirmSheetVisible = false;
      isImageDownloadDialogVisible = false;
  }

  // Handle item selection from image selector
  function handleItemSelect(item) {
      if (currentField) {
          handleImageClick(item, currentField.id);
      }
  }

  // Handle color selection for the background
  function handleColorSelect(color) {
      const svg = svgElement.querySelector('svg');
      if (svg) {
          svg.style.backgroundColor = color;
      }
      const circleElement = document.querySelector('.circle');
      if (circleElement) {
          circleElement.style.backgroundColor = color;
      }
      hideBottomSheet();
  }

  // Download the SVG or show download dialog
  function showDownloadSheet() {
      if (isMobileDevice()) {
          imageHTML = svgElement.innerHTML;
          isImageDownloadDialogVisible = true;
      } else {
          const svg = svgElement.outerHTML;
          const blob = new Blob([svg], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'image.svg';
          link.click();
          URL.revokeObjectURL(url);
      }
  }

  // Handle image click, replace SVG part
  async function handleImageClick(item, idPrefix) {
      try {
          const response = await fetch(item.src);
          const svgText = await response.text();
          const parser = new DOMParser();
          const svgDoc = parser.parseFromString(svgText, "image/svg+xml");

          const itemElement = svgDoc.querySelector('svg');
          const poseElement = document.querySelector(`[id^="${idPrefix}"]`);
          if (poseElement && itemElement) {
              poseElement.innerHTML = itemElement.outerHTML;
          }
          const currentField = fields.find(field => field.id === idPrefix);
          localStorage.setItem(idPrefix, itemElement.outerHTML); 
      } catch (error) {
          console.error('Error handling image click:', error);
      }
  }

  // Handle page reload
  function onBeforeUnload(event) {
      sessionStorage.setItem("isReloaded", "true");
  }
</script>

<svelte:window on:beforeunload={onBeforeUnload}></svelte:window>


<!-- Layout -->
<div class="screen">
  
  <div class="main-title">
    <h1>당신의 스타일로 편집하세요</h1>
  </div>

  <div class="content-wrapper">
      <div class="svg-container" bind:this={svgElement}></div>
  </div>
  
  <div class="icon-grid">
      {#each fields as field}
          <div class="icon-item" on:click={() => handleButtonClick(field)}>
              <img src='/icon/{field.id}_icon.svg' oncontextmenu="return false"  unselectable="on"/>
              <p>{field.name}</p>
          </div>
      {/each}
  </div>

  <div class="action-button" on:click={() => showDownloadSheet()}>
     이미지 저장
  </div>
</div>

<!-- Bottom Sheets and Dialogs -->
<BottomSheet visible={isBottomSheetVisible} onClose={hideBottomSheet} title={currentField ? currentField.title : ''}>
  <ImageSelector items={currentField ? currentField.items : []} onImageClick={handleItemSelect} />
</BottomSheet>

<BottomSheet visible={isColorPickerBottomSheetVisible} onClose={hideBottomSheet} title='배경색 설정'>
  <ColorPicker onColorClick={handleColorSelect} />
</BottomSheet>

<ImageConfirmSheet visible={isConfirmSheetVisible} onTapTopButton={applyPrevAssets} onTapBottomButton={clearPrevData} title='이전 작업을 이어서 하시겠어요?' topButtonText='네, 좋아요' bottomButtonText = '새로 할게요' />

<ImageDownloadDialog visible={isImageDownloadDialogVisible} onClose={hideBottomSheet} svgText={imageHTML} />
