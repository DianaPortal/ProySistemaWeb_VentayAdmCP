﻿using AutoMapper;
using SistemaVenta.DTO;
using SistemaVenta.Model;
using System.Globalization;

namespace SistemaVenta.Utility
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            #region Rol
            CreateMap<Rol, RolDTO>().ReverseMap();
            #endregion Rol

            #region Menu
            CreateMap<Menu, MenuDTO>().ReverseMap();
            #endregion Menu

            #region Usuario
            CreateMap<Usuario, UsuarioDTO>()
               .ForMember(destino =>
                destino.RolDescripcion,
                opt => opt.MapFrom(origen => origen.IdRolNavigation.Nombre)
                )
                .ForMember(destino => destino.EsActivo,
                opt => opt.MapFrom(origen => origen.EsActivo == true ? 1 : 0)
                );

            CreateMap<Usuario, SesionDTO>()
                .ForMember(destino =>
                destino.RolDescripcion,
                opt => opt.MapFrom(origen => origen.IdRolNavigation.Nombre)
                );

            CreateMap<UsuarioDTO, Usuario>()
                .ForMember(destino =>
                 destino.IdRolNavigation,
                 opt => opt.Ignore())
                .ForMember(destino =>
                destino.EsActivo,
                opt => opt.MapFrom(origen => origen.EsActivo == 1 ? true : false)
                );

            #endregion Usuario

            #region Categoria
            CreateMap<Categoria, CategoriaDTO>().ReverseMap();
            #endregion Categoria

            #region Producto
            CreateMap<Producto, ProductoDTO>()
                .ForMember(destino =>
                 destino.DescripcionCategoria,
                 opt => opt.MapFrom(origen => origen.IdCategoriaNavigation.Nombre)
                )
                .ForMember(destino =>
                 destino.Precio,
                 opt => opt.MapFrom(origen => Convert.ToString(origen.Precio.Value, new CultureInfo("es-PE")))
                )
                .ForMember(destino =>
                destino.EsActivo,
                opt => opt.MapFrom(origen => origen.EsActivo == true ? 1 : 0)
                );

            CreateMap<ProductoDTO, Producto>()
                .ForMember(destino =>
                 destino.IdCategoriaNavigation,
                 opt => opt.Ignore()
                )
                .ForMember(destino =>
                 destino.Precio,
                 opt => opt.MapFrom(origen => Convert.ToDecimal(origen.Precio, new CultureInfo("es-PE")))
                )
                .ForMember(destino =>
                destino.EsActivo,
                opt => opt.MapFrom(origen => origen.EsActivo == 1 ? true : false)
                );

            #endregion Producto

            #region Venta
            CreateMap<Venta, VentaDTO>()
              .ForMember(destino =>
                 destino.TotalTexto,
                 opt => opt.MapFrom(origen => Convert.ToString(origen.Total.Value, new CultureInfo("es-PE")))
                )
              .ForMember(destino =>
                 destino.FechaRegistro,
                 opt => opt.MapFrom(origen => origen.FechaRegistro.Value.ToString("dd/MM/yyyy"))
                );

            CreateMap<VentaDTO, Venta>()
            .ForMember(destino =>
                destino.Total,
                opt => opt.MapFrom(origen => !string.IsNullOrEmpty(origen.TotalTexto) ? Convert.ToDecimal(origen.TotalTexto, new CultureInfo("es-PE")) : (decimal?)null)
            )
            .ForMember(destino =>
                destino.FechaRegistro,
                opt => opt.MapFrom(origen => !string.IsNullOrEmpty(origen.FechaRegistro) ? DateTime.ParseExact(origen.FechaRegistro, "dd/MM/yyyy", CultureInfo.InvariantCulture) : (DateTime?)null)
            );
            #endregion Venta

            #region DetalleVenta
            CreateMap<DetalleVenta, DetalleVentaDTO>()
                .ForMember(destino =>
                destino.DescripcionProducto,
                opt => opt.MapFrom(origen => origen.IdProductoNavigation.Nombre)
                )
                .ForMember(destino =>
                 destino.PrecioTexto,
                 opt => opt.MapFrom(origen => Convert.ToString(origen.Precio.Value, new CultureInfo("es-PE")))
                )
                .ForMember(destino =>
                 destino.TotalTexto,
                 opt => opt.MapFrom(origen => Convert.ToString(origen.Total.Value, new CultureInfo("es-PE")))
                );
            CreateMap<DetalleVentaDTO, DetalleVenta>()
                .ForMember(destino =>
                 destino.Precio,
                 opt => opt.MapFrom(origen => Convert.ToDecimal(origen.PrecioTexto, new CultureInfo("es-PE")))
                )
                .ForMember(destino =>
                 destino.Total,
                 opt => opt.MapFrom(origen => Convert.ToDecimal(origen.TotalTexto, new CultureInfo("es-PE")))
                );
            #endregion DetalleVenta

            #region Reporte
            CreateMap<DetalleVenta, ReporteDTO>()
                 .ForMember(destino =>
                 destino.FechaRegistro,
                 opt => opt.MapFrom(origen => origen.IdVentaNavigation.FechaRegistro.Value.ToString("dd/MM/yyyy"))
                )
                 .ForMember(destino =>
                 destino.NumeroDocumento,
                 opt => opt.MapFrom(origen => origen.IdVentaNavigation.NumeroDocumento)
                )
                 .ForMember(destino =>
                 destino.TipoPago,
                 opt => opt.MapFrom(origen => origen.IdVentaNavigation.TipoPago)
                )
                 .ForMember(destino =>
                 destino.TotalVenta,
                 opt => opt.MapFrom(origen => Convert.ToString(origen.IdVentaNavigation.Total.Value, new CultureInfo("es-PE")))
                )
                 .ForMember(destino =>
                 destino.Producto,
                 opt => opt.MapFrom(origen => origen.IdProductoNavigation.Nombre)
                )
                 .ForMember(destino =>
                 destino.Precio,
                 opt => opt.MapFrom(origen => Convert.ToString(origen.Precio.Value, new CultureInfo("es-PE")))
                )
                 .ForMember(destino =>
                 destino.Total,
                 opt => opt.MapFrom(origen => Convert.ToString(origen.Total.Value, new CultureInfo("es-PE")))
                );
            #endregion Reporte

        }
    }
}
