
import React from 'react';
import { Link } from 'react-router-dom';

const IframeDemo = () => {
  // The URL will be the current origin - pointing to our app's Index page
  const iframeUrl = window.location.origin;

  const copyEmbedCode = () => {
    const embedCode = `<iframe src="${iframeUrl}" width="100%" height="600px" frameborder="0"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    alert('Embed code copied to clipboard!');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Scratch Card Iframe Demo</h1>
        <p className="text-gray-600 mb-4">
          This page demonstrates how to embed the scratch card game in an iframe.
        </p>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <Link 
            to="/" 
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            Back to Game
          </Link>
          
          <button
            onClick={copyEmbedCode}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Copy Embed Code
          </button>
        </div>
      </div>

      <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
        <h2 className="text-lg font-semibold mb-3">Iframe Preview</h2>
        <div className="relative">
          <iframe
            src={iframeUrl}
            title="Scratch Card Game"
            className="w-full h-[600px] border rounded"
            frameBorder="0"
          ></iframe>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">How to Use</h3>
        <ol className="list-decimal ml-5 space-y-2">
          <li>Click "Copy Embed Code" to get the iframe HTML code</li>
          <li>Paste the code into your HTML page</li>
          <li>Adjust the width and height as needed</li>
        </ol>
        
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <pre className="text-sm overflow-x-auto">
            &lt;iframe src="{iframeUrl}" width="100%" height="600px" frameborder="0"&gt;&lt;/iframe&gt;
          </pre>
        </div>
      </div>
    </div>
  );
};

export default IframeDemo;
