const form = document.getElementById("form");
const lista = document.getElementById("lista-compromissos");
const darkModeToggle = document.getElementById("darkModeToggle");
const filtro = document.getElementById("filtro");

let compromissos = JSON.parse(localStorage.getItem("agenda")) || [];
let editIndex = null;

function salvar() {
  localStorage.setItem("agenda", JSON.stringify(compromissos));
}

function renderizar() {
  lista.innerHTML = "";
  const categoriaFiltro = filtro.value;

  compromissos
    .filter(item => !categoriaFiltro || item.categoria === categoriaFiltro)
    .sort((a, b) => new Date(a.inicio) - new Date(b.inicio))
    .forEach((item, index) => {
      const div = document.createElement("div");
      div.className = "compromisso";

      div.innerHTML = `
        <div class="compromisso-info">
          <strong>${item.titulo}</strong>
          <p>${item.descricao}</p>
          <small>Início: ${item.inicio.replace("T", " ")}</small>
          <small>Fim: ${item.fim.replace("T", " ")}</small>
          <small>Categoria: ${item.categoria}</small>
        </div>
        <div class="actions">
          <button class="edit" onclick="editar(${index})">✏️</button>
          <button class="delete" onclick="excluir(${index})">🗑️</button>
        </div>
      `;

      lista.appendChild(div);
    });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const titulo = document.getElementById("titulo").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const inicio = document.getElementById("inicio").value;
  const fim = document.getElementById("fim").value;
  const categoria = document.getElementById("categoria").value;

  if (!titulo || !inicio || !fim || !categoria) return;

  const novo = { titulo, descricao, inicio, fim, categoria };

  if (editIndex !== null) {
    compromissos[editIndex] = novo;
    editIndex = null;
  } else {
    compromissos.push(novo);
  }

  salvar();
  renderizar();
  form.reset();
});

function editar(index) {
  const item = compromissos[index];
  document.getElementById("titulo").value = item.titulo;
  document.getElementById("descricao").value = item.descricao;
  document.getElementById("inicio").value = item.inicio;
  document.getElementById("fim").value = item.fim;
  document.getElementById("categoria").value = item.categoria;
  editIndex = index;
}

function excluir(index) {
  compromissos.splice(index, 1);
  salvar();
  renderizar();
}

filtro.addEventListener("change", renderizar);

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

renderizar();
