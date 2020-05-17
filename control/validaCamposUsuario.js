var verifica = function validaCamposUsuario(dados){
    var erros = []
    
    if(!dados.nome || typeof dados.nome == undefined || dados.nome == null){
        erros.push({texto: "Nome inválido"})
    }
    if(dados.nome.length < 2){
        erros.push({texto: "Nome muito curto! Nome deve conter pelo menos 2 caracteres"})
    }
    if(dados.email.length < 6){
        erros.push({texto: "Email inválido"})
    }
    if(!dados.email || typeof dados.email == undefined || dados.email == null){
        erros.push({texto: "Email inválido"})
    }
    if(!dados.senha || typeof dados.senha == undefined || dados.senha == null){
        erros.push({texto: "Senha inválida"})
    }
    if(dados.senha.length < 6){
        erros.push({texto: "Senha muito curta, ela dever conter no mínimo 6 caracteres"})
    }
    if(dados.senha != dados.senha2){
        erros.push({texto: "As senhas são diferentes, tente novamente!"})
    }
    return erros
}

module.exports = verifica