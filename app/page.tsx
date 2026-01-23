import { MapContainer } from "./components";

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Map Section */}
      <section className="w-full" style={{ height: "calc(100vh - 200px)", minHeight: "600px" }}>
        <MapContainer />
      </section>

      {/* Info Section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl mb-4">📍</div>
              <h3 className="text-xl font-semibold mb-2">Reporta Robos</h3>
              <p className="text-gray-600">
                Haz click en el mapa para reportar un robo con todos los
                detalles necesarios.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Visualiza Datos</h3>
              <p className="text-gray-600">
                Consulta estadísticas y zonas de mayor riesgo en nuestra
                sección de reportes.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Mantente Informado</h3>
              <p className="text-gray-600">
                Conoce las áreas de mayor riesgo y toma precauciones
                necesarias.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
