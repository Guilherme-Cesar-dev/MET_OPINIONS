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

async function tratarDados(dadoOBJ) {

// id = dadoOBJ.objectID ;
// image = dadoOBJ.primaryImage ;
// nome = dadoOBJ.title ; 
// descricao = dadoOBJ.description ; 
// artista = dadoOBJ.artistDisplayName ; 
// tamanho = dadoOBJ.dimensions ; 
// data = dadoOBJ.objectBeginDate ; 
// departamento = dadoOBJ.department ; 


    if(!dadoOBJ.description) dadoOBJ.description = "Sem descrição";
    if(!dadoOBJ.artistDisplayName) dadoOBJ.artistDisplayName = "Não identificado";

    // Seleciona o elemento container
    const container = document.getElementById('left');

    // Adiciona HTML dentro do container
    container.innerHTML = `
    <div id="obj-div">
        <p>${dadoOBJ.objectID}</p>
        <image id="imagem" src="${dadoOBJ.primaryImage}" alt="${dadoOBJ.title}">
        <p>${dadoOBJ.title}</p>
        <p>${dadoOBJ.description}</p>
        <p>${dadoOBJ.artistDisplayName}</p>
        <p>${dadoOBJ.objectBeginDate}</p>
    </div>
    `;

    const avaliar = document.getElementById('right');

    avaliar.innerHTML = `
    <div id="avaliar-div" style="background-color: red;">
        <p>${dadoOBJ.objectID}</p>
    </div>
    <br/>
    <br/>
    <br/>
    `;

}


//  const url = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${Number}`;


async function kayney() {
        try {
            const kaneUrl = `https://api.kanye.rest/`;

            const resposta = await fetch(kaneUrl);
            if (!resposta.ok) {
                throw new Error(`Erro HTTP: ${resposta.status}`);
            }
            const kane = await resposta.json();
            console.log({ kane });
            await tratarkane(kane);
            
        } catch (erro) {
            console.error('Erro ao consumir o OBJ:', erro);
        }
}


async function tratarkane(kane) {
    console.log({ quote: kane.quote });

    
    // Seleciona o elemento container
    const container = document.getElementById('back');

    // Adiciona HTML dentro do container
    container.innerHTML = `
    <div id="obj-div">
        <p>${kane.quote}, Kanye West</p>
    </div>
    `;

}

kayney();