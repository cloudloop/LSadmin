<!-- Chat page component that handles real-time messaging functionality -->
<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, where, updateDoc, doc } from 'firebase/firestore';
    import { db } from '$lib/firebase';
    import { getContext } from 'svelte';
    import Message from './components/Message.svelte';
    import ChatInput from './components/ChatInput.svelte';
    import type { Message as MessageType } from './types';
    
    // Initialize chat state variables
    let userId = "Default";
    let messages: MessageType[] = [];
    let unsubscribe;
    let isLoading = true;
    let error: string | null = null;
    let isTyping = false;
    
    // Set up real-time chat listener when component mounts
    onMount(() => {
        // Get current user from context
        const user = getContext('user') as { subscribe: (callback: (value: any) => void) => void };
        user.subscribe(value => {
            userId = value?.uid;
            if (!userId) {
                error = 'User not authenticated';
                isLoading = false;
            }
        });

        // Set up Firestore query for messages
        const q = query(
            collection(db, 'messages'), 
            where('participants', 'array-contains', userId),
            orderBy('timestamp', 'asc')
        );
        
        // Subscribe to real-time updates
        unsubscribe = onSnapshot(q, 
            (snapshot) => {
                messages = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as MessageType[];
                isLoading = false;
            },
            (err) => {
                error = 'Error loading messages';
                isLoading = false;
            }
        );
    });
    
    // Clean up subscription when component unmounts
    onDestroy(() => {
        if (unsubscribe) unsubscribe();
    });
    
    // Handle sending new messages
    async function handleSend(event: CustomEvent<{ text: string }>) {
        const { text } = event.detail;
        
        try {
            const messageRef = await addDoc(collection(db, 'messages'), {
                text,
                timestamp: serverTimestamp(),
                sender: userId,
                participants: [userId, "0123"], // TODO: Replace with actual chat room participants
                status: 'sent'
            });
            
            // Update message status to delivered
            await updateDoc(doc(db, 'messages', messageRef.id), {
                status: 'delivered'
            });
        } catch (error) {
            console.error('Error sending message:', error);
            this.error = 'Failed to send message';
        }
    }
    
    // Handle typing indicator
    function handleTyping(event: CustomEvent<{ isTyping: boolean }>) {
        isTyping = event.detail.isTyping;
    }
</script>

<!-- Chat interface layout -->
<div class="flex flex-col h-screen p-4 max-w-md mx-auto">
    <!-- Navigation bar -->
    <div class="navbar bg-base-100 shadow-lg rounded-box mb-4">
        <div class="flex-1">
            <h1 class="text-xl font-bold px-4">SvelteKit Chat</h1>
        </div>
    </div>
    
    {#if error}
        <div class="alert alert-error mb-4">
            <span>{error}</span>
        </div>
    {/if}
    
    <!-- Messages container with real-time updates -->
    <div class="flex-1 overflow-y-auto bg-base-200 rounded-box p-4 mb-4">
        {#if isLoading}
            <div class="flex justify-center items-center h-full">
                <span class="loading loading-spinner loading-lg"></span>
            </div>
        {:else if messages.length === 0}
            <div class="flex justify-center items-center h-full text-gray-500">
                No messages yet. Start a conversation!
            </div>
        {:else}
            {#each messages as message (message.id)}
                <Message {message} currentUserId={userId} />
            {/each}
        {/if}
    </div>
    
    <!-- Typing indicator -->
    {#if isTyping}
        <div class="text-sm text-gray-500 mb-2">
            Someone is typing...
        </div>
    {/if}
    
    <!-- Message input form -->
    <ChatInput 
        on:send={handleSend}
        on:typing={handleTyping}
    />
</div>