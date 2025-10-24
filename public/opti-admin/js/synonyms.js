// /public/opti-admin/js/synonyms.js
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('synonymsForm');
  const messageDiv = document.getElementById('message');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');
  const spinner = document.getElementById('spinner');

  function showMessage(text, isSuccess) {
    if (isSuccess === undefined) isSuccess = false;

    const className = isSuccess
      ? 'p-4 rounded-md mb-6 bg-green-50 text-green-800 border border-green-200'
      : 'p-4 rounded-md mb-6 bg-red-50 text-red-800 border border-red-200';

    messageDiv.className = className;
    messageDiv.textContent = text;
    messageDiv.classList.remove('hidden');
  }

  function setLoading(loading) {
    submitBtn.disabled = loading;
    if (loading) {
      btnText.classList.add('hidden');
      spinner.classList.remove('hidden');
    } else {
      btnText.classList.remove('hidden');
      spinner.classList.add('hidden');
    }
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    setLoading(true);
    messageDiv.classList.add('hidden');

    const formData = new FormData(form);
    const data = {
      synonyms: formData.get('synonyms'),
      synonymSlot: formData.get('synonymSlot'),
      languageRouting: formData.get('languageRouting')
    };

    fetch('/opti-admin/api/synonyms.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(function(response) {
      return response.json().then(function(result) {
        return { response: response, result: result };
      });
    })
    .then(function(data) {
      if (data.response.ok && data.result.success) {
        showMessage('✅ ' + data.result.message, true);
      } else {
        const errorMsg = '❌ ' + data.result.error + (data.result.details ? ' - ' + data.result.details : '');
        showMessage(errorMsg, false);
      }
    })
    .catch(function(error) {
      const errorMsg = '❌ Network error: ' + (error instanceof Error ? error.message : 'Unknown error');
      showMessage(errorMsg, false);
    })
    .finally(function() {
      setLoading(false);
    });
  });
});
