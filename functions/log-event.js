exports.handler = async (event) => { const data = JSON.parse(event.body); console.log("Evento registrado:", data.msg); return { statusCode: 200, body: JSON.stringify({status:"ok"}) }; };
