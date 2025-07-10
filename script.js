const apiKeyInput = document.getElementById('apiKey')
const gameSelect = document.getElementById('gameSelect')
const questionInput = document.getElementById('questionInput')
const askButton = document.getElementById('askButton')
const aiResponse = document.getElementById('aiResponse')
const form = document.getElementById('form')

const markdownToHtml = (text) => {
  const converter = new showdown.Converter()
  return converter.makeHtml(text)
}

const perguntarIA = async (question, game, apiKey) => {
 const model = "gemini-2.5-flash"
 const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}` 
 const pergunta = `
Você é um especialista em ${game}. Responda a pergunta de forma clara e objetiva, sem rodeios. Pergunta: ${question}
## Regras
- Considere a data atual ${new Date().toLocaleDateString()}
- Faça pesquisas Atualizadas na internet sobre o patch atual. baseando-se na data atual.
- Se você não souber a resposta, diga que não sabe.
- Nunca responda itens que você não tenha certeza de que existe no patch atual.
- Quando o usuário perguntar sobre o jogo Crossfire, você irá se referir ao Crossfire Brasil. Do site https://crossfire.z8games.com.br/
- Nunca fale sobre o jogo Crossfire Global, apenas Crossfire Brasil.
- A reposta deve ser única, sem alterações após a resposta.
- Quando o usuário perguntar sobre o jogo Crossfire, você irá também buscar respostas de sua duvida no forum do jogo Crossfire Brasil, localizado em https://br.forum.z8games.com

 `
 const contents = [{
  role: "user",
  parts: [{
    text: pergunta
  }]
 }]

 const tools = [{
  google_search: {}
  }]

 //chamada API
 const response = await fetch(geminiURL, {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents,
      tools
})
})

const data = await response.json()
return data.candidates[0].content.parts[0].text
}

const EnviarFormulario = async (event) => {
  event.preventDefault(0)
  const apiKey = apiKeyInput.value
  const game = gameSelect.value
  const question = questionInput.value

  if (apiKey == '' || game == '' || question == '') {
    alert('Por favor, preencha todos os campos.')
    return

  }

  askButton.disabled = true
  askButton.textContent = 'Perguntando...'
  askButton.classList.add('loading')

  try {
// perguntar para a IA
const text = await perguntarIA(question, game, apiKey)
aiResponse.querySelector('.response-content').innerHTML = markdownToHtml(text)
aiResponse.classList.remove('hidden')
  } catch (error) {
console.log('Erro :', error)
} finally {
  askButton.disabled = false
  askButton.textContent = "Perguntar"
  askButton.classList.remove('loading')
  }
}

form.addEventListener('submit', EnviarFormulario)