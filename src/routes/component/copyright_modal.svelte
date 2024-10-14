<script>
    export let isModalVisible = false;  // State to control modal visibility
    export let onClose; // Prop for the close action handler
    
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
      background-color: #2c2c2e;
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
      height: 40px;
      background-color: #9552D4; 
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 20px;
	    font-family: 'Pretendard';
	    font-weight: 700;
	    cursor: pointer;
    }
  
    .close-btn:hover {
      background-color: #9552D4; 
    }
  
  </style>
  
  
  <!-- Modal and overlay -->
  {#if isModalVisible}
    <div class="modal-overlay" on:click={onClose}></div>
    <div class="modal">
      <div class="main-title">
        <h3>© 2024 GunWoong.<br>
          All Rights Reserved.
        </h3>
      </div>
      <button class="close-btn" on:click={onClose}>확인</button>
    </div>
  {/if}