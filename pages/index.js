import { useState } from 'react';

const Home = () => {
  const [issuesOutput, setIssuesOutput] = useState('');
  const [issuesCount, setIssuesCount] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertMessage] = useState('<div class="alert alert-danger" role="alert">Something went wrong</div>');
  const [emptyUrl] = useState('<div class="alert alert-danger" role="alert">Please add an URL</div>');
  const [warningMessage] = useState('<div class="alert alert-warning" role="alert">No issues found</div>');
  const [csvMessage] = useState('<div class="alert alert-warning" role="alert">CSV not available</div>');

  const testAccessibility = async (e) => {
    e.preventDefault();
    const url = document.querySelector('#url').value;
    if (!url) {
      setIssuesOutput(emptyUrl);
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`/api/test?url=${url}`);
      if (!response.ok) {
        setIssuesOutput(alertMessage);
        return;
      }
      const { issues } = await response.json();
      addIssuesToDOM(issues);
    } catch (error) {
      console.error(error);
      setIssuesOutput(alertMessage);
    } finally {
      setLoading(false);
    }
  };

  const csvIssues = async (e) => {
    e.preventDefault();
    const url = document.querySelector('#url').value;
    if (!url) {
      setIssuesOutput(emptyUrl);
      return;
    }

    try {
      const response = await fetch(`/api/test?url=${url}`);
      if (!response.ok) {
        alert(csvMessage);
        return;
      }
      const { issues } = await response.json();
      if (issues.length === 0) {
        alert(csvMessage);
        return;
      }
      const csv = issues.map(issue => `${issue.code},${issue.message},${issue.context}`).join('\n');
      const csvBlob = new Blob([csv], { type: 'text/csv' });
      const csvUrl = URL.createObjectURL(csvBlob);
      const link = document.createElement('a');
      link.href = csvUrl;
      link.download = `Accessibility_issues_list_${url.substring(12)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(error);
      setIssuesOutput(alertMessage);
    }
  };

  const addIssuesToDOM = (issues) => {
    if (issues.length === 0) {
      setIssuesOutput(warningMessage);
    } else {
      setIssuesCount(`<p class="alert alert-warning">${issues.length} issues found!</p>`);
      const output = issues.map((issue, index) => (
        `<div class="card mb-5" key=${index}>
          <div class="card-body">
            <h4>${issue.message}</h4>
            <p class="text-black p-3 my-3">${escapeHTML(issue.context)}</p>
            <p class="text-black" class="bg-secondary text-light p-2">CODE: ${issue.code}</p>
          </div>
        </div>`
      )).join('');
      setIssuesOutput(output);
    }
  };

  const clearResults = (e) => {
    e.preventDefault();
    setIssuesOutput('');
    setIssuesCount('');
    document.querySelector('#url').value = '';
  };

  const escapeHTML = (html) => {
    return html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  return (
    <div className="max- bg-gradient-to-b from-blue-100 to-blue-200 flex flex-col items-center gap-10 p-10 text-blue-700">
      <form onSubmit={testAccessibility} className="flex flex-col gap-4">
        <input type="text" id="url" placeholder="Enter URL" className="border border-gray-400 rounded-md py-2 px-4" />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Test Accessibility</button>
      </form>

      {loading && <div className="loader">Loading...</div>}

      <div class="flex flex-col max-w-80" id="issues" dangerouslySetInnerHTML={{ __html: issuesOutput }} />
      <div className="" id="number" dangerouslySetInnerHTML={{ __html: issuesCount }} />

      <button id="clearResults" onClick={clearResults} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md">Clear Results</button>
      <button id="csvBtn" onClick={csvIssues} className="bg-blue-500 hover:bg-blue-600 text-black font-bold py-2 px-4 rounded-md">Download CSV</button>
    </div>
  );
};

export default Home;



// // pages/index.js
// import React, { useState } from 'react';

// import Head from 'next/head';

// export default function HeroSection() {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex flex-col justify-start items-center gap-10">
//       <div className="h-72 flex flex-col justify-start items-start">
//         <div className="flex justify-end items-start gap-10">
//           <div className="w-32 h-14 px-4 py-3 bg-blue-900 rounded-full flex justify-center items-center gap-2">
//             <div className="text-white text-sm font-bold">DOWNLOAD</div>
//           </div>
//           <div className="flex justify-end items-start gap-10">
//             <div className="px-4 py-3 flex justify-center items-center gap-2">
//               <div className="text-blue-900 text-4xl font-bold">NAV</div>
//             </div>
//             <div className="px-4 py-3 flex justify-center items-center gap-2">
//               <div className="text-blue-900 text-4xl font-bold">NAV</div>
//             </div>
//             <div className="px-4 py-3 flex justify-center items-center gap-2">
//               <div className="text-blue-900 text-4xl font-bold">NAV</div>
//             </div>
//           </div>
//         </div>
//         <div className="pt-20 pb-10 px-10 flex justify-center items-center gap-10">
//           <div className="text-blue-900 text-7xl font-bold">EaseAccess</div>
//         </div>
//       </div>
//       <div className="pt-28 pb-10 flex flex-col justify-start items-start gap-10">
//         <div className="w-full px-20 py-10 bg-blue-900 rounded-xl flex justify-center items-center gap-10">
//           <div className="text-white text-2xl font-bold">DOWNLOAD</div>
//         </div>
//       </div>
//     </div>
//   );
// }


// const Home = () => {
//   const [issuesOutput, setIssuesOutput] = useState('');
//   const [issuesCount, setIssuesCount] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [alertMessage] = useState('<div class="alert alert-danger" role="alert">Something went wrong</div>');
//   const [emptyUrl] = useState('<div class="alert alert-danger" role="alert">Please add an URL</div>');
//   const [warningMessage] = useState('<div class="alert alert-warning" role="alert">No issues found</div>');
//   const [csvMessage] = useState('<div class="alert alert-warning" role="alert">CSV not available</div>');

//   const testAccessibility = async (e) => {
//     e.preventDefault();
//     const url = document.querySelector('#url').value;
//     if (!url) {
//       setIssuesOutput(emptyUrl);
//       return;
//     }
//     setLoading(true);

//     try {
//       const response = await fetch(`/api/test?url=${url}`);
//       if (!response.ok) {
//         setIssuesOutput(alertMessage);
//         return;
//       }
//       const { issues } = await response.json();
//       addIssuesToDOM(issues);
//     } catch (error) {
//       console.error(error);
//       setIssuesOutput(alertMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const csvIssues = async (e) => {
//     e.preventDefault();
//     const url = document.querySelector('#url').value;
//     if (!url) {
//       setIssuesOutput(emptyUrl);
//       return;
//     }

//     try {
//       const response = await fetch(`/api/test?url=${url}`);
//       if (!response.ok) {
//         alert(csvMessage);
//         return;
//       }
//       const { issues } = await response.json();
//       if (issues.length === 0) {
//         alert(csvMessage);
//         return;
//       }
//       const csv = issues.map(issue => `${issue.code},${issue.message},${issue.context}`).join('\n');
//       const csvBlob = new Blob([csv], { type: 'text/csv' });
//       const csvUrl = URL.createObjectURL(csvBlob);
//       const link = document.createElement('a');
//       link.href = csvUrl;
//       link.download = `Accessibility_issues_list_${url.substring(12)}.csv`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       console.error(error);
//       setIssuesOutput(alertMessage);
//     }
//   };

//   const addIssuesToDOM = (issues) => {
//     if (issues.length === 0) {
//       setIssuesOutput(warningMessage);
//     } else {
//       setIssuesCount(`<p class="alert alert-warning">${issues.length} issues found!</p>`);
//       const output = issues.map((issue, index) => (
//         `<div class="card mb-5" key=${index}>
//           <div class="card-body">
//             <h4>${issue.message}</h4>
//             <p class="bg-light p-3 my-3">${escapeHTML(issue.context)}</p>
//             <p class="bg-secondary text-light p-2">CODE: ${issue.code}</p>
//           </div>
//         </div>`
//       )).join('');
//       setIssuesOutput(output);
//     }
//   };

//   const clearResults = (e) => {
//     e.preventDefault();
//     setIssuesOutput('');
//     setIssuesCount('');
//     document.querySelector('#url').value = '';
//   };

//   const escapeHTML = (html) => {
//     return html
//       .replace(/&/g, '&amp;')
//       .replace(/</g, '&lt;')
//       .replace(/>/g, '&gt;')
//       .replace(/"/g, '&quot;')
//       .replace(/'/g, '&#039;');
//   };

//   return (
//     <div>
//       <form onSubmit={testAccessibility}>
//         <input type="text" id="url" placeholder="Enter URL" />
//         <button type="submit">Test Accessibility</button>
//       </form>

//       {loading && <div className="loader">Loading...</div>}

//       <div id="issues" dangerouslySetInnerHTML={{ __html: issuesOutput }} />
//       <div id="number" dangerouslySetInnerHTML={{ __html: issuesCount }} />

//       <button id="clearResults" onClick={clearResults}>Clear Results</button>
//       <button id="csvBtn" onClick={csvIssues}>Download CSV</button>
//     </div>
//   );
// };

// export default Home;
