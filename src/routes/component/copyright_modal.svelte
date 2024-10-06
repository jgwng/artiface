<script>
    export let isModalVisible = false;  // State to control modal visibility
    export let onClose; // Prop for the close action handler
    let userAgentInfo = navigator.userAgent;  // Fetch the user agent information
  
    // Helper function to handle background click
    function handleBackgroundClick(event) {
      if (event.target === event.currentTarget) {
        onClose();
      }
    }
  </script>


<style>
    /* Modal styling */
    .modal {
      display: flex;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: white;
      padding: 20px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.3);
      border-radius: 8px;
      z-index: 1000;
      width: 300px;
      text-align: center;
      flex-direction: column;
    }
  
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
    }
  
    .close-btn {
      margin-top: 20px;
      padding: 8px 12px;
      background-color: #f44336;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  
    .close-btn:hover {
      background-color: #d32f2f;
    }
  
  </style>
  
  
  <!-- Modal and overlay -->
  {#if isModalVisible}
    <div class="modal-overlay" on:click={onClose}></div>
    <div class="modal">
      <h2>User Agent Info</h2>
      <p>{userAgentInfo}</p>
      <p>{document.referrer}</p>
      <p>{window.navigator.standalone}</p>
      <p>{window.fullScreen}</p>
      <p>{!window.screenTop && !window.screenY}</p>
      <button class="close-btn" on:click={onClose}>Close</button>
    </div>
  {/if}