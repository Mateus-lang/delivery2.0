--INIT#obterDadosCompletos#

SELECT 
    nome,
    cep,
    endereco,
    numero,
    bairro,
    complemento,
    cidade,
    estado, 
    logotipo,
    sobre 
FROM 
    empresa 

--END#obterDadosCompletos#

--INIT#salvarDadosSobre#

UPDATE
    empresa
SET
    nome = @nome,
    sobre = @sobre
WHERE
    idempresa = @idempresa
--END#salvarDadosSobre#