<!-- ChatInput component for handling message input and sending -->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher();
    
    let newMessage = '';
    let isTyping = false;
    let typingTimeout: NodeJS.Timeout;
    
    // Handle message submission
    function handleSubmit() {
        if (!newMessage.trim()) return;
        
        dispatch('send', { text: newMessage });
        newMessage = '';
        isTyping = false;
    }
    
    // Handle typing indicator
    function handleInput() {
        isTyping = true;
        clearTimeout(typingTimeout);
        
        typingTimeout = setTimeout(() => {
            isTyping = false;
            dispatch('typing', { isTyping: false });
        }, 1000);
        
        dispatch('typing', { isTyping: true });
    }
</script>

<form on:submit|preventDefault={handleSubmit} class="flex gap-2">
    <input 
        type="text" 
        bind:value={newMessage} 
        on:input={handleInput}
        placeholder="Type a message..." 
        class="input input-bordered flex-1"
    />
    <button 
        type="submit" 
        class="btn btn-primary"
        disabled={!newMessage.trim()}
    >
        Send
    </button>
</form> 