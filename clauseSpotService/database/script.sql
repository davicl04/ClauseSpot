CREATE SCHEMA parametros;

CREATE SCHEMA usuarios;

CREATE SCHEMA prontobook;

CREATE TABLE parametros.Municipios(
   id_municipio INT IDENTITY(1, 1) PRIMARY KEY,
   codigo INT NOT NULL UNIQUE,
   nome VARCHAR(150) NOT NULL,
   uf CHAR(5) NOT NULL,
   FOREIGN KEY (uf) REFERENCES parametros.Estados(uf)
);

CREATE TABLE parametros.Estados(
   id_estado INT IDENTITY(1, 1) PRIMARY KEY,
   nome_estado VARCHAR(150) NOT NULL UNIQUE,
   uf CHAR(5) NOT NULL UNIQUE
);


CREATE TABLE usuarios.casbin_rule(
   id INT IDENTITY(1, 1) PRIMARY KEY,
   ptype VARCHAR(255) NOT NULL,
   v0 VARCHAR(MAX) NOT NULL,
   v1 VARCHAR(MAX) NOT NULL,
   v2 VARCHAR(MAX) NOT NULL,
   v3 VARCHAR(MAX) NOT NULL,
   v4 VARCHAR(MAX) NULL,
   v5 VARCHAR(MAX) NULL
);


CREATE TABLE parametros.Parametricas(
   "_estado" varchar(30) NOT NULL,
   "_transaccion" varchar(30) NOT NULL,
   "_usuario_criacao" int NOT NULL,
   "_data_criacao" datetime NOT NULL DEFAULT GETDATE(),
   "_usuario_modificacao" int NULL,
   "_data_modificacao" datetime NULL ,
   id_parametrica INT IDENTITY(1, 1) PRIMARY KEY,
   codigo VARCHAR(15) NOT NULL,
   nome VARCHAR(50) NOT NULL,
   grupo VARCHAR(15) NOT NULL,
   descricao VARCHAR(255) NOT NULL,
   CHECK (
      "_estado" IN ('ATIVO', 'INATIVO', 'CRIADO', 'PENDENTE')
   )
);

CREATE TABLE usuarios.Pessoas (
   "_estado" varchar(30) NOT NULL,
   "_transaccion" varchar(30) NOT NULL,
   "_usuario_criacao" int NOT NULL,
   "_data_criacao" datetime NOT NULL DEFAULT GETDATE(),
   "_usuario_modificacao" int NULL,
   "_data_modificacao" datetime NULL,
   id_pessoa INT IDENTITY(1, 1) PRIMARY KEY,
   nomes VARCHAR(150) NOT NULL,
   sobrenome VARCHAR(100) NOT NULL,
   data_nascimento DATE NOT NULL,
   cpf VARCHAR(11) UNIQUE NOT NULL,
   telefono VARCHAR(11),
   rg VARCHAR(11) UNIQUE NOT NULL,
   genero CHAR(2) NOT NULL,
   fk_municipio INT NOT NULL,
   FOREIGN KEY (fk_municipio) REFERENCES parametros.Municipios(id_municipio),
   CHECK (
      "_estado" IN ('ATIVO', 'INATIVO', 'CRIADO', 'PENDENTE')
   ),
   CHECK (
      "genero" IN ('M', 'F')
   )
);

CREATE TABLE usuarios.Usuarios(
   "_estado" varchar(30) NOT NULL,
   "_transaccion" varchar(30) NOT NULL,
   "_usuario_criacao" int NOT NULL,
   "_data_criacao" datetime NOT NULL DEFAULT GETDATE(),
   "_usuario_modificacao" int NULL,
   "_data_modificacao" datetime NULL ,
   id_usuario INT IDENTITY(1, 1) PRIMARY KEY,
   usuario VARCHAR(150) UNIQUE NOT NULL,
   senha VARCHAR(100) NOT NULL,
   fk_pessoa INT UNIQUE NOT NULL ,
   FOREIGN KEY (fk_pessoa) REFERENCES usuarios.Pessoas(id_pessoa),
   CHECK (
      "_estado" IN ('ATIVO', 'INATIVO', 'CRIADO', 'PENDENTE')
   )
);

