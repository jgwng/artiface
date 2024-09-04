<script>
    export let visible = false;
    export let onClose; // Prop for the close action handler
    export let title;
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
    }
  
    .action-sheet {
      background: #2c2c2e;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
      border-radius: 13px;
      overflow: hidden;
    }
  
    .action-sheet-header,
    .action-sheet-button,
    .action-sheet-cancel {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
  
    .action-sheet-header {
      height: 42px;
      font-weight: bold;
      color: #ffffff;
      border-bottom: 1px solid #3a3a3c;
    }
  
    .action-sheet-button {
      height: 60px;
      font-size: 20px;
      color: #409cff;
      cursor: pointer;
      border: none;
      width: 100%;
      background: none;
      border-top: 1px solid #3a3a3c;
    }
  
    .action-sheet-button:first-child {
      border-top: none;
    }
  
    .action-sheet-button.destructive {
      color: #ff3b30;
    }
  
    .action-sheet-cancel {
      width: 100%;
      height: 60px;
      font-size: 20px;
      color: #409cff;
      cursor: pointer;
      background-color: #2c2c2e;
      border-radius: 16px;
      border: 1px solid #3a3a3c;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
      margin: 8px 0; /* Combines top and bottom margins */
    }
  </style>
  
  {#if visible}
    <div class="overlay active" on:click={handleBackgroundClick}></div>
  {/if}
  
  <div class="action-sheet-container {visible ? 'open' : ''}">
    <div class="action-sheet">
      <div class="action-sheet-header">
        {title}
      </div>
      <div class="action-sheet-body">
        <button class="action-sheet-button" on:click={toggleSheet}>Action</button>
        <button class="action-sheet-button destructive" on:click={toggleSheet}>Action</button>
        <button class="action-sheet-button" on:click={toggleSheet}>Action</button>
      </div>
    </div>
  
    <button class="action-sheet-cancel" on:click={toggleSheet}>Cancel</button>
  </div>
  