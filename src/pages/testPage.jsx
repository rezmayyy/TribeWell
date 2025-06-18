import { useEffect } from 'react';

function TestPage() {
  useEffect(() => {
    // Load the first script (Botpress Webchat)
    const script1 = document.createElement('script');
    script1.src = "https://cdn.botpress.cloud/webchat/v3.0/inject.js";
    script1.async = true;
    
    // After the first script loads, load the second script
    script1.onload = () => {
      const script2 = document.createElement('script');
      script2.src = "https://files.bpcontent.cloud/2025/06/17/01/20250617011411-A1O2RN4E.js";
      script2.async = true;
      document.body.appendChild(script2);
    };

    // Append the first script to the body
    document.body.appendChild(script1);

    // Cleanup: remove the script tags when the component unmounts
    return () => {
      document.body.removeChild(script1);
      const script2 = document.querySelector(`script[src="https://files.bpcontent.cloud/2025/06/17/01/20250617011411-A1O2RN4E.js"]`);
      if (script2) {
        document.body.removeChild(script2);
      }
    };
  }, []);

  return (
    <div>
      <h1>Test Page for Botpress</h1>
      <p>This is a test page to check the Botpress Webchat integration.</p>
    </div>
  );
}

export default TestPage;
