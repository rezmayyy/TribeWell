import React, { useEffect } from 'react';

function TestPage() {
  useEffect(() => {
    // Inject Botpress webchat script
    const injectScript = document.createElement('script');
    injectScript.src = 'https://cdn.botpress.cloud/webchat/v3.0/inject.js';
    injectScript.async = true;
    document.body.appendChild(injectScript);

    // Inject your custom Botpress config script
    const configScript = document.createElement('script');
    configScript.src = 'https://files.bpcontent.cloud/2025/06/17/01/20250617011411-A1O2RN4E.js';
    configScript.async = true;
    document.body.appendChild(configScript);

    // Cleanup on unmount
    return () => {
      document.body.removeChild(injectScript);
      document.body.removeChild(configScript);
    };
  }, []);

  return (
    <div>
      <h1>Hello, TestPage!</h1>
      <p>The chatbot should appear in the bottom-right corner shortly.</p>
    </div>
  );
}

export default TestPage;
