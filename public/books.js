window.addEventListener('load', async () => {

    const token = localStorage.getItem("tokenid")
    const response = await fetch("http://localhost:3000/books", {
      
    method: "GET",

    headers: {

        "Content-Type": "application/json",

        "Authorization": `Bearer ${token}`

    }
    
  }).then(res => res.json())
  console.log(response)
  const data = response.books
  //const parsedData = JSON.parse(data)
  console.log(typeof(data))
      displayBooks(data)
})
    function displayBooks(books) {
    console.log(books)
    const table = document.getElementById('bookTable');
    console.log(table)
    books.forEach(book => {
        const row = table.insertRow();
        row.innerHTML = `<td>${book.title}</td><td>${book.author}</td><td>${book.genre}</td><td>${book.price}</td><td>${book.stock}</td>`;
    });
}
