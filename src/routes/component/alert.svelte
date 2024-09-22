<script>
    export let title = "A Short Title Is Best"; // The alert's title
    export let description = "A description should be a short, complete sentence."; // The alert's description
    export let actions = []; // A list of actions passed from outside

    function handleActionClick(action) {
        action.callback(); // Call the action's callback function when clicked
    }

    function handleActionOne() {
      console.log('Action One Clicked');
    }
  
    function handleActionTwo() {
      console.log('Action Two Clicked');
    }
  </script>
  
  <style>
    .alert-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3); /* Semi-transparent background */
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
  
    .alert {
      background-color: rgba(30, 30, 30, 0.75);
      width: 300px;
      padding-top: 19px;
      border-radius: 15px;
      box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
  
    .alert-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
        font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* Add font */
    }

    .alert-description {
        font-size: 14px;
        margin-bottom: 20px;
        color: #666;
        font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* Add font */
    }
  
    .alert-actions {
      display: flex;
      border-top: 1px solid rgba(54, 54, 54, 0.68);
      margin-top: 10px;
    }
  
    .alert-action {
      flex: 1;
      padding: 10px;
      font-size: 16px;
      color: #007aff;
      cursor: pointer;
      text-align: center;
    }
  
    .alert-action + .alert-action {
      border-left: 1px solid  rgba(54, 54, 54, 0.68);
    }
  
    .alert-action:active {
      background-color: #f0f0f5;
    }
  </style>
  
  <div class="alert-backdrop">
    <div class="alert">
      <div class="alert-title">{title}</div>
      <div class="alert-description">{description}</div>
      <div class="alert-actions">
      {#each actions as action}
        <div class="alert-action" on:click={() => handleActionClick(action)}>
          {action.label}
        </div>
      {/each}
    </div>
    </div>
  </div>
  