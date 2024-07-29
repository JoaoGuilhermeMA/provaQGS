import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

let pedidos = [];
let rotas = [];

app.get('/pedidos', (req, res) => {
    res.json(pedidos);
});

app.post('/pedidos', (req, res) => {
    const { endereco, latitude, longitude, produto, quantidade } = req.body;
    const novoPedido = { endereco: { latitude, longitude }, produto, quantidade };
    pedidos.push(novoPedido);
    res.status(201).json(novoPedido);
});

app.get('/rotas', (req, res) => {
    res.json(rotas);
});

app.post('/rotas', (req, res) => {
    const { latitude, longitude } = req.body;
    const novaRota = { latitude, longitude };
    rotas.push(novaRota);
    res.status(201).json(novaRota);
});

app.post('/melhor-rota', (req, res) => {
    const { pedidos, rotas } = req.body;
    const melhorRota = verificarMelhorRota(pedidos, rotas);
    res.json(melhorRota);
});

function calcularDistancia(endereco1, endereco2) {
    return Math.sqrt(
        Math.pow(endereco2.latitude - endereco1.latitude, 2) +
        Math.pow(endereco2.longitude - endereco1.longitude, 2)
    );
}

function verificarMelhorRota(pedidos, rotas){
    let melhorRota= null;
    let menorDistancia = Infinity;

    rotas.forEach(rota => {
        let distanciaTotal = 0;

        pedidos.forEach(pedido => {
            distanciaTotal += calcularDistancia(pedido.endereco, rota);
        });

        if(distanciaTotal < menorDistancia){
            menorDistancia = distanciaTotal;
            melhorRota = rota;
        }
    });
    return melhorRota;
}

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

export { app, calcularDistancia, verificarMelhorRota }; // Exporta para testes
