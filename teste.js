let index = 0;
let indexmax = 8;

async function searchOBJ() {
    const listUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects`;
        try {
            const listaRes = await fetch(listUrl);
            if (!listaRes.ok) throw new Error(`Erro HTTP: ${listaRes.status}`);
            const listaDados = await listaRes.json();
            const ids = listaDados.objectIDs;
            if (!ids || ids.length === 0) throw new Error('Nenhum objectID disponível');

            const randomIndex = Math.floor(Math.random() * ids.length);
            const chosenId = ids[randomIndex];
            const urlOBJ = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${chosenId}`;

            const resposta = await fetch(urlOBJ);
            if (!resposta.ok) {
                throw new Error(`Erro HTTP: ${resposta.status}`);
            }
            const dadoOBJ = await resposta.json();
            console.log({ chosenId, }); //dadoOBJ });

            if(!dadoOBJ || !dadoOBJ.primaryImage) {
                console.warn('Objeto sem imagem, buscando outro...');
                return searchOBJ(); // Tenta novamente se o objeto não tiver imagem
            }  
        
            await tratarDados(dadoOBJ);
            
        } catch (erro) {
            console.error('Erro ao consumir o OBJ:', erro);
        }
}

while (index < indexmax) {
    searchOBJ();
    index++;
}

async function tratarDados(dadoOBJ) {
    let image = dadoOBJ.primaryImage ;
//    let nome = dadoOBJ.title ; 
//    let descricao = dadoOBJ.description ; 
//    let artista = dadoOBJ.artistDisplayName ; 
//    let tamanho = dadoOBJ.dimensions ; 
//    let data = dadoOBJ.objectBeginDate ; 
//    let departamento = dadoOBJ.department ; 
    
//    if(!descricao) descricao = "Sem descrição";
//    if(!artista) artista = "Não identificado";

    console.log({image}); //, nome, descricao, artista, tamanho, data, departamento });
    console.log(`Index: ${index}`);
}


//  const url = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${Number}`;
