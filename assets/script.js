const form = document.getElementById('shortenForm');
const fullUrlInput = document.getElementById('fullUrl');
const shortenBtn = document.getElementById('shortenBtn');
const resultDiv = document.getElementById('result');
const shortenedLink = document.getElementById('shortenedLink');
const copyBtn = document.getElementById('copyBtn');
const formMessage = document.getElementById('formMessage');
const copyStatus = document.getElementById('copyStatus');

const baseUrl = window.location.origin === 'null' ? 'http://localhost:3000' : window.location.origin;
const apiUrl = `${baseUrl}/api/shorten`;

function setMessage(message, type = '') {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`.trim();
}

function setCopyStatus(message, type = '') {
    copyStatus.textContent = message;
    copyStatus.className = `copy-status ${type}`.trim();
}

function validateUrl(value) {
    if (!value) {
        return 'Digite uma URL para encurtar.';
    }

    try {
        const parsedUrl = new URL(value);

        if (parsedUrl.protocol !== 'https:') {
            return 'Use um link que comece com https://.';
        }

        return '';
    } catch {
        return 'Digite uma URL válida, por exemplo https://exemplo.com.';
    }
}

async function copyShortLink() {
    const shortLink = shortenedLink.href;

    if (!shortLink || shortLink === '#') {
        return;
    }

    try {
        await navigator.clipboard.writeText(shortLink);
        setCopyStatus('Link copiado para a área de transferência.', 'success');
    } catch {
        setCopyStatus('Não foi possível copiar automaticamente. Selecione o link manualmente.', 'error');
    }
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const fullUrl = fullUrlInput.value.trim();
    const validationMessage = validateUrl(fullUrl);

    setCopyStatus('');

    if (validationMessage) {
        resultDiv.classList.add('hidden');
        setMessage(validationMessage, 'error');
        fullUrlInput.focus();
        return;
    }

    shortenBtn.disabled = true;
    shortenBtn.textContent = 'Encurtando...';
    setMessage('Criando seu link...', 'success');

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fullUrl })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Ocorreu um erro ao encurtar a URL.');
        }

        shortenedLink.href = data.shortLink || `${baseUrl}/${data.shortUrl}`;
        shortenedLink.textContent = data.shortLink || `${baseUrl}/${data.shortUrl}`;
        resultDiv.classList.remove('hidden');
        setMessage('Link encurtado com sucesso.', 'success');
        setCopyStatus('');
    } catch (error) {
        console.error('Erro:', error);
        resultDiv.classList.add('hidden');
        setMessage(error.message || 'Não foi possível se conectar ao servidor.', 'error');
    } finally {
        shortenBtn.disabled = false;
        shortenBtn.textContent = 'Encurtar link';
    }
});

copyBtn.addEventListener('click', async () => {
    await copyShortLink();
});