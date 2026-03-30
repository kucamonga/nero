// CONFIG FIREBASE
const firebaseConfig = {
  apiKey: "BDmcsIoL0JN-UZtq-E95lKGfuSVBnEe2JyA2pyCNUchQje0CjuYUKekzGelfB5nE-x6sjuIdHJydoiV-ElbajrI ",
  authDomain: "nerom-ba401.firebaseapp.com ",
  projectId: " nerom-ba401",
  storageBucket: "nerom-ba401.appspot.com",
  messagingSenderId: "58021672990",
  appId: "1:58021672990:web:1944349074709a9d87960f"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const grid = document.getElementById("grid");
let selecionados = [];

// GERAR NÚMEROS
for (let i = 1; i <= 100; i++) {
    let div = document.createElement("div");
    div.innerText = i;
    div.classList.add("numero");
    div.id = "num-" + i;

    div.onclick = () => selecionarNumero(i);

    grid.appendChild(div);
}

// SELEÇÃO
function selecionarNumero(num) {
    let el = document.getElementById("num-" + num);

    if (el.classList.contains("reservado")) return;

    el.classList.toggle("selecionado");

    if (selecionados.includes(num)) {
        selecionados = selecionados.filter(n => n !== num);
    } else {
        selecionados.push(num);
    }
}

// FIREBASE LISTENER TEMPO REAL
db.collection("rifa").onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        let num = change.doc.id;
        let el = document.getElementById("num-" + num);

        if (change.type === "added") {
            el.classList.add("reservado");
            el.classList.remove("selecionado");
        }

        if (change.type === "removed") {
            el.classList.remove("reservado");
        }
    });
});

// RESERVAR
function reservar() {
    let nome = document.getElementById("nome").value;

    if (!nome || selecionados.length === 0) {
        alert("Preencha nome e escolha números");
        return;
    }

    selecionados.forEach(num => {
        db.collection("rifa").doc(num.toString()).set({
            nome: nome,
            status: "pendente"
        });
    });

    let total = selecionados.length * 50;

    document.getElementById("pagamento").innerHTML = `
        <h3>Total: R$ ${total}</h3>
        <p>PIX: segatto800@gmail.com</p>
        <img src="QR_CODE_AQUI" width="200">
        <br><br>
        <a href="${gerarWhatsApp(nome, selecionados, total)}" target="_blank">
            <button>Enviar comprovante no WhatsApp</button>
        </a>
    `;

    selecionados = [];
}

// WHATSAPP
function gerarWhatsApp(nome, nums, total) {
    let msg = `Olá! Meu nome é ${nome}. Reservei os números: ${nums.join(", ")} na rifa solidária. O valor total deu R$ ${total}. Segue o meu comprovante Pix:`;
    return `https://wa.me/5527992625772?text=${encodeURIComponent(msg)}`;
}