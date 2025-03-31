<!-- Chat page component that handles real-time messaging functionality-->
<script>
    import { onMount, onDestroy } from 'svelte';
    import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, where } from 'firebase/firestore';
    import { db } from '$lib/firebase';
    import {getContext} from 'svelte';
    
    // Initialize chat state variables
    let userId = "Default";
    let messages = [];
    let newMessage = '';
    let unsubscribe;
    
    // Set up real-time chat listener when component mounts
    onMount(() => {
        // Get current user from context
        const user = getContext('user');
        user.subscribe(value => {
            userId = value?.uid;
        });

        // Set up Firestore query for messages
        const q = query(
            collection(db, 'messages'), 
            where('participants', 'array-contains', userId),
            orderBy('timestamp', 'asc')
        );
        
        // Subscribe to real-time updates
        unsubscribe = onSnapshot(q, (snapshot) => {
            messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        });
    });
    
    // Clean up subscription when component unmounts
    onDestroy(() => {
        if (unsubscribe) unsubscribe();
    });
    
    // Handle sending new messages
    async function sendMessage() {
        if (!newMessage.trim()) return;

        try {
            await addDoc(collection(db, 'messages'), {
                text: newMessage,
                timestamp: serverTimestamp(),
                sender: userId,
                participants: [userId, "0123"] // Add all participants
            });
            newMessage = '';
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }
</script>

<!-- Chat interface layout-->
<div class="flex flex-col h-screen p-4 max-w-md mx-auto">
    <!-- Navigation bar-->
    <div class="navbar bg-base-100 shadow-lg rounded-box mb-4">
        <div class="flex-1">
            <h1 class="text-xl font-bold px-4">SvelteKit Chat</h1>
        </div>
    </div>
    
    <!-- Messages container with real-time updates-->
    <div class="flex-1 overflow-y-auto bg-base-200 rounded-box p-4 mb-4">
        {#each messages as message (message.id)}
            <!-- Message bubbles with different styles for sender/receiver-->
            <div class="chat {message.sender === userId ? 'chat-end' : 'chat-start'}">
                <div class="chat-bubble {message.sender === userId ? 'chat-bubble-primary' : 'chat-bubble-secondary'}">
                    {message.text}
                </div>
            </div>
        {/each}
    </div>
    
    <!-- Message input form-->
    <form on:submit|preventDefault={sendMessage} class="flex gap-2">
        <input 
            type="text" 
            bind:value={newMessage} 
            placeholder="Type a message..." 
            class="input input-bordered flex-1"
        />
        <button type="submit" class="btn btn-primary">Send</button>
    </form>
</div>