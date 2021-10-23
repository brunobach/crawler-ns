const axios = require('axios')
const cheerio = require('cheerio');
const fs = require('fs');
const _env = require('../env.json')

module.exports = {
    index() {
        axios.get(_env.URL_SERVICE, { headers: { 'cookie': _env.COOKIE_AUTH } })
            .then(({ data }) => {

                const $ = cheerio.load(data)
                const problemsArray = []
                const problemsLength = $('#page > div > div:nth-child(2) > table > tbody > tr > td.tab_bg_2.b').text().split('de ')[1]

                /**
                 * Laço "i" percorre o eixo Y da tabela, 
                 * caputrando linha a linha, enquanto laço "j" percorre o eixo X capturando as colunas
                 */

                for (let i = 1; i <= problemsLength; i++) {
                    const problemsObject = {}
                    for (let j = 0; j <= 17; j++) {
                        switch (j) {
                            case 2:
                                problemsObject["Chamado"] = $(`#massformTicket > div > table > tbody > tr:nth-child(${i}) > td:nth-child(${j})`).text().replace(/\s/g, '')
                                break;
                            case 3:
                                $(`#massformTicket > div > table > tbody > tr:nth-child(${i}) > td:nth-child(${j}) > a`).each((i, el) => {
                                    problemsObject["Titulo"] = $(el).text()
                                })
                                break;
                            case 5:
                                problemsObject["Criacao"] = $(`#massformTicket > div > table > tbody > tr:nth-child(${i}) > td:nth-child(${j})`).text()
                                break;
                            case 13:
                                problemsObject["Atualizacao"] = $(`#massformTicket > div > table > tbody > tr:nth-child(${i}) > td:nth-child(${j})`).text()
                                break;
                            case 14:
                                problemsObject["Solicitante"] = $(`#massformTicket > div > table > tbody > tr:nth-child(${i}) > td:nth-child(${j})`).text()
                                break;
                            case 17:
                                problemsObject["Descricao"] = $(`#massformTicket > div > table > tbody > tr:nth-child(${i}) > td:nth-child(${j})`).text().split('\n').join().split('Atenciosamente')[0]
                                problemsObject["link"] = _env.URL_PROBLEM + problemsObject.Chamado
                                break;
                            default:
                                break;
                        }

                    }
                    problemsArray.push(problemsObject)
                }
                fs.writeFileSync('output.json', JSON.stringify(problemsArray, null, 4))
                console.log("File written successfully, bye!");

            })
    }
}
