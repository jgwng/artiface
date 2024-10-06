<script>
    export let visible = false;
    export let onClose;
    export let onTapTopButton; 
    export let onTapBottomButton; // Prop for the close action handler
    export let title;
    export let subtitle;
  
    export let topButtonText;
    export let bottomButtonText;
    export let icon;
    
    
    function toggleSheet() {
      visible = !visible;
    }
  
    // Helper function to handle background click
    function handleBackgroundClick(event) {
      if (event.target === event.currentTarget) {
        onClose();
      }
    }
  </script>
  
  <style>
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      visibility: hidden;
      opacity: 0;
      transition: opacity 0.3s ease, visibility 0.3s ease;
      z-index: 1201;
    }
    .overlay.active {
      visibility: visible;
      opacity: 1;
    }
  
    .action-sheet-container {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      transition: transform 0.3s ease;
      transform: translateY(100%);
      z-index: 1202;
      padding: 0 8px; /* Padding to align the sheet content within the viewport */
    }
  
    .action-sheet-container.open {
      transform: translateY(0);
      margin-bottom: 24px;
    }
  
    .action-sheet {
      background: #2c2c2e;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
      border-radius: 13px;
      overflow: hidden;
    }
  
    .action-sheet-header {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      border-bottom: 1px solid #3a3a3c;
      padding-top: 24px;
      
    }
    .action-sheet-header img{
      width: 120px;
      height: 120px;
    }
    .action-sheet-header p{
      text-align: center;
      font-weight: bold;
      font-size: 20px;
     
      color: #ffffff;
    }
    
    .action-sheet-button:first-child {
      border-top: none;
    }
    .description {
      font-size: 18px;
      font-weight: bold;
      color: #ffffff;
      text-align: center;
    }
  
  </style>
  
  {#if visible}
    <div class="overlay active"></div>
  {/if}
  
  <div class="action-sheet-container {visible ? 'open' : ''}">
    <div class="action-sheet">
      <div class="action-sheet-header">
        <img src='../icon/{icon}.svg' oncontextmenu="return false"  unselectable="on"/>
        {#if subtitle}
          <div style="padding-top:16px;padding-bottom:16px;">
            <div class="description">{title}</div>
            <div class="description" style="padding-top:4px;">{subtitle}</div>
          </div>
        {:else}
          <p>{title}</p>
        {/if}
      </div>
      <div class="action-sheet-body">
        <div class="action-sheet-button" on:click={onTapTopButton}>
          {topButtonText}
        </div>
        <div class="action-sheet-button close" on:click={onTapBottomButton}>
          {bottomButtonText}
       </div>
      </div>
    </div>
  
  </div>
  