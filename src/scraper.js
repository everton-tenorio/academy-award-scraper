import fs from 'fs';
import axios from 'axios';
import * as cheerio from 'cheerio';

(async () => {
  const url = 'https://en.wikipedia.org/wiki/List_of_Academy_Award%E2%80%93winning_films';
  let headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
  }
  const { data: html } = await axios.get(url, headers = headers);
  const $ = cheerio.load(html); 
  
  const theadData = [];
  const tableData = [];

  $('tbody').each((i, column) => { 
    const columnData = [];
    $(column).find('th').each((j, cell) => {
      columnData.push($(cell).text().replace('\n',''));
    });
    theadData.push(columnData)
  }) 

  tableData.push(theadData[0]) 

  $('table tr').each((i, row) => {
    const rowData = []; 
    $(row)
      .find('td')
      .each((j, cell) => {
        rowData.push($(cell).text().trim());
      });
    
    if (rowData.length) tableData.push(rowData) // Evita linhas vazias
  })

  // Converte os dados para CSV
  const csvContent = tableData
    .map((row) => row.join(';')) // Junta os elementos da linha com ";"
    .join('\n'); // Junta as linhas com quebras de linha

  // Salva em um arquivo
  fs.writeFileSync('academy_awards.csv', csvContent, 'utf-8');
  console.log('Dados salvos no arquivo "academy_awards.csv".');

})();