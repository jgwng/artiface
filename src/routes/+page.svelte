<script>
  import { onMount } from 'svelte';
  import BottomSheet from './component/bottom_sheet.svelte';
  import ColorPicker from './component/color_picker.svelte';  
  import ImageSelector from './component/image_selector.svelte';
  import ImageConfirmSheet from './component/image_size_sheet.svelte';
  import ImageDownloadDialog from './component/image_download_dialog.svelte';
  import { get } from 'svelte/store';
  import { page } from "$app/stores"; 
  import {replaceState} from "$app/navigation";
  
  // Component state variables
  let loading = true;
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
  let { COMPONENTCODE, accessoriesStyleImages, eyesStyleImages, hairStyleImages, headStyleImages, mouthStyleImages, outfitStyleImages } = data;

  // Fields configuration for icon grid
  const fields = [
      { name: '악세사리', default: '/assets/accessories/Accesories=Stylish_Glasses.svg', items: accessoriesStyleImages, title: '악세서리 설정', id: 'accessories',code: 'A'},
      { name: '눈', default: '/assets/eyes/Eyes12.svg', items: eyesStyleImages, title: '눈 설정', id: 'eyes',code:'A'},
      { name: '헤어스타일', default: '/assets/hair/Hair=Style02.svg', items: hairStyleImages, title: '헤어스타일 설정', id: 'hair',code: 'A'},
      { name: '얼굴형태', default: '/assets/head/Head03.svg', items: headStyleImages, title: '얼굴형 설정', id: 'head',code: 'A'},
      { name: '입', default: '/assets/mouth/Mouth22.svg', items: mouthStyleImages, title: '입 설정', id: 'mouth',code: 'A'},
      { name: '상의', default: '/assets/outfit/Outfit=Style04.svg', items: outfitStyleImages, title: '상의 설정', id: 'outfit',code: 'A'},
  ];

  // Load the SVG on mount
  onMount(() => {
      loadSVG(`/template.svg`);
  });
  
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
                  if(checkCodeData() === true){
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
  function checkCodeData() {
    
    const params = new URLSearchParams(window.location.search);

    if(params.has('code') === false) return false;
    
    const codeValue = params.get('code'); // Get the value of 'code'
    if (codeValue.length === 6) {
        return true;
    }
    return false;
  }

  async function applyCodeData() {
    const params = new URLSearchParams(window.location.search);
    const codeValue = params.get('code'); 
    const codeList = codeValue.split('');
    for (const [index, char] of codeList.entries()) {
        let field = fields[index];
        let codeIndex = COMPONENTCODE.lastIndexOf(char);
        if (codeIndex < field.items.length && codeIndex > 0) {
            await handleImageClick(field.items[codeIndex], field.id);
            field.code = char; 
        }
    }
    isConfirmSheetVisible = false;
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
          updateQueryParam(item, currentField.id);
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
         
        }
         catch (error) {
            console.error('Error handling image click:', error);
        }
  }
  function updateQueryParam(item, idPrefix) {
    const currentField = fields.find(field => field.id === idPrefix);
    let  newCode = COMPONENTCODE[item.id];
    currentField.code = newCode;
    const joinedCodes = fields.map(field => field.code).join('');
    const params = new URLSearchParams(window.location.search);
    params.set('code', joinedCodes);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    replaceState(newUrl);
  }

</script>

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

<ImageConfirmSheet visible={isConfirmSheetVisible} onTapTopButton={applyCodeData} onTapBottomButton={clearPrevData} title='이전 작업을 이어서 하시겠어요?' topButtonText='네, 좋아요' bottomButtonText = '새로 할게요' />

<ImageDownloadDialog visible={isImageDownloadDialogVisible} onClose={hideBottomSheet} svgText={imageHTML} />
