create database db_doceria;
use db_doceria;

create table tbl_usuarios(
	id_usuarios int auto_increment primary key,
    nome varchar(100) not null,
    email varchar(250) not null,
    senha varchar(255) not null
);

create table tbl_produtos(
	id_produtos int auto_increment primary key,
    nome varchar(100) not null,
    massa varchar(50) null,
    recheio varchar(100) null,
    cobertura varchar(100) null,
    preco decimal(10, 2) null,
    tipo_porcao varchar(20) not null,
    quantidade int not null,
    data_vencimento date not null
);

create table tbl_historico_descarte(
	id int auto_increment primary key,
    quantidade_descarte int not null,
    fk_id_usuarios int,
    fk_id_produtos int
);