CREATE TABLE usuarios.Perfis(
   "_estado" varchar(30) NOT NULL,
   "_transaccion" varchar(30) NOT NULL,
   "_usuario_criacao" int NOT NULL,
   "_data_criacao" datetime NOT NULL DEFAULT GETDATE(),
   "_usuario_modificacao" int NULL,
   "_data_modificacao" datetime NULL ,
   id_perfil INT IDENTITY(1, 1) PRIMARY KEY,
   nome VARCHAR(150) NOT NULL UNIQUE,
   slug CHAR(4) NOT NULL UNIQUE,
   CHECK (
      "_estado" IN ('ATIVO', 'INATIVO', 'CRIADO', 'PENDENTE')
   )
);

CREATE TABLE usuarios.usuario_perfis(
   "_estado" varchar(30) NOT NULL,
   "_transaccion" varchar(30) NOT NULL,
   "_usuario_criacao" int NOT NULL,
   "_data_criacao" datetime NOT NULL DEFAULT GETDATE(),
   "_usuario_modificacao" int NULL,
   "_data_modificacao" datetime NULL,
   id_usuario_perfil INT IDENTITY(1, 1),
   data_inicio DATETIME,
   fk_usuario INT NOT NULL,
   fk_perfil INT NOT NULL,
   PRIMARY KEY (id_usuario_perfil,fk_usuario,fk_perfil),
   FOREIGN KEY (fk_usuario) REFERENCES usuarios.Usuarios(id_usuario),
   FOREIGN KEY (fk_perfil) REFERENCES usuarios.Perfis(id_perfil),
   CHECK (
      "_estado" IN ('ATIVO', 'INATIVO', 'CRIADO', 'PENDENTE')
   )
);

CREATE TABLE usuarios.Modulos(
   "_estado" varchar(30) NOT NULL,
   "_transaccion" varchar(30) NOT NULL,
   "_usuario_criacao" int NOT NULL,
   "_data_criacao" datetime NOT NULL DEFAULT GETDATE(),
   "_usuario_modificacao" int NULL,
   "_data_modificacao" datetime NULL,
   id_modulo INT IDENTITY(1, 1) PRIMARY KEY,
   url VARCHAR(50) NOT NULL,
   nome VARCHAR(50) NOT NULL,
   label VARCHAR(50) NOT NULL,
   propiedades NVARCHAR(MAX) NOT NULL,
   fk_modulo INT,
   FOREIGN KEY (fk_modulo) REFERENCES usuarios.Modulos(id_modulo),
   CHECK (
      "_estado" IN ('ATIVO', 'INATIVO', 'CRIADO', 'PENDENTE')
   )
);


CREATE TABLE prontobook.Pacientes(
   "_estado" varchar(30) NOT NULL,
   "_transaccion" varchar(30) NOT NULL,
   "_usuario_criacao" int NOT NULL,
   "_data_criacao" datetime NOT NULL DEFAULT GETDATE(),
   "_usuario_modificacao" int NULL,
   "_data_modificacao" datetime NULL ,
   id_paciente INT IDENTITY(1, 1) PRIMARY KEY,
   cartao_sus VARCHAR(20) NOT NULL UNIQUE,
   altura DECIMAL(5,2) ,
   peso DECIMAL(5,2),
   tipo_sangue CHAR(5),
   fk_pessoa INT NOT NULL UNIQUE,
   FOREIGN KEY (fk_pessoa) REFERENCES usuarios.Pessoas(id_pessoa),
   CHECK (
      "_estado" IN ('ATIVO', 'INATIVO', 'CRIADO', 'PENDENTE')
   )
);

CREATE TABLE prontobook.Especialidades(
   "_estado" varchar(30) NOT NULL,
   "_transaccion" varchar(30) NOT NULL,
   "_usuario_criacao" int NOT NULL,
   "_data_criacao" datetime NOT NULL DEFAULT GETDATE(),
   "_usuario_modificacao" int NULL,
   "_data_modificacao" datetime NULL ,
   id_especialidade INT IDENTITY(1, 1) PRIMARY KEY,
   nome VARCHAR(150) NOT NULL UNIQUE,
   slug CHAR(5) UNIQUE,
   CHECK (
      "_estado" IN ('ATIVO', 'INATIVO', 'CRIADO', 'PENDENTE')
   )
);

