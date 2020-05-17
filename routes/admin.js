const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")
require("../models/Categoria")
require("../models/Postagem")
const Categoria = mongoose.model("categorias")
const Postagem = mongoose.model("postagens")
const validaCamposCategoria = require("../control/validaCamposCategoria.js")
const validaCamposPostagem = require("../control/validaCamposPostagem.js")
const {eAdmin} = require("../helpers/eAdmin")

router.get("/", eAdmin, (req, res) => {
    res.render("admin/index")
})

// CATEGORIA

router.get("/categorias", eAdmin, (req, res) => {
    Categoria.find().sort({date: "desc"}).lean().then((categorias) => {
        res.render("admin/categorias", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias: " + err)
        res.redirect("/admin")
    })
})

router.get("/categorias/add", eAdmin, (req, res) => {
    res.render("admin/addcategorias")
})

router.post("/categorias/nova", eAdmin, (req, res) =>{
    var erros = validaCamposCategoria(req.body);

    if(erros.length > 0){
        res.render("admin/addcategorias", {erros: erros})
    }else{
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug,
        }
    
        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria criada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar a categoria, tente novamente!")
            res.redirect("/admin")
        })
    }
})

router.get("/categorias/edit/:id", eAdmin, (req, res) => {
    Categoria.findOne({_id: req.params.id}).lean().then((categoria) => {
        res.render("admin/editcategorias", {categoria: categoria})
    }).catch((err) => {
        req.flash("error_msg", "Esta categoria não existe!")
        res.redirect("/admin/categorias")
    })
})

router.post("/categorias/edit", eAdmin, (req, res) =>{
    var erros = validaCamposCategoria(req.body);

    if(erros.length > 0){
        req.flash("error_msg", "Erro! Algum campo está vazio ou com menos de 2 caracteres!")
        res.redirect("/admin/categorias/edit/" + req.body.id)
    }else{
        Categoria.findOne({_id: req.body.id}).then((categoria) => {
            
            categoria.nome = req.body.nome;
            categoria.slug = req.body.slug;

            categoria.save().then(() => {
                req.flash("success_msg", "Categoria editada com sucesso!")
                res.redirect("/admin/categorias")
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro interno ao salvar a edição da categoria!")
                res.redirect("/admin/categorias")
            })

        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao editar a categoria!")
            res.redirect("/admin/categorias")
        })
    }
})

router.post("/categorias/deletar", eAdmin, (req, res) => {
    Categoria.remove({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Categoria deletada com sucesso!")
        res.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar a categoria!")
        res.redirect("/admin/categorias")
    })
})

// POSTAGEM

router.get("/postagens", eAdmin, (req, res) => {
    Postagem.find().populate("categoria").sort({date: "desc"}).lean().then((postagens) => {
        res.render("admin/postagens", {postagens: postagens})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as postagens: " + err)
        res.redirect("/admin")
    })
})

router.get("/postagens/add", eAdmin, (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("admin/addpostagem", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulário")
        res.redirect("/admin")
    })
})

router.post("/postagens/nova", eAdmin, (req, res) => {
    var erros = validaCamposPostagem(req.body)
    
    if(erros.length > 0){
        Categoria.find().lean().then((categorias) =>{
            res.render("admin/addpostagem", {categorias, erros})
        })
    }else{
        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
        }

        new Postagem(novaPostagem).save().then(() => {
            req.flash("success_msg", "Postagem criada com sucesso!")
            res.redirect("/admin/postagens")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar a postagem, tente novamente!")
            res.redirect("/admin/postagens")
        })
    }
})

router.get("/postagens/edit/:id", eAdmin, (req, res) => {
    Postagem.findOne({_id: req.params.id}).lean().then((postagem) => {
        Categoria.find().lean().then((categorias) => {
            res.render("admin/editpostagens", {
                postagem: postagem,
                categorias: categorias
            })
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar as categorias")
            res.redirect("/admin/posatgens")
        })
    }).catch((err) => {
        req.flash("error_msg", "Esta postagem não existe!")
        res.redirect("/admin/postagens")
    })
})

router.post("/postagem/edit", eAdmin, (req, res) => {
    var erros = validaCamposPostagem(req.body)

    if(erros.length > 0){
        req.flash("error_msg", "Erro! Algum campo está vazio ou com menos de 2 caracteres!")
        res.redirect("/admin/postagens/edit/" + req.body.id)   
    }else{
        Postagem.findOne({_id: req.body.id}).then((postagem) => {
            postagem.titulo = req.body.titulo
            postagem.descricao = req.body.descricao
            postagem.slug = req.body.slug
            postagem.conteudo = req.body.conteudo
            postagem.categoria = req.body.categoria
    
            postagem.save().then(() => {
                req.flash("success_msg", "Postagem editada com sucesso!")
                res.redirect("/admin/postagens")
            }).catch((err) => {
                req.flash("error_msg", "Erro interno")
                res.redirect("/admin/postagens")
            })
        }).catch((err) => {
            console.log(err)
            req.flash("error_msg", "Houve um erro ao salvar a edição")
            res.redirect("/admin/postagens")
        })
    }
})

router.post("/postagens/deletar", eAdmin, (req, res) => {
    Postagem.remove({_id: req.body.id}).then(() => {
        req.flash("success_msg", "Postagem deletada com sucesso!")
        res.redirect("/admin/postagens")
    }).catch((err) => {
        req.flash("error_msg", "Ocorreu um erro ao deletar a posatgem!")
        res.redirect("/admin/postagens")
    })
})

module.exports = router;