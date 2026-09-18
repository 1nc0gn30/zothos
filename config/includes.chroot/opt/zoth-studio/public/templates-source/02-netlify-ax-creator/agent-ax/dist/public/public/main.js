(function () {
  const endpointSel = document.getElementById('endpoint-select');
  const methodSel = document.getElementById('method-select');
  const payloadInput = document.getElementById('payload-input');
  const sendBtn = document.getElementById('send-btn');
  const clearBtn = document.getElementById('clear-btn');
  const responseOut = document.getElementById('response-output');

  async function sendRequest() {
    const endpoint = endpointSel.value;
    const method = methodSel.value;
    const url = '/_netlify/functions' + endpoint;

    const bodyRaw = payloadInput.value.trim();
    const options = {
      method,
      headers: {
        'Accept': 'application/json, text/plain;q=0.5, */*;q=0.1',
      },
    };

    if (method.toUpperCase() !== 'GET' && bodyRaw.length) {
      try {
        const parsed = JSON.parse(bodyRaw);
        options.body = JSON.stringify(parsed);
        options.headers['Content-Type'] = 'application/json';
      } catch (err) {
        options.body = bodyRaw;
        options.headers['Content-Type'] = 'text/plain';
      }
    }

    responseOut.textContent = `Sending ${method} ${url}...`;

    try {
      const start = performance.now();
      const response = await fetch(url, options);
      const ms = Math.round(performance.now() - start);
      const text = await response.text();
      const out = {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
        ms,
        endpoint,
        method,
        body: bodyRaw || undefined,
        response: text,
      };
      responseOut.textContent = JSON.stringify(out, null, 2);
    } catch (err) {
      responseOut.textContent = 'Error: ' + err.message;
    }
  }

  sendBtn.addEventListener('click', sendRequest);
  clearBtn.addEventListener('click', () => {
    payloadInput.value = '';
    responseOut.textContent = 'Ready.';
  });
})();
