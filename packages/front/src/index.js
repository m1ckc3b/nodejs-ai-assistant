const form = document.querySelector("#form")
// const question = document.querySelector("#question")

const questionAsked = document.querySelector('#response-question')
const responseDiv = document.querySelector('#response-text')
const reqExecution = document.querySelector("#req-execution")

form.addEventListener("submit", submitForm)
question.addEventListener("change", () => {
  questionAsked.innerHTML = ''
  responseDiv.innerHTML = ''
  reqExecution.innerHTML = ''
})

async function submitForm(e) {
  e.preventDefault()

  // const question = e.target.question.value
  const question = e.target.question.value
  
  // Time execution Start
  const start = Date.now()

  const response = await fetch("http://localhost:3000/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  })
  // Time execution End
  const end = Date.now()

  form.reset()

  questionAsked.innerHTML = `
    <h3>Votre question était</h3>
    <p><i>${question}"</i></p>
  `
  responseDiv.innerHTML = `
    <h3>Réponse</h3>
    <p>${await response.text()}</p>
  `
  reqExecution.innerHTML = `
    <p><i><b>Réponse en ${(end - start)/1000} secondes</b></i></p>
  `
}