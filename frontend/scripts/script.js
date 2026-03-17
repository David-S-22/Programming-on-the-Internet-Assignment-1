async function test() {
  fetch("http://localhost:3000/expenses")
    .then((data) => {
      data.json()
      .then((json) => {
        console.log(json);
      })
      .catch((e) => console.log(e))
    })
    .catch((e) => console.log(e))
}
