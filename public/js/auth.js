const showAccountSelect = () => {
  Array.from(document.querySelectorAll(".content>div:not(.account-type)"))
    .forEach(el => el.style.display = "none")

  document.querySelector(".account-type").style.display = "flex"
}

const handleTabs = () => {
  const login = document.querySelector("#login")
  const register = document.querySelector("#register")

  login.addEventListener("click", () => {
    showAccountSelect()
    register.classList.remove("active")
    login.classList.add("active")

    window.state.screen = "login"
  })

  register.addEventListener("click", () => {
    showAccountSelect()
    login.classList.remove("active")
    register.classList.add("active")

    window.state.screen = "register"
  })

  const owner = document.querySelector("#owner")
  const veterinarian = document.querySelector("#veterinarian")

  owner.addEventListener("click", () => {
    window.state.selectedType = "owner"
    document.querySelector(".account-type").style.display = "none"

    if (window.state.screen === "login") {
      document.querySelector(".login").style.display = "flex"
    } else {
      document.querySelector("[data-type=\"owner\"]").style.display = "flex"
    }
  })

  veterinarian.addEventListener("click", () => {
    window.state.selectedType = "veterinarian"
    document.querySelector(".account-type").style.display = "none"

    if (window.state.screen === "login") {
      document.querySelector(".login").style.display = "flex"
    } else {
      document.querySelector("[data-type=\"veterinarian\"]").style.display = "flex"
    }
  })
}

const login = () => {
  const email = document.querySelector(".login>[type='email']").value
  const password = document.querySelector(".login>[type='password']").value

  if (!email || !password) {
    alert("Bad Credentials!")
    return
  }

  return fetch(`/auth/${window.state.selectedType}/login?email=${email}&password=${password}`)
    .then(res => {
      if (res.status !== 200) throw new Error(res.statusText)
      else return res.text()
    })
    .then(() => {
      if (window.state.selectedType === "veterinarian") window.location.href = "/owners"
      if (window.state.selectedType === "owner") window.location.href = "/mypets"
    })
}

const register = () => {
  const pib = document.querySelector(`[data-type='${window.state.selectedType}']>.pib`).value
  const email = document.querySelector(`[data-type='${window.state.selectedType}']>[type='email']`).value
  const password = document.querySelector(`[data-type='${window.state.selectedType}']>[type='password']`).value

  if (window.state.selectedType === "veterinarian") {
    const position = document.querySelector(`[data-type='${window.state.selectedType}']>.position`).value

    if (!pib || !email || !password || !position) {
      alert("Bad Credentials!")
      return
    }

    return fetch(`/auth/${window.state.selectedType}/register?pib=${pib}&email=${email}&password=${password}&position=${position}`)
      .then(res => {
        if (res.status !== 200) throw new Error(res.statusText)
        else window.location.href = "/owners"
      })
  }

  if (window.state.selectedType === "owner") {
    if (!email || !password) {
      alert("Bad Credentials!")
      return
    }

    return fetch(`/auth/${window.state.selectedType}/register?pib=${pib}&email=${email}&password=${password}`)
      .then(res => {
        if (res.status !== 200) throw new Error(res.statusText)
        else window.location.href = "/mypets"
      })
  }
}

window.addEventListener("load", () => {

  window.state = {
    screen: "login",
    selectedType: null
  }

  handleTabs()

  const loginUser = document.querySelector("#login-user")
  loginUser.addEventListener("click", () => {
    loginUser.disabled = true

    login().catch(() => {
      alert("Error occurred!")
      loginUser.disabled = false
    })
  })

  const registerOwner = document.querySelector("#register-owner")
  const registerVeterinarian = document.querySelector("#register-veterinarian")
  registerOwner.addEventListener("click", () => {
    registerOwner.disabled = true

    register().catch(() => {
      alert("Error occurred!")
      registerOwner.disabled = false
    })
  })
  registerVeterinarian.addEventListener("click", () => {
    registerVeterinarian.disabled = true

    register().catch(() => {
      alert("Error occurred!")
      registerVeterinarian.disabled = false
    })
  })
})
