using SistemaVenta.DAL.DBContext;
using SistemaVenta.DAL.Repositorios.Contrato;
using SistemaVenta.Model;

namespace SistemaVenta.DAL.Repositorios
{
    public class VentaRepository : GenericRepository<Venta>, IVentaRepository
    {
        private readonly BddermacoreContext _dbcontext;

        public VentaRepository(BddermacoreContext dbcontext) : base(dbcontext)
        {
            _dbcontext = dbcontext;
        }

        //Metodo para el registro de una venta.
        public async Task<Venta> Registrar(Venta modelo)
        {
            Venta ventaGenerada = new Venta();

            using (var transaction = _dbcontext.Database.BeginTransaction())
            {
                try
                {
                    foreach (DetalleVenta dv in modelo.DetalleVenta)
                    {
                        //Carga de Producto y Control de Stock
                        Producto prod_encotrado = _dbcontext.Productos.Where(p => p.IdProducto == dv.IdProducto).First();

                        prod_encotrado.Stock = prod_encotrado.Stock - dv.Cantidad;
                        _dbcontext.Productos.Update(prod_encotrado);

                    }
                    await _dbcontext.SaveChangesAsync();

                    //Número del documento
                    NumeroDocumento correlativo = _dbcontext.NumeroDocumentos.First();
                    correlativo.UltimoNumero = correlativo.UltimoNumero - 1;
                    correlativo.FechaRegistro = DateTime.Now;

                    _dbcontext.NumeroDocumentos.Update(correlativo);
                    await _dbcontext.SaveChangesAsync();

                    //Formato para el número de documento - Cantidad de digitos
                    int CantDigitos = 4;
                    string ceros = string.Concat(Enumerable.Repeat("0", CantDigitos));
                    string numVenta = ceros + correlativo.UltimoNumero.ToString();

                    numVenta = numVenta.Substring(numVenta.Length - CantDigitos);
                    modelo.NumeroDocumento = numVenta;
                    await _dbcontext.Venta.AddAsync(modelo);
                    await _dbcontext.SaveChangesAsync();

                    ventaGenerada = modelo;
                    transaction.Commit();

                }
                catch
                {
                    transaction.Rollback();
                    throw;
                }
                return ventaGenerada;
            }

        }




    }
}
