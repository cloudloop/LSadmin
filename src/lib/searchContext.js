import { getContext, setContext } from 'svelte';

// Create a unique key for the context
const SEARCH_KEY = Symbol('search');

export function createSearchStore() {
    let searchTerm = $state('');
    
    return {
        get searchTerm() { return searchTerm; },
        set searchTerm(value) { searchTerm = value; }
    };
}

export function getSearchContext() {
    return getContext(SEARCH_KEY);
}

export function setSearchContext(store) {
    setContext(SEARCH_KEY, store);
} 