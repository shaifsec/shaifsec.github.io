// script.js — behaviour for Advanced Google Dork Builder

// Replace template placeholder with domain
function tplReplace(tpl, domain){
  return tpl.replace(/{{targetDomain}}/g, domain);
}

// Open Google search for the provided template
function openGoogleDork(tpl){
  const domain = (document.getElementById('targetDomain').value || '').trim();
  if(!domain){ alert('Please enter a target domain'); return; }
  const q = tplReplace(tpl, domain);
  document.getElementById('lastQuery').textContent = q;
  const url = 'https://www.google.com/search?q=' + encodeURIComponent(q);
  window.open(url, '_blank');
}

// Open Wayback Machine for domain
function openWayback(){
  const domain = (document.getElementById('targetDomain').value || '').trim();
  if(!domain){ alert('Please enter a target domain'); return; }
  const url = 'https://web.archive.org/web/*/' + encodeURIComponent(domain) + '/*';
  document.getElementById('lastQuery').textContent = url;
  window.open(url, '_blank');
}

// Copy last query to clipboard
function copyQuery(){
  const q = document.getElementById('lastQuery').textContent;
  if(!q || q==='(no query yet)'){ alert('No query to copy'); return; }
  navigator.clipboard.writeText(q).then(()=>alert('Copied query'));
}

// Clear last query display
function clearLast(){ document.getElementById('lastQuery').textContent='(no query yet)'; }

// Attach handlers to buttons using data attributes (avoids quoting issues)
function attachDorkHandlers(){
  // dork buttons (data-tpl)
  document.querySelectorAll('.dork-btn').forEach(btn=>{
    const tpl = btn.getAttribute('data-tpl');
    const isWayback = btn.hasAttribute('data-wayback') || btn.id === 'waybackBtn';
    btn.addEventListener('click', ()=>{
      if(isWayback) return openWayback();
      if(tpl) return openGoogleDork(tpl);
    });
  });

  // copy & clear
  const copyBtn = document.getElementById('copyBtn');
  if(copyBtn) copyBtn.addEventListener('click', copyQuery);
  const clearBtn = document.getElementById('clearBtn');
  if(clearBtn) clearBtn.addEventListener('click', clearLast);
}

// Theme toggle (switches CSS variables)
function initThemeToggle(){
  const toggle = document.getElementById('toggleTheme');
  toggle.addEventListener('click', ()=>{
    const body = document.body;
    const current = body.getAttribute('data-theme');
    if(current === 'dark'){
      body.setAttribute('data-theme','light');
      toggle.textContent = 'Dark theme';
    } else {
      body.setAttribute('data-theme','dark');
      toggle.textContent = 'Light theme';
    }
  });
}

// init
document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('targetDomain').value = 'target.com'; // default target
  document.body.setAttribute('data-theme','dark');
  const toggle = document.getElementById('toggleTheme');
  if(toggle) toggle.textContent = 'Light theme';

  attachDorkHandlers();
  initThemeToggle();
});
