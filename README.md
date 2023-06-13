<h2>What it does</h2>
<p>Automates streaming unique Dalle-2 API requests, saves the image locally, saves the query to sqlite3.</p>

<h2>Why it exists</h2>
<p>This tool allows you to create dynamic prompts in real-time and harvest thousands of AI images.</p>

<h2>Getting Started</h2>
<ul>
  <li>
    Create an api key at https://platform.openai.com/account/api-keys 
  </li>
  <li>
    Clone the repo, install dependencies
  </li>
  <li>
  Add .env file to the bin folder with OPENAI_API_KEY="Your-API-Key-Here"
  </li>
  <li>Open index.js in your favorite code editor</li>
  <li>Set output directory</li>
  <li>Set limit and speed</li>
  <li>Construct your dynamic prompt, examples included in the index.js</li>
  <li>Run <i>nodemon index</i> from command line</li>
  <li>Enjoy!</li>
  </ul>
