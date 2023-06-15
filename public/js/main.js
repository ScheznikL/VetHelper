const getCookie = (name) => {
  return document.cookie.split(";").some(c => {
    return c.trim().startsWith(name + "=")
  })
}

const deleteCookie = (name, path, domain) => {
  if (getCookie(name)) {
    document.cookie = name + "=" +
      ((path) ? ";path=" + path : "") +
      ((domain) ? ";domain=" + domain : "") +
      ";expires=Thu, 01 Jan 1970 00:00:01 GMT"
  }
}

window.addEventListener("load", () => {
  document.querySelector("#logout").addEventListener("click", () => {
    deleteCookie("token")

    fetch("/auth/logout")
      .then(res => {
        if (res.status !== 200) throw new Error(res.statusText)
        else window.location.href = "/auth"
      })
      .catch(() => {
        alert("Помилка! Неможливо вийти!")
      })
  })
})
