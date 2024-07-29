import { should, use } from 'chai';
import chaiHttp from 'chai-http';
import { app, calcularDistancia, verificarMelhorRota } from './index.js';

should();
use(chaiHttp);

describe('API Tests', () => {
    it('GET /pedidos - deve retornar a lista de pedidos', (done) => {
        chai.request(app)
            .get('/pedidos')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });

    it('POST /pedidos - deve criar um novo pedido', (done) => {
        const pedido = {
            endereco: { latitude: 1, longitude: 1 },
            produto: 'Produto 1',
            quantidade: 2
        };
        chai.request(app)
            .post('/pedidos')
            .send(pedido)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('endereco');
                res.body.should.have.property('produto').eql('Produto 1');
                res.body.should.have.property('quantidade').eql(2);
                done();
            });
    });

    it('GET /rotas - deve retornar a lista de rotas', (done) => {
        chai.request(app)
            .get('/rotas')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });

    it('POST /rotas - deve criar uma nova rota', (done) => {
        const rota = { latitude: 1, longitude: 1 };
        chai.request(app)
            .post('/rotas')
            .send(rota)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('latitude').eql(1);
                res.body.should.have.property('longitude').eql(1);
                done();
            });
    });

    it('POST /melhor-rota - deve retornar a melhor rota de entrega', (done) => {
        const pedidos = [
            { endereco: { latitude: 0, longitude: 0 } },
            { endereco: { latitude: 1, longitude: 1 } }
        ];
        const rotas = [
            { latitude: 0, longitude: 1 },
            { latitude: 1, longitude: 0 }
        ];
        chai.request(app)
            .post('/melhor-rota')
            .send({ pedidos, rotas })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('latitude').eql(1);
                res.body.should.have.property('longitude').eql(0);
                done();
            });
    });
});

// Testando funções utilitárias
describe('Funções Utilitárias', () => {
    it('calcularDistancia - deve calcular a distância corretamente', () => {
        const endereco1 = { latitude: 0, longitude: 0 };
        const endereco2 = { latitude: 3, longitude: 4 };
        const distancia = calcularDistancia(endereco1, endereco2);
        distancia.should.equal(5);
    });

    it('verificarMelhorRota - deve retornar a melhor rota', () => {
        const pedidos = [
            { endereco: { latitude: 0, longitude: 0 } },
            { endereco: { latitude: 1, longitude: 1 } }
        ];
        const rotas = [
            { latitude: 0, longitude: 1 },
            { latitude: 1, longitude: 0 }
        ];
        const melhorRota = verificarMelhorRota(pedidos, rotas);
        melhorRota.should.deep.equal({ latitude: 1, longitude: 0 });
    });
});
