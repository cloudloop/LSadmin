<!-- Message component for displaying individual chat messages -->
<script lang="ts">
    import type { Message } from '../types';
    
    export let message: Message;
    export let currentUserId: string;
    
    // Format timestamp for display
    function formatTimestamp(timestamp: any): string {
        if (!timestamp) return '';
        const date = timestamp.toDate();
        return new Intl.DateTimeFormat('default', {
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }
</script>

<div class="chat {message.sender === currentUserId ? 'chat-end' : 'chat-start'}">
    <div class="chat-header">
        <time class="text-xs opacity-50">{formatTimestamp(message.timestamp)}</time>
    </div>
    <div class="chat-bubble {message.sender === currentUserId ? 'chat-bubble-primary' : 'chat-bubble-secondary'}">
        {message.text}
    </div>
    {#if message.sender === currentUserId}
        <div class="chat-footer opacity-50">
            {#if message.status === 'sent'}
                <span class="text-xs">✓</span>
            {:else if message.status === 'delivered'}
                <span class="text-xs">✓✓</span>
            {:else if message.status === 'read'}
                <span class="text-xs text-blue-500">✓✓</span>
            {/if}
        </div>
    {/if}
</div> 