CREATE TABLE prontobook.Medicos(
   "_estado" varchar(30) NOT NULL,
   "_transaccion" varchar(30) NOT NULL,
   "_usuario_criacao" int NOT NULL,
   "_data_criacao" datetime NOT NULL DEFAULT GETDATE(),
   "_usuario_modificacao" int NULL,
   "_data_modificacao" datetime NULL ,
   id_medico INT IDENTITY(1, 1) PRIMARY KEY,
   crm VARCHAR(50) NOT NULL UNIQUE,
   fk_pessoa INT NOT NULL UNIQUE,
   FOREIGN KEY (fk_pessoa) REFERENCES usuarios.Pessoas(id_pessoa),
   CHECK (
      "_estado" IN ('ATIVO', 'INATIVO', 'CRIADO', 'PENDENTE')
   )
);

CREATE TABLE prontobook.Agravantes(
   "_estado" varchar(30) NOT NULL,
   "_transaccion" varchar(30) NOT NULL,
   "_usuario_criacao" int NOT NULL,
   "_data_criacao" datetime NOT NULL DEFAULT GETDATE(),
   "_usuario_modificacao" int NULL,
   "_data_modificacao" datetime NULL ,
   id_agravante INT IDENTITY(1, 1) PRIMARY KEY,
   nome_agravante VARCHAR(255) NOT NULL,
   valor_agravante VARCHAR(255),
   descricao TEXT,
   fk_paciente INT NOT NULL,
   FOREIGN KEY (fk_paciente) REFERENCES prontobook.Pacientes(id_paciente),
   CHECK (
      "_estado" IN ('ATIVO', 'INATIVO', 'CRIADO', 'PENDENTE')
   )
);

CREATE TABLE prontobook.medico_especialidade(
   "_estado" varchar(30) NOT NULL,
   "_transaccion" varchar(30) NOT NULL,
   "_usuario_criacao" int NOT NULL,
   "_data_criacao" datetime NOT NULL DEFAULT GETDATE(),
   "_usuario_modificacao" int NULL,
   "_data_modificacao" datetime NULL ,
   fk_medico INT NOT NULL,
   fk_especialidade INT NOT NULL,
   PRIMARY KEY (fk_medico,fk_especialidade),
   FOREIGN KEY (fk_medico) REFERENCES prontobook.Medicos(id_medico),
   FOREIGN KEY (fk_especialidade) REFERENCES prontobook.Especialidades(id_especialidade),
   CHECK (
      "_estado" IN ('ATIVO', 'INATIVO', 'CRIADO', 'PENDENTE')
   )
);

CREATE TABLE prontobook.Agendamentos(
   "_estado" varchar(30) NOT NULL,
   "_transaccion" varchar(30) NOT NULL,
   "_usuario_criacao" int NOT NULL,
   "_data_criacao" datetime NOT NULL DEFAULT GETDATE(),
   "_usuario_modificacao" int NULL,
   "_data_modificacao" datetime NULL ,
   id_agendamento INT IDENTITY(1, 1) PRIMARY KEY,
   inicio_agendamento DATETIME NOT NULL,
   fim_agendamento DATETIME NOT NULL,
   observacoes TEXT, 
   fk_medico INT,
   fk_paciente INT NOT NULL,
   fk_agendamento INT,
   FOREIGN KEY (fk_medico) REFERENCES prontobook.Medicos(id_medico),
   FOREIGN KEY (fk_paciente) REFERENCES prontobook.Pacientes(id_paciente),
   FOREIGN KEY (fk_agendamento) REFERENCES prontobook.Agendamentos(id_agendamento),
   CHECK (
      "_estado" IN ('ATIVO', 'INATIVO', 'CRIADO', 'PENDENTE','CANCELADO')
   )
);

