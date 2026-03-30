const firebaseConfig = {
  apiKey: "SUA_KEY",
  authDomain: "SUA_URL",
  projectId: "SEU_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const lista = document.getElementById("lista");

db.collection("rifa").onSnapshot(snapshot => {
    lista.innerHTML = "";

    snapshot.forEach(doc => {
        let data = doc.data();

        let div = document.createElement("div");
        div.innerHTML = `
            Número: ${doc.id} | Nome: ${data.nome}
            <button onclick="liberar('${doc.id}')">Liberar</button>
        `;

        lista.appendChild(div);
    });
});

function liberar(num) {
    db.collection("rifa").doc(num).delete();
}