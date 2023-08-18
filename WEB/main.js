const url = "http://localhost:3000/Movies";

fetch(url)
  .then((response) => {
    // Verificar si la respuesta es exitosa (código de estado en el rango 200-299)
    if (!response.ok) {
      throw new Error(`Error de red - Código de estado: ${response.status}`);
    }
    // Convertir la respuesta a formato JSON y devolverla
    return response.json();
  })
  .then((data) => {
    // Manejar los datos JSON
    const html = data
      .map((Buffer) => {
        return `
            <article data-id = "${Buffer.id}">
                <h1>${Buffer.title}</h1>
                <img src = "${Buffer.poster}" alt = "${Buffer.title}"></img>
                <p>${Buffer.director}</p> 
                <div class = "Space"/>
                <button class="ButtonDelect">Eliminar</button>
            </article>
        `;
      })
      .join("");
    document.querySelector(".Seccion").innerHTML = html;
    document.querySelector(".ButtonDelect").addEventListener("click", (e) => {
      const Article = e.target.closest("Article");
      const id = Article.dataset.id;

      fetch(`http://localhost:3000/Movies/${id}`,{
        method: "DELETE",
      })
        .then((response) => {
          if(response.ok) Article.remove()
        })
        .catch((error) => console.error("Error:", error));
    });
  })
  .catch((error) => {
    // Manejar cualquier error que ocurra durante la solicitud
    console.error("Ha ocurrido un error:", error);
  });
