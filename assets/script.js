document.getElementById('shortenBtn').addEventListener('click', async () => {
    const fullUrl = document.getElementById('fullUrl').value;
    const resultDiv = document.getElementById('result');
    const shortenedLink = document.getElementById('shortenedLink');

    // Define a URL base em uma variável
    // Ajuste esta URL para a que você estiver usando (local ou Vercel)
    const baseUrl = 'https://devcix.com';
    const api_url = `${baseUrl}/api/shorten`;

    try {
        const response = await fetch(api_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fullUrl }),
        });

        const data = await response.json();

        if (response.ok) {
            shortenedLink.href = `${baseUrl}/${data.shortUrl}`;
            shortenedLink.textContent = `${baseUrl}/${data.shortUrl}`;
            resultDiv.classList.remove('hidden');
        } else {
            alert(data.error || 'Ocorreu um erro.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Não foi possível se conectar ao servidor.');
    }
});