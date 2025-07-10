const apiKeyInput = document.getElementById('apiKey')
const gameSelect = document.getElementById('gameSelect')
const questionInput = document.getElementById('questionInput')
const askButton = document.getElementById('askButton')
const aiResponse = document.getElementById('aiResponse')
const form = document.getElementById('form')

const markdownConverter = (text) => {
  const converter = new showdown.Converter()
  return converter.makeHtml(text)
}

const perguntarIA = async (question, game, apiKey) => {
 const model = "gemini-2.5-flash"
 const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}` 
 const pergunta = `
Você é um especialista em ${game}. Responda a pergunta de forma clara e objetiva, sem rodeios. Pergunta: ${question}
 `
 const contents = [{
  parts: [{
    text: pergunta
  }]
 }]

 //chamada API
 const response = await fetch(geminiURL, {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents
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

  } catch (error) {
console.log('Erro :', error)
} finally {
  askButton.disabled = false
  askButton.textContent = "Perguntar"
  askButton.classList.remove('loading')
  }
}

form.addEventListener('submit', EnviarFormulario)
