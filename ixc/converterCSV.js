const fs = require('fs');
const readLine = require('readline');

async function lerCSV(caminho) {
    const arquivo = fs.createReadStream(caminho);
    const rl = readLine.createInterface({
        input: arquivo,
        crlfDelay: Infinity
    });

    const linhas = [];

    for await (const linha of rl) {
        linhas.push(linha);
    }

    return linhas;
}

async function main() {
    const linhas = await lerCSV('alunos.csv');
    const cabecalho = linhas[0].split(',');
    linhas.shift();

    const alunos = [];

    for (const linha of linhas) {
        const partes = linha.split(',');

        const aluno = {};

        for (let i = 0; i < cabecalho.length; i++) {
            aluno[cabecalho[i].trim()] = partes[i].trim();
        }

        let somaNota = 0;
        for (let i = 1; i < cabecalho.length; i++) {
            let propriedade = cabecalho[i].trim();
            aluno[propriedade] = Number(aluno[propriedade]);
            somaNota += aluno[propriedade];
        }

        aluno['media'] = somaNota / (partes.length - 1);
        if (aluno['media'] >= 6) {
            aluno['status'] = 'Aprovado';
        } else {
            aluno['status'] = 'Reprovado';
        }

        alunos.push(aluno);
    }

    fs.writeFileSync('alunos.json', JSON.stringify(alunos, null, 2));
    console.log('Arquivo JSON criado com sucesso!');
}

module.exports = { main, lerCSV };