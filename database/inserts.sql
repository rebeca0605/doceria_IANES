use db_doceria;

insert into tbl_usuarios (nome, email, senha) values
('Ricardo Alves', 'ricardo.alves@email.com', 'senhaRic123'),
('Beatriz Ramos', 'beatriz.ramos@email.com', 'bea@2026'),
('Fernando Lima', 'fernando.lima@email.com', 'fernanPadaria'),
('Juliana Mendes', 'juliana.mendes@email.com', 'july_mendes!'),
('Lucas Oliveira', 'lucas.oliveira@email.com', 'lucas_adm99');

insert into tbl_usuarios (nome, email, senha) values ('Admin', 'admin@gmail.com', 'admin123');

insert into tbl_produtos (nome, massa, recheio, cobertura, preco, tipo_porcao, quantidade, data_vencimento) values
('Pão de Mel', 'Especiarias', 'Doce de Leite', 'Chocolate Meio Amargo', 6.00, 'Unidade', 50, '2026-06-15'),
('Bolo de Limão', 'Limão', 'Nenhum', 'Glacê de Limão', 32.00, 'Unidade', 6, '2026-06-03'),
('Tortinha de Morango', 'Sablée', 'Creme de Confeiteiro', 'Geleia de Morango', 12.00, 'Unidade', 15, '2026-06-01'),
('Coxinha de Frango', 'Batata', 'Frango com Catupiry', 'Nenhuma', 7.50, 'Unidade', 40, '2026-05-31'),
('Bolo Marta Rocha', 'Pó de Ló / Merengue', 'Baba de Moça e Ameixa', 'Chantilly', 89.90, 'Kg', 4, '2026-06-04');

insert into tbl_historico_descarte (quantidade_descarte, fk_id_usuarios, fk_id_produtos) values
(5, 4, 7),  -- Ricardo Alves descartou 5 Tortinhas de Morango (venceram rápido)
(12, 5, 8), -- Beatriz Ramos descartou 12 Coxinhas de Frango (fim do expediente)
(1, 6, 9),  -- Fernando Lima descartou 1 Kg de Bolo Marta Rocha
(3, 7, 5),  -- Juliana Mendes descartou 3 Pães de Mel
(2, 8, 6);  -- Lucas Oliveira descartou 2 Bolos de Limão