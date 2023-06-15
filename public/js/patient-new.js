window.addEventListener("load", () => {
  const addButton = document.querySelector("#add")

  addButton.addEventListener("click", () => {
    const ownerEmail = document.querySelector("#ownerEmail").value
    const name = document.querySelector("#name").value
    const sex = document.querySelector("#sex").value
    const age = document.querySelector("#age").value
    const type = document.querySelector("#type").value
    const reasonOfApplication = document.querySelector("#reasonOfApplication").value
    const receipt = document.querySelector("#receipt").value
    const ration = document.querySelector("#ration").value
    const prevention = document.querySelector("#prevention").value
    const diagnosis = document.querySelector("#diagnosis").value
    const analyses = document.querySelector("#analyses").value

    if (ownerEmail === "" || name === "" || sex === "" || age === "" || type === "" || reasonOfApplication === "" ||
      receipt === "" || ration === "" || prevention === "" || diagnosis === "" || analyses === ""
    ) {
      alert("Помилка! Заповніть, будь-ласка, усі поля!")
      return
    }

    fetch(`/patient/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ownerEmail,
        name,
        sex,
        age,
        type,
        dateOfApplication: (new Date()).toLocaleDateString(),
        reasonOfApplication,
        receipt,
        ration,
        prevention,
        diagnosis,
        analyses
      })
    })
      .then(res => {
        if (res.status !== 200) throw new Error(res.statusText)
        else alert("Звернення збережено!")
      })
      .catch(() => {
        alert("Помилка! Неможливо додати! Некорректні дані!")
      })

  })
})
