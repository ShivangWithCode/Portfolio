/**
 * Interactive Recruiter CLI Terminal Emulator
 * Shivang Pandey Portfolio
 * (Python Backend Engineer: Flask, FastAPI, Django + React & JS)
 */

(function () {
  'use strict';

  const terminalOutput = document.getElementById('terminal-output');
  const terminalInput = document.getElementById('terminal-input');
  const commandChips = document.querySelectorAll('.term-chip');
  if (!terminalOutput || !terminalInput) return;

  const commandHistory = [];
  let historyIndex = -1;

  const COMMANDS = {
    help: () => `
<div class="terminal-line"><span class="cmd-highlight">AVAILABLE COMMANDS:</span></div>
<div class="terminal-line">  <span class="cmd-prefix">services</span>   - Web applications, Python backends, REST APIs & custom business tools</div>
<div class="terminal-line">  <span class="cmd-prefix">about</span>      - Learn about Shivang's background, education & technical focus</div>
<div class="terminal-line">  <span class="cmd-prefix">skills</span>     - View technical stack (Python, Django, FastAPI, React, DBs)</div>
<div class="terminal-line">  <span class="cmd-prefix">projects</span>   - Discover full-stack web applications & backend systems</div>
<div class="terminal-line">  <span class="cmd-prefix">contact</span>    - Direct email & collaboration inquiries</div>
<div class="terminal-line">  <span class="cmd-prefix">socials</span>    - Social links (GitHub, LinkedIn)</div>
<div class="terminal-line">  <span class="cmd-prefix">theme &lt;name&gt;</span>- Change accent theme (violet, cyan, emerald, amber, rose)</div>
<div class="terminal-line">  <span class="cmd-prefix">clear</span>      - Clear terminal screen</div>
<div class="terminal-line">  <span class="cmd-prefix">date</span>       - Print current local date & time</div>
`,

    services: () => `
<div class="terminal-line"><span class="cmd-highlight">DEVELOPMENT SERVICES &amp; SOLUTIONS:</span></div>
<div class="terminal-line">  1. <span class="cmd-prefix">Modern Web Applications</span>       - Full-stack web platforms built with React, modern JS & Python</div>
<div class="terminal-line">  2. <span class="cmd-prefix">Python Backends &amp; REST APIs</span>    - High-performance APIs with FastAPI, Django & Flask</div>
<div class="terminal-line">  3. <span class="cmd-prefix">Business Management Systems</span>    - Custom admin dashboards, inventory trackers & workflow tools</div>
<div class="terminal-line"><span class="cmd-success">✔ Available for: Freelance Projects, Startups, Agencies &amp; Growing Businesses.</span></div>
<div class="terminal-line"><span class="cmd-dim">Type 'contact' or email pandeyshivang987@gmail.com to discuss your project.</span></div>
`,

    freelance: () => COMMANDS.services(),

    about: () => `
<div class="terminal-line"><span class="cmd-success">ABOUT SHIVANG PANDEY:</span></div>
<div class="terminal-line">Full-Stack Web Developer specializing in Python backend development and business web applications.</div>
<div class="terminal-line">Education: Master of Computer Applications (MCA) from Institute of Engineering and Technology (IET), Lucknow.</div>
<div class="terminal-line">Core Backend: Python, Django, FastAPI, Flask, REST APIs, PostgreSQL, MySQL, SQLite.</div>
<div class="terminal-line">Frontend: JavaScript (ES6+), React, Next.js, HTML5, CSS3.</div>
<div class="terminal-line">Focus: Building responsive websites, robust backend APIs, and reliable database-driven business solutions.</div>
`,

    skills: () => `
<div class="terminal-line"><span class="cmd-highlight">TECHNICAL COMPETENCIES:</span></div>
<div class="terminal-line">  <span class="cmd-prefix">[Backend & APIs]</span>  Python, Django, FastAPI, Flask, RESTful API Development</div>
<div class="terminal-line">  <span class="cmd-prefix">[Frontend]</span>        JavaScript (ES6+), React.js, Next.js, HTML5, CSS3</div>
<div class="terminal-line">  <span class="cmd-prefix">[Databases]</span>       PostgreSQL, MySQL, SQLite, Database Integration & CRUD</div>
<div class="terminal-line">  <span class="cmd-prefix">[Tools & Workflow]</span> Git & GitHub, Postman, Authentication & Authorization</div>
`,

    projects: () => `
<div class="terminal-line"><span class="cmd-highlight">FLAGSHIP PROJECTS:</span></div>
<div class="terminal-line">  1. <span class="cmd-prefix">SwiftKart</span>        - Full-stack e-commerce web platform with Python REST API & React frontend</div>
<div class="terminal-line">  2. <span class="cmd-prefix">StockFlow</span>        - Business inventory & management system with Python/Django & PostgreSQL</div>
<div class="terminal-line">  3. <span class="cmd-prefix">MiniStore</span>        - Modular Flask e-commerce application with relational database schemas</div>
<div class="terminal-line">  4. <span class="cmd-prefix">TaskFlow Pro</span>     - Productivity and sprint task tracker with Flask REST API & React UI</div>
<div class="terminal-line"><span class="cmd-dim">Tip: Scroll to Featured Projects section or click 'Architecture Deep Dive' for details.</span></div>
`,

    resume: () => {
      const link = document.createElement('a');
      link.href = 'assets/resume.pdf';
      link.download = 'Shivang_Pandey_Resume.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return `<div class="terminal-line"><span class="cmd-success">✔ Resume download triggered: Shivang_Pandey_Resume.pdf</span></div>`;
    },

    contact: () => `
<div class="terminal-line"><span class="cmd-highlight">CONTACT CHANNELS:</span></div>
<div class="terminal-line">  Phone:    <a href="tel:+919026399211" class="cmd-prefix">+91 9026399211</a></div>
<div class="terminal-line">  WhatsApp: <a href="https://wa.me/919026399211" target="_blank" class="cmd-prefix">wa.me/919026399211</a></div>
<div class="terminal-line">  Email:    <a href="mailto:pandeyshivang987@gmail.com" class="cmd-prefix">pandeyshivang987@gmail.com</a></div>
<div class="terminal-line">  Role:     Full-Stack Web Developer & Python Backend Specialist</div>
<div class="terminal-line">  Location: India (IST / UTC+5:30)</div>
<div class="terminal-line">  Status:   Available for freelance projects, custom web apps & contract work</div>
`,

    socials: () => `
<div class="terminal-line"><span class="cmd-highlight">CONNECT ONLINE:</span></div>
<div class="terminal-line">  WhatsApp: <a href="https://wa.me/919026399211" target="_blank" class="cmd-prefix">+91 9026399211 (Direct Chat)</a></div>
<div class="terminal-line">  GitHub:   <a href="https://github.com/ShivangWithCode/Portfolio" target="_blank" class="cmd-prefix">github.com/ShivangWithCode/Portfolio</a></div>
<div class="terminal-line">  LinkedIn: <a href="https://linkedin.com" target="_blank" class="cmd-prefix">linkedin.com/in/shivang-pandey</a></div>
<div class="terminal-line">  Email:    <a href="mailto:pandeyshivang987@gmail.com" class="cmd-prefix">pandeyshivang987@gmail.com</a></div>
`,

    date: () => `<div class="terminal-line"><span class="cmd-dim">${new Date().toLocaleString()}</span></div>`,

    sudo: () => `<div class="terminal-line"><span class="cmd-prefix">Permission granted:</span> Shivang is already superuser in this matrix! ⚡</div>`,

    clear: () => {
      terminalOutput.innerHTML = '';
      return '';
    }
  };

  function executeCommand(rawCmd) {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    commandHistory.push(trimmed);
    historyIndex = commandHistory.length;

    // Display user command line
    const userLine = document.createElement('div');
    userLine.className = 'terminal-line';
    userLine.innerHTML = `<span class="cmd-prefix">visitor@shivang-dev:~$</span> <span>${escapeHtml(trimmed)}</span>`;
    terminalOutput.appendChild(userLine);

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts[1] ? parts[1].toLowerCase() : null;

    if (cmd === 'clear') {
      COMMANDS.clear();
      return;
    }

    if (cmd === 'theme' && arg) {
      if (['violet', 'cyan', 'emerald', 'amber', 'rose'].includes(arg)) {
        document.documentElement.setAttribute('data-theme', arg);
        localStorage.setItem('portfolio-theme', arg);
        // Sync dots
        document.querySelectorAll('.theme-dot').forEach(dot => {
          dot.classList.toggle('active', dot.getAttribute('data-pick') === arg);
        });
        const outLine = document.createElement('div');
        outLine.className = 'terminal-line';
        outLine.innerHTML = `<span class="cmd-success">✔ Theme accent changed to '${arg}'</span>`;
        terminalOutput.appendChild(outLine);
      } else {
        const outLine = document.createElement('div');
        outLine.className = 'terminal-line';
        outLine.innerHTML = `<span class="cmd-dim">Usage: theme [violet | cyan | emerald | amber | rose]</span>`;
        terminalOutput.appendChild(outLine);
      }
    } else if (COMMANDS[cmd]) {
      const result = COMMANDS[cmd]();
      if (result) {
        const outLine = document.createElement('div');
        outLine.innerHTML = result;
        terminalOutput.appendChild(outLine);
      }
    } else {
      const errLine = document.createElement('div');
      errLine.className = 'terminal-line';
      errLine.innerHTML = `<span style="color: #f87171;">Command not recognized: '${escapeHtml(cmd)}'. Type <span class="cmd-prefix">help</span> for a list of available commands.</span>`;
      terminalOutput.appendChild(errLine);
    }

    // Auto scroll down
    const body = terminalOutput.parentElement;
    if (body) {
      body.scrollTop = body.scrollHeight;
    }
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function (m) {
      switch (m) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#39;';
        default: return m;
      }
    });
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = terminalInput.value;
      terminalInput.value = '';
      executeCommand(val);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        terminalInput.value = '';
      }
    }
  });

  // Handle Quick Chips
  commandChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        executeCommand(cmd);
        terminalInput.focus();
      }
    });
  });
})();
