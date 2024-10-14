<script>
  import { onMount } from 'svelte';
  import BottomSheet from './component/bottom_sheet.svelte';
  import ColorPicker from './component/color_picker.svelte';  
  import ImageSelector from './component/image_selector.svelte';
  import ImageConfirmSheet from './component/image_confirm_sheet.svelte';
  import ImageDownloadDialog from './component/image_download_dialog.svelte';
  import CopyrightModal from './component/copyright_modal.svelte';
  
  import { get } from 'svelte/store';
  import { page } from "$app/stores"; 
  import {replaceState} from "$app/navigation";
  
  // Component state variables
  let loading = true;
  let svgElement;
  let titleElement;
  let selectedColor = 'rgb(243,234,222,1.0)';
  let imageHTML = '';
  
  // Visibility states for different sheets/dialogs
  let isBottomSheetVisible = false;
  let isCopyrightModalVisible = false;
  let isConfirmSheetVisible = false;
  let isRedirectNoticeSheetVisible = false;
  let isImageDownloadDialogVisible = false;
  let currentField = null;

  let isRedirected = false;

  export let data;
  let { COMPONENTCODE, accessoriesStyleImages, eyesStyleImages, hairStyleImages, headStyleImages, mouthStyleImages, outfitStyleImages } = data;

  // Fields configuration for icon grid
  const fields = [
      { name: '악세사리', default: 'assets/accessories/Accesories28.svg', items: accessoriesStyleImages, title: '악세서리 설정', id: 'accessories',code: 'B'},
      { name: '눈', default: 'assets/eyes/Eyes12.svg', items: eyesStyleImages, title: '눈 설정', id: 'eyes',code:'P'},
      { name: '헤어스타일', default: 'assets/hair/Hair=Style02.svg', items: hairStyleImages, title: '헤어스타일 설정', id: 'hair',code: 'P'},
      { name: '얼굴형태', default: 'assets/head/Head03.svg', items: headStyleImages, title: '얼굴형 설정', id: 'head',code: 'P'},
      { name: '입', default: 'assets/mouth/Mouth22.svg', items: mouthStyleImages, title: '입 설정', id: 'mouth',code: 'T'},
      { name: '상의', default: 'assets/outfit/Outfit47.svg', items: outfitStyleImages, title: '상의 설정', id: 'outfit',code: 'M'},
  ];

  // Load the SVG on mount
  onMount(() => {
        isRedirected = checkRedirection();
        fields.map(field => {
           const currentIndex = field.items.findIndex(item => item.src === field.default);
           console.log('currentIndex : ' + field.id);
           console.log('currentIndex : ' + currentIndex);
           console.log('currentIndex : ' + COMPONENTCODE[currentIndex]);
        });
        
        loadSVG(`/template.svg`);
  });

  function checkRedirection() {
    const referrerChecks = ["threads", "slack"];
    const userAgentChecks = ["KAKAO", "FB", "Instagram", "trill"];
    
    // Check referrer
    const isRedirectedFromReferrer = referrerChecks.some(referrer => document.referrer.includes(referrer));

    // Check user agent
    const isRedirectedFromUserAgent = userAgentChecks.some(agent => navigator.userAgent.includes(agent));

    // If either referrer or user agent matches, set isRedirected to true
    const isRedirect = isRedirectedFromReferrer || isRedirectedFromUserAgent;

    return isRedirect;
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
                  
                  if(isRedirected === true) return;
                
                  if(checkCodeData() === true){
                    await applyCodeData();
                    clearPrevData();
                    return;
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
        if (codeIndex < field.items.length && char !== field.code && codeIndex >= 0) {
            await handleImageClick(field.items[codeIndex-1], field.id);
            field.code = char; 
        }
    }
    isConfirmSheetVisible = false;
}


  function clearPrevData() {
    isConfirmSheetVisible = false;
    const newUrl = `${window.location.pathname}`;
    replaceState(newUrl);
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
      isBottomSheetVisible = true;
  }

  function hideBottomSheet() {
      isBottomSheetVisible = false;
      isCopyrightModalVisible = false;
      isConfirmSheetVisible = false;
      isImageDownloadDialogVisible = false;
      isRedirectNoticeSheetVisible= false;
  }

  // Handle item selection from image selector
  function handleItemSelect(item) {
      if (currentField) {
          handleImageClick(item, currentField.id);
          setCodeData(item, currentField.id);
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
      if(isRedirected === true){
        isRedirectNoticeSheetVisible = true;
        return;
      }

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

  function setCodeData(item, idPrefix) {
    const currentField = fields.find(field => field.id === idPrefix);
    let  newCode = COMPONENTCODE[item.id];
    currentField.code = newCode;
    const joinedCodes = fields.map(field => field.code).join('');
    const params = new URLSearchParams(window.location.search);
    params.set('code', joinedCodes);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    replaceState(newUrl);
  }

  function onTapCopyRight(){
    isCopyrightModalVisible = true;
  }
  
  async function copyCurrentUrl() {
    try {
      const code = fields.map(field => field.code).join('');
      const newUrl = `${window.location.pathname}?code=${code}`;
      await navigator.clipboard.writeText(newUrl); // Copy URL to clipboard
      alert("URL이 복사되었습니다!"); // Success message
      isRedirectNoticeSheetVisible = false;  
    } catch (error) {
      console.error("URL 복사에 실패했습니다:", error);
    }
  }
  function onTapReset(){
    fields.map(field => {
           const currentIndex = field.items.findIndex(item => item.src === field.default);
           handleImageClick(field.items[currentIndex], field.id);
        });
    isConfirmSheetVisible = false;
  }
</script>

<!-- Layout -->
<div class="screen">
    <div class="copyright" on:click={() => onTapCopyRight()}>
        <img src='/icon/copyright.svg' oncontextmenu="return false"  unselectable="on"/>
    </div>
    
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

  <div class="action-button-row">
    <div class="action-button" on:click={() => isConfirmSheetVisible = true}>
      초기화
   </div>
   <div style="width:20px;">
   </div>
    <div class="action-button" on:click={() => showDownloadSheet()}>
      저장
   </div>
  </div>
</div>


<!-- Bottom Sheets and Dialogs -->
<BottomSheet visible={isBottomSheetVisible} onClose={hideBottomSheet} title={currentField ? currentField.title : ''}>
  <ImageSelector items={currentField ? currentField.items : []} onImageClick={handleItemSelect} />
</BottomSheet>

<ImageConfirmSheet visible={isConfirmSheetVisible} onTapTopButton={onTapReset} onTapBottomButton={hideBottomSheet} title='처음부터 다시 시작할까요?' topButtonText='네, 좋아요' bottomButtonText = '그냥 둘게요' icon='restore'/>

<ImageConfirmSheet visible={isRedirectNoticeSheetVisible} onTapTopButton={copyCurrentUrl} onTapBottomButton={hideBottomSheet} 
      title='인앱 브라우저에서는 저장이 제한됩니다.'  subtitle='링크를 복사하고 Safari에서 이미지를 저장해 주세요.' topButtonText='링크 복사할게요' bottomButtonText = '다음에 할게요' icon='notice'/>

<ImageDownloadDialog visible={isImageDownloadDialogVisible} onClose={hideBottomSheet} svgText={imageHTML} />

<CopyrightModal isModalVisible={isCopyrightModalVisible} onClose={hideBottomSheet}>
</CopyrightModal>


