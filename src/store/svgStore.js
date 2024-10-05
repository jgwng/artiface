import { writable } from 'svelte/store';

export const head = persistentStore('head', '');
export const eyes = persistentStore('eyes', '');
export const mouth = persistentStore('mouth', '');
export const hair = persistentStore('hair', '');
export const outfit = persistentStore('outfit', '');
export const accessories = persistentStore('accessories', '');

export function persistentStore(key, initialValue) {
    const storedValue = localStorage.getItem(key);
    const value = storedValue ? JSON.parse(storedValue) : initialValue;
  
    const store = writable(value);
  
    store.subscribe((currentValue) => {
        localStorage.setItem(key, JSON.stringify(currentValue));
    });
  
    return store;
  }