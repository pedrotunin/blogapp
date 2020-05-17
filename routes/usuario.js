const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Usuario")
require("../models/Categoria")
require("../models/Postagem")
const Categoria = mongoose.model("categorias")
const Postagem = mongoose.model("postagens")
const Usuario = mongoose.model("usuarios")
const validaCamposUsuario = require("../control/validaCamposUsuario")
const validaCamposPostagem = require("../control/validaCamposPostagem")
const bcrypt = require("bcryptjs")
const passport = require("passport")
const {usuarioLogado} = require("../helpers/usuarioLogado")

router.get("/registro", (req, res) => {
    res.render("usuarios/registro")
})

router.post("/registro", (req, res) => {
    var erros = validaCamposUsuario(req.body)

    if(erros.length > 0){
        res.render("usuarios/registro", {erros: erros})
    }else{
        Usuario.findOne({email: req.body.email}).then((usuario) => {
            if(usuario){
                req.flash("error_msg", "Já existe uma conta com este email cadastrada!")
                res.redirect("/usuarios/registro")
            }else{ 
                var novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) =>{
                        if(erro){
                            req.flash("error_msg", "Houve um erro durante o salvamento do usuário")
                            res.redirect("/")
                        }else{                            
                            novoUsuario.senha = hash

                            novoUsuario.save().then(() => {
                                req.flash("success_msg", "Usuário criado com sucesso!")
                                res.redirect("/usuarios/login")
                            }).catch((err) => {
                                req.flash("error_msg", "Houve um erro ao criar o usuário, tente novamente!")
                                res.redirect("/usuarios/registro")
                            })
                        }
                    })
                })

            }
        }).catch((err) => {
            console.log(err)
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/")
        })
    }
})

router.get("/postagens/add", usuarioLogado, (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("usuarios/addpostagem", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulário!")
        res.redirect("/")
    })
})

router.post("/postagens/nova", usuarioLogado, (req, res) => {
    var erros = validaCamposPostagem(req.body)

    if(erros.length > 0) {
            Categoria.find().lean().then((categorias) => {
                res.render("usuarios/addpostagem", {categorias: categorias})
            })
    }else {
        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria 
        }

        new Postagem(novaPostagem).save().then(() => {
            req.flash("success_msg", "Postagem criada com sucesso!")
            res.redirect("/")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar a postagem, tente novamente!")
            res.redirect("/")
        })
    }
})

router.get("/login", (req, res) => {
    res.render("usuarios/login")
})

router.post("/login", (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/usuarios/login",
        failureFlash: true
    })(req, res, next)
})

router.get("/logout", (req, res) => {
    req.logout()
    req.flash("success_msg", "Deslogado com sucesso!")
    res.redirect("/")
})

module.exports = router