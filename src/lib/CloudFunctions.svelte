<script>
	import { db } from "./firebase";
    import { getFunctions, httpsCallable } from 'firebase/functions';
    
    async function triggerHttpFunction() {
    try {
      const response = await fetch('YOUR_HTTP_FUNCTION_URL', {
        method: 'POST',
        body: JSON.stringify({ action: 'httpTrigger' })
      });
      const result = await response.json();
      console.log('HTTP Function Result:', result);
    } catch (error) {
      console.error('HTTP Function Error:', error);
    }
  }

  async function triggerCallableFunction() {
    try {
      const callableFunc = httpsCallable(functions, 'callableExample');
      const result = await callableFunc({ data: 'example' });
      console.log('Callable Function Result:', result.data);
    } catch (error) {
      console.error('Callable Function Error:', error);
    }
  }
</script>

<button on:click={triggerHttpFunction}>HTTP Function</button>
<button on:click={triggerCallableFunction}>Callable Function</button>