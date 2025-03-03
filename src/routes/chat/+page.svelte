<script>
    import { onMount, onDestroy } from 'svelte';
    import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, where } from 'firebase/firestore';
    import { db } from '$lib/firebase';
    import {getContext} from 'svelte';
    
    // Replace with actual user ID from your auth system
    let userId = "Default";
    let messages = [];
    let newMessage = '';
    let unsubscribe;
    
    onMount(() => {
        const user = getContext('user');
        // Get the actual value
        user.subscribe(value => {
            userId = value?.uid; // Should now print the UID correctly
        });
      // Query messages where the user is a participant
      const q = query(
        collection(db, 'messages'), 
        where('participants', 'array-contains', userId),
        orderBy('timestamp', 'asc')
      );
      
      unsubscribe = onSnapshot(q, (snapshot) => {
        messages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      });
    });
    
    onDestroy(() => {
      if (unsubscribe) unsubscribe();
    });
    
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
  
  <div class="flex flex-col h-screen p-4 max-w-md mx-auto">
    <div class="navbar bg-base-100 shadow-lg rounded-box mb-4">
      <div class="flex-1">
        <h1 class="text-xl font-bold px-4">SvelteKit Chat</h1>
      </div>
    </div>
    
    <div class="flex-1 overflow-y-auto bg-base-200 rounded-box p-4 mb-4">
      {#each messages as message (message.id)}
        <div class="chat {message.sender === userId ? 'chat-end' : 'chat-start'}">
          <div class="chat-bubble {message.sender === userId ? 'chat-bubble-primary' : 'chat-bubble-secondary'}">
            {message.text}
          </div>
        </div>
      {/each}
    </div>
    
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