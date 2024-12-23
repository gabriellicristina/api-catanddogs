const apiKey = 'live_9Q0LLbT2rn6okZY8QvJdmv0lBhDFYhNntMxXwCgJcui6StZprFyhYfRAamYE31VF';
const breedSelect = document.getElementById('dog-breeds');
const resultDiv = document.getElementById('result');

// Função para traduzir texto usando API gratuita
async function traduzirTexto(ingles) {
    try {
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(ingles)}&langpair=en|pt`);
        const data = await response.json();

        if (data && data.responseData && data.responseData.translatedText) {
            return data.responseData.translatedText;
        } else {
            console.error('Erro ao traduzir texto:', data);
            return ingles; // Retorna o original em caso de falha.
        }
    } catch (error) {
        console.error('Erro ao acessar API de tradução:', error);
        return ingles; // Retorna o texto original se houver erro.
    }
}

// Carregar as raças da API
async function loadBreeds() {
    try {
        const response = await fetch('https://api.thedogapi.com/v1/breeds', {
            headers: {
                'x-api-key': apiKey
            }
        });
        if (!response.ok) {
            throw new Error(`Erro ao carregar raças: ${response.statusText}`);
        }

        const breeds = await response.json();

        breeds.forEach(breed => {
            const option = document.createElement('option');
            option.value = breed.id;
            option.textContent = breed.name;
            breedSelect.appendChild(option);
        });
    } catch (error) {
        console.error(error);
        alert('Erro ao carregar raças. Tente novamente mais tarde.');
    }
}

// Buscar informações da raça selecionada
async function fetchDogInfo() {
    const breedId = breedSelect.value;
    if (!breedId) {
        alert('Por favor, selecione uma raça.');
        return;
    }

    try {
        const response = await fetch(`https://api.thedogapi.com/v1/images/search?breed_ids=${breedId}&api_key=${apiKey}`, {
            headers: {
                'x-api-key': apiKey
            }
        });
        if (!response.ok) {
            throw new Error(`Erro ao buscar informações: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data || data.length === 0 || !data[0].breeds) {
            throw new Error('Nenhum dado encontrado para a raça selecionada.');
        }

        const breed = data[0].breeds[0];
        const temperamentoIngles = breed.temperament;

        // Traduzir o temperamento para português
        const temperamentoTraduzido = await traduzirTexto(temperamentoIngles);

        resultDiv.innerHTML = `
            <div class="dog-card">
                <h2>${breed.name}</h2>
                <p><strong>Temperamento:</strong> ${temperamentoTraduzido}</p>
                <p><strong>Altura:</strong> ${breed.height.metric} cm</p>
                <p><strong>Peso:</strong> ${breed.weight.metric} kg</p>
                <img src="${data[0].url}" alt="Imagem de um ${breed.name}">
            </div>
        `;

        resultDiv.classList.add('visible');
    } catch (error) {
        console.error(error);
        alert('Erro ao buscar informações da raça. Tente novamente mais tarde.');
    }
}

// Funcionalidade do menu hambúrguer
document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    toggleButton.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });
});

// Inicializar a página
loadBreeds();