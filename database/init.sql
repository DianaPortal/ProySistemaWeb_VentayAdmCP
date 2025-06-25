
IF DB_ID('BDDERMACORE') IS NULL
    CREATE DATABASE BDDERMACORE;
GO


use BDDERMACORE

go

create table Rol(
idRol int primary key identity(1,1),
nombre varchar(50),
fechaRegistro datetime default getdate()
)

go

create table Menu(
idMenu int primary key identity(1,1),
nombre varchar(50),
icono varchar(50),
url varchar(50)
)

go

create table MenuRol(
idMenuRol int primary key identity(1,1),
idMenu int references Menu(idMenu),
idRol int references Rol(idRol)
)

go


create table Usuario(
idUsuario int primary key identity(1,1),
nombreCompleto varchar(100),
correo varchar(40),
idRol int references Rol(idRol),
clave varchar(40),
esActivo bit default 1,
fechaRegistro datetime default getdate()
)

go

create table Categoria(
idCategoria int primary key identity(1,1),
nombre varchar(50),
esActivo bit default 1,
fechaRegistro datetime default getdate()
)

go

create table Producto (
idProducto int primary key identity(1,1),
nombre varchar(100),
idCategoria int references Categoria(idCategoria),
stock int,
precio decimal(10,2),
esActivo bit default 1,
fechaRegistro datetime default getdate()
)

go

create table NumeroDocumento(
idNumeroDocumento int primary key identity(1,1),
ultimo_Numero int not null,
fechaRegistro datetime default getdate()
)
go

create table Venta(
idVenta int primary key identity(1,1),
numeroDocumento varchar(40),
tipoPago varchar(50),
total decimal(10,2),
fechaRegistro datetime default getdate()
)
go

create table DetalleVenta(
idDetalleVenta int primary key identity(1,1),
idVenta int references Venta(idVenta),
idProducto int references Producto(idProducto),
cantidad int,
precio decimal(10,2),
total decimal(10,2)
)

go

--COMANDO PARA SOLUCIONAR EL PROBLEMA DE AUTORIZACIÓN PARA GENERAR DIAGRAMAS
ALTER AUTHORIZATION ON DATABASE::BDDERMACORE TO sa;

-- Ingresando datos :

insert into Rol(nombre) values
('Administrador'),
('Empleado'),
('Supervisor')

go

insert into Usuario(nombreCompleto,correo,idRol,clave) values 
('Diana Portal','portal@gmail.com',1,'123456')

go

INSERT INTO Categoria(nombre,esActivo) values
('Cuidado Facial',1),
('Cuidado Corporal',1),
('Cuidado del Cabello',1),
('Maquillaje',1),
('Protectores Solares',1),
('Fragancias',1)

go

insert into Producto(nombre,idCategoria,stock,precio,esActivo) values
('Crema hidratante facial con ácido hialurónico',1,50,45.50,1),
('Sérum facial antioxidante de vitamina C',1,40,65.00,1),
('Limpiador facial suave para piel sensible',1,60,30.25,1),
('Loción corporal nutritiva con karité',2,70,28.75,1),
('Exfoliante corporal de azúcar y coco',2,35,38.90,1),
('Aceite corporal de almendras dulces',2,45,22.00,1),
('Champú fortificante para cabello dañado',3,80,25.00,1),
('Acondicionador reparador con argán',3,75,26.50,1),
('Mascarilla capilar intensiva de keratina',3,30,40.00,1),
('Base de maquillaje líquida cobertura media',4,25,55.00,1),
('Rímel voluminizador a prueba de agua',4,50,32.00,1),
('Labial hidratante tono nude',4,60,20.00,1),
('Protector solar facial SPF 50+',5,90,49.99,1),
('Bruma facial refrescante con aloe vera',6,40,35.00,1),
('Perfume floral suave de 50ml',6,20,85.00,1)

go

insert into Menu(nombre,icono,url) values
('DashBoard','dashboard','/pages/dashboard'),
('Usuarios','group','/pages/usuarios'),
('Productos','collections_bookmark','/pages/productos'),
('Venta','currency_exchange','/pages/venta'),
('Historial Ventas','edit_note','/pages/historial_venta'),
('Reportes','receipt','/pages/reportes')

go

--menus para administrador
insert into MenuRol(idMenu,idRol) values
(1,1),
(2,1),
(3,1),
(4,1),
(5,1),
(6,1)

go

--menus para empleado
insert into MenuRol(idMenu,idRol) values
(4,2),
(5,2)

go

--menus para supervisor
insert into MenuRol(idMenu,idRol) values
(3,3),
(4,3),
(5,3),
(6,3)

go

insert into numerodocumento(ultimo_Numero,fechaRegistro) values
(0,getdate())



