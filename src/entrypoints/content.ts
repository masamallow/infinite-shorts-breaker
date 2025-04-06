export default defineContentScript({
  matches: ['*://www.youtube.com/shorts/*'],
  runAt: 'document_idle', // TODO temp
  main() {
    console.log('Hello from content script!');
  },
});