CREATE TABLE prontobook.Prontuarios(
   "_estado" varchar(30) NOT NULL,
   "_transaccion" varchar(30) NOT NULL,
   "_usuario_criacao" int NOT NULL,
   "_data_criacao" datetime NOT NULL DEFAULT GETDATE(),
   "_usuario_modificacao" int NULL,
   "_data_modificacao" datetime NULL ,
   id_prontuario INT IDENTITY(1, 1) PRIMARY KEY,
   atendido_por VARCHAR(150) NOT NULL,
   sintomas TEXT,
   estado_paciente TEXT,
   orientacoes TEXT,
   retorno TEXT,
   ministrou_medicacao BIT DEFAULT 0,
   medicamentos_administrados TEXT,
   receitou_medicacao BIT DEFAULT 0,
   precricoes TEXT,
   realizou_exames BIT DEFAULT 0,
   conclusao TEXT,
   fk_medico INT NOT NULL,
   fk_agendamento INT ,
   FOREIGN KEY (fk_medico) REFERENCES prontobook.Medicos(id_medico),
   FOREIGN KEY (fk_agendamento) REFERENCES prontobook.Agendamentos(id_agendamento),
   CHECK (
      "_estado" IN ('ATIVO', 'INATIVO', 'CRIADO', 'PENDENTE')
   )
);

CREATE TABLE prontobook.Posto(
   "_estado" varchar(30) NOT NULL,
   "_transaccion" varchar(30) NOT NULL,
   "_usuario_criacao" int NOT NULL,
   "_data_criacao" datetime NOT NULL DEFAULT GETDATE(),
   "_usuario_modificacao" int NULL,
   "_data_modificacao" datetime NULL ,
   id_posto INT IDENTITY(1, 1) PRIMARY KEY,
   uf CHAR(5) NOT NULL,
   cep VARCHAR(11) NOT NULL UNIQUE,
   cidade VARCHAR(70) NOT NULL,
   bairro VARCHAR(150) ,
   endereco VARCHAR(100) NOT NULL,
   complemento VARCHAR(100) ,
   CHECK (
      "_estado" IN ('ATIVO', 'INATIVO', 'CRIADO', 'PENDENTE')
   )
);

CREATE TABLE prontobook.Atendentes(
   "_estado" varchar(30) NOT NULL,
   "_transaccion" varchar(30) NOT NULL,
   "_usuario_criacao" int NOT NULL,
   "_data_criacao" datetime NOT NULL DEFAULT GETDATE(),
   "_usuario_modificacao" int NULL,
   "_data_modificacao" datetime NULL ,
   id_atendente INT IDENTITY(1, 1) PRIMARY KEY,
   dia_atencao VARCHAR(100) NOT NULL,
   hora_abertura_amanha TIME,
   hora_fechamento_amanha TIME,
   hora_abertura_tarde TIME,
   hora_fechamento_tarde TIME,
   fk_posto INT NOT NULL,
   fk_usuario INT NOT NULL,
   FOREIGN KEY (fk_posto) REFERENCES prontobook.Posto(id_posto),
   FOREIGN KEY (fk_usuario) REFERENCES usuarios.Usuarios(id_usuario),
   CHECK (
      "_estado" IN ('ATIVO', 'INATIVO', 'CRIADO', 'PENDENTE')
   )
 );

CREATE TABLE prontobook.Triagem(
   "_estado" varchar(30) NOT NULL,
   "_transaccion" varchar(30) NOT NULL,
   "_usuario_criacao" int NOT NULL,
   "_data_criacao" datetime NOT NULL DEFAULT GETDATE(),
   "_usuario_modificacao" int NULL,
   "_data_modificacao" datetime NULL ,
   id_triagem INT IDENTITY(1, 1) PRIMARY KEY,
   prioridade VARCHAR(11) NOT NULL UNIQUE,
   sintomas_atuais VARCHAR(70) NOT NULL,
   gravidade_situacao VARCHAR(150) ,
   fk_paciente INT NOT NULL,
   fk_atendente INT ,
   FOREIGN KEY (fk_paciente) REFERENCES prontobook.Pacientes(id_paciente),
   FOREIGN KEY (fk_atendente) REFERENCES prontobook.Atendentes(id_atendente),
   CHECK (
      "_estado" IN ('ATIVO', 'INATIVO', 'CRIADO', 'PENDENTE')
   ),
);