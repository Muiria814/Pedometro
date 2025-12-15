const API = "https://backendpedo.onrender.com"; // MUDA ISTO

let steps = 0;

// contador de passos (exemplo manual)
function addStep() {
  steps++;
  document.getElementById("steps").innerText = steps;
}

// enviar passos para backend
async function syncSteps() {
  const res = await fetch(`${API}/steps`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ steps })
  });

  const data = await res.json();
  document.getElementById("saldo").innerText = data.saldo;
}

// buscar saldo do backend
async function loadSaldo() {
  const res = await fetch(`${API}/saldo`);
  const data = await res.json();
  document.getElementById("saldo").innerText = data.saldo;
}

// levantar DOGE
async function withdraw() {
  const amount = document.getElementById("amount").value;
  const address = document.getElementById("address").value;

  const res = await fetch(`${API}/withdraw`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, address })
  });

  const data = await res.json();
  alert("Saldo atual: " + data.saldo);
}

// carregar saldo ao abrir
loadSaldo();
