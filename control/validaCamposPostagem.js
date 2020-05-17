var verifica = function validaCamposPostagem(dados){
    var erros = []
    
    if(dados.categoria == "0"){
        erros.push({texto: "Não é possível criar uma postagem sem categoria! Crie uma."})
    }
    if(!dados.titulo || typeof dados.titulo == undefined || dados.titulo == null){
        erros.push({texto: "Título inválido!"})
    }
    if(dados.titulo.length < 2){
        erros.push({texto: "Título muito pequeno!"})
    }
    if(!dados.slug || typeof dados.slug == undefined || dados.slug == null){
        erros.push({texto: "Slug inválido!"})
    }
    if(dados.slug.length < 2){
        erros.push({texto: "Slug muito pequeno!"})
    }
    if(!dados.descricao || typeof dados.descricao == undefined || dados.descricao == null){
        erros.push({texto: "Descrição inválida!"})
    }
    if(dados.descricao.length < 2){
        erros.push({texto: "Descrição muito pequena!"})
    }
    if(!dados.conteudo || typeof dados.conteudo == undefined || dados.conteudo == null){
        erros.push({texto: "Conteúdo inválido!"})
    }
    if(dados.conteudo.length < 2){
        erros.push({texto: "Conteúdo muito pequeno!"})
    }
    return erros
}

module.exports = verifica