// Carga propiedades de prueba en la base de Grupo Condado a través de la API.
// Uso (con la API corriendo):  npm run cargar-datos
// Se puede correr varias veces: saltea las que ya existen (misma calle y número).

const API = process.env.API_URL || "http://localhost:56153/api";
const foto = (id) => `https://images.unsplash.com/photo-${id}?w=800&q=70`;

// [tipo, localidad, barrio, calle, numero, piso, depto, precio, m2, paneles, aislacion, estado, foto, descripcion, servicios]
const DATOS = [
  [1, 6, "Lomas de Villa Allende", "Río de Janeiro", "1450", "", "", 245000, 280, 1, 1, "Disponible", "1564013799919-ab600027ffc6", "Casa de tres dormitorios con pileta, galería y jardín.", "Gas natural, Agua corriente, Pileta"],
  [1, 8, "Playas de Oro", "Av. San Martín", "2210", "", "", 198000, 190, 1, 0, "Disponible", "1512917774080-9991f1c4c750", "Casa moderna a tres cuadras del lago, con quincho.", "Agua corriente, Pileta"],
  [1, 2, "Barrio Jardín", "Av. Richieri", "3055", "", "", 265000, 230, 1, 1, "Disponible", "1600596542815-ffad4c1539a9", "Casa de diseño en dos plantas con pileta y terraza.", "Gas natural, Agua corriente, Cloacas, Pileta"],
  [1, 7, "Barrio Sur", "Av. del Libertador", "980", "", "", 172000, 165, 0, 1, "Disponible", "1580587771525-78b9dba3b914", "Casa de tres dormitorios con pileta y vista a las sierras.", "Gas natural, Agua corriente, Pileta"],
  [1, 3, "Banda Norte", "Av. Sabattini", "3120", "", "", 139000, 150, 0, 0, "Disponible", "1605276374104-dee2a0ed3cd6", "Casa familiar con cochera doble y patio.", "Gas natural, Agua corriente, Cloacas"],
  [1, 6, "Chacras de la Villa", "Los Álamos", "55", "", "", 320000, 310, 1, 1, "Disponible", "1613490493576-7fde63acd811", "Casa minimalista con pileta, cuatro dormitorios y parque.", "Gas natural, Agua corriente, Pileta"],
  [1, 2, "Urca", "Manuel Cardeñosa", "3890", "", "", 214000, 205, 1, 0, "Disponible", "1600566753190-17f0baa2a6c3", "Casa con estudio, cochera y patio con asador.", "Gas natural, Agua corriente, Cloacas"],
  [1, 5, "Centro", "Tucumán", "640", "", "", 96000, 120, 0, 0, "Disponible", "1449844908441-8829872d2607", "Casa de piedra y ladrillo rodeada de árboles.", "Agua corriente"],
  [1, 1, "Bello Horizonte", "Mendoza", "1520", "", "", 128000, 180, 0, 1, "Disponible", "1523217582562-09d0def993a6", "Casa de dos plantas con terraza y parrilla.", "Gas natural, Agua corriente, Cloacas"],
  [1, 8, "Costa Azul", "Los Zorzales", "220", "", "", 155000, 170, 1, 1, "Disponible", "1558036117-15d82a90b9b1", "Casa de campo con vista abierta y galería.", "Agua corriente"],
  [1, 9, "Centro", "Almafuerte", "410", "", "", 112000, 160, 0, 0, "Disponible", "1583608205776-bfd35f0d9f83", "Casa con parque amplio y cochera cubierta.", "Gas natural, Agua corriente"],
  [1, 4, "Parque Monte Grande", "Deán Funes", "780", "", "", 98000, 140, 1, 0, "Disponible", "1576941089067-2de3c901e126", "Casa de estilo clásico con jardín al frente.", "Gas natural, Agua corriente, Cloacas"],
  [1, 2, "Villa Belgrano", "Gauss", "5620", "", "", 235000, 250, 0, 0, "Disponible", "1598228723793-52759bba239c", "Casa de ladrillo visto con parque y quincho.", "Gas natural, Agua corriente, Cloacas"],
  [1, 2, "Valle Escondido", "Los Molles", "125", "", "", 340000, 320, 1, 1, "Disponible", "1600047509807-ba8f99d2cdde", "Casa en barrio cerrado, cuatro dormitorios y pileta.", "Gas natural, Agua corriente, Cloacas, Seguridad"],
  [1, 7, "Barrio Parque", "Avellaneda", "455", "", "", 118000, 145, 1, 1, "Disponible", "1605146769289-440113cc3d00", "Casa nueva de tres dormitorios, lista para habitar.", "Gas natural, Agua corriente"],
  [1, 1, "San Justo", "Catamarca", "2030", "", "", 89000, 115, 0, 0, "Disponible", "1592595896551-12b371d546d5", "Casa de dos dormitorios con patio y galería.", "Gas natural, Agua corriente, Cloacas"],
  [1, 5, "El Mirador", "Las Tipas", "88", "", "", 145000, 175, 0, 1, "Reservada", "1416331108676-a22ccb276e35", "Casa con pileta y galería, ideal para fin de semana.", "Agua corriente, Pileta"],
  [1, 3, "Golf Club", "Los Aromos", "610", "", "", 225000, 260, 1, 1, "Disponible", "1464146072230-91cabc968266", "Casa de tres plantas junto al arroyo, con parque.", "Gas natural, Agua corriente, Cloacas"],
  [2, 2, "Nueva Córdoba", "Obispo Trejo", "1080", "7", "C", 102000, 55, 0, 1, "Disponible", "1560448204-e02f11c3d0e2", "Departamento de un dormitorio con balcón y amenities.", "Gas natural, Agua corriente, Cloacas"],
  [2, 2, "General Paz", "25 de Mayo", "1650", "3", "A", 76000, 42, 0, 0, "Disponible", "1493809842364-78817add7ffb", "Monoambiente luminoso cerca del centro.", "Gas natural, Agua corriente, Cloacas"],
  [2, 2, "Centro", "Av. Colón", "540", "9", "B", 88000, 60, 0, 0, "Disponible", "1600607687939-ce8a6c25118c", "Departamento de dos ambientes con cocina integrada.", "Gas natural, Agua corriente, Cloacas"],
  [2, 8, "Centro", "Av. Libertad", "150", "2", "D", 83000, 48, 1, 0, "Disponible", "1484154218962-a197022b5858", "Departamento a cuatro cuadras del lago.", "Agua corriente, Cloacas"],
  [2, 2, "Alberdi", "Santa Rosa", "1320", "5", "B", 69000, 38, 0, 0, "Reservada", "1554995207-c18c203602cb", "Monoambiente para estudiantes, cerca de la UNC.", "Gas natural, Agua corriente, Cloacas"],
  [2, 3, "Centro", "Constitución", "870", "4", "A", 72000, 52, 0, 1, "Disponible", "1586023492125-27b2c045efd7", "Departamento de un dormitorio con balcón.", "Gas natural, Agua corriente, Cloacas"],
  [2, 2, "Cofico", "Jacinto Ríos", "440", "1", "A", 81000, 58, 1, 1, "Disponible", "1600210492486-724fe5c67fb0", "Departamento reciclado con patio propio.", "Gas natural, Agua corriente, Cloacas"],
  [2, 1, "Centro", "Buenos Aires", "1150", "6", "C", 64000, 45, 0, 0, "Disponible", "1523755231516-e43fd2e8dca5", "Departamento de un dormitorio a metros de la plaza.", "Gas natural, Agua corriente, Cloacas"],
  [2, 2, "Nueva Córdoba", "Av. Hipólito Yrigoyen", "390", "12", "A", 158000, 95, 1, 1, "Disponible", "1600585154526-990dced4db0d", "Departamento de tres ambientes en torre con amenities.", "Gas natural, Agua corriente, Cloacas, Seguridad"],
  [2, 2, "Güemes", "Fructuoso Rivera", "250", "2", "B", 91000, 64, 1, 1, "Disponible", "1502005229762-cf1b2da7c5d6", "Dúplex tipo loft con escalera y doble altura.", "Gas natural, Agua corriente, Cloacas"],
  [3, 6, "Los Quebrachos", "Los Espinillos", "S/N", "", "", 58000, 600, 0, 0, "Disponible", "1500382017468-9049fed747ef", "Lote en loteo con servicios, listo para construir.", "Agua corriente"],
  [4, 9, "Zona rural", "Ruta 9 km 752", "S/N", "", "", 42000, 5000, 0, 0, "Disponible", "1518780664697-55e3ad937233", "Terreno de media hectárea con acceso por ruta.", ""],
  [3, 7, "Los Paraísos", "Los Jazmines", "S/N", "", "", 35000, 450, 0, 0, "Disponible", "1500382017468-9049fed747ef", "Lote plano en barrio residencial.", "Agua corriente"],
];

async function main() {
  const existentes = await (await fetch(`${API}/Propiedad`)).json();
  const clave = (calle, numero) => `${calle}|${numero}`;
  const cargadas = new Set(existentes.map((p) => clave(p.Calle, p.Numeracion)));

  let nuevas = 0;
  for (const [tipo, localidad, barrio, calle, numero, piso, depto, precio, m2, paneles, aislacion, estado, img, descripcion, servicios] of DATOS) {
    if (cargadas.has(clave(calle, numero))) continue;
    // Mismas reglas RN1 y RN2 que usa la app
    const clase = paneles && aislacion ? "A" : paneles || aislacion ? "B" : "C";
    const respuesta = await fetch(`${API}/Propiedad`, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        IdTipo: tipo, IdLocalidad: localidad, Barrio: barrio, Calle: calle, Numeracion: numero,
        Piso: piso, NroDepto: depto, Precio: precio, Superficie: m2, Descripcion: descripcion,
        Estado: estado, PanelesSolares: !!paneles, AislamientoTermico: !!aislacion,
        CategoriaEco: clase, Bonificacion: clase === "A" ? 15 : 0,
        MatriculaVerificada: true, TituloPropiedad: true, Publicada: true,
        Imagen: foto(img), Servicios: servicios, Moneda: "USD",
      }),
    });
    if (!respuesta.ok) throw new Error(`${calle} ${numero}: la API respondió ${respuesta.status}`);
    nuevas++;
  }
  console.log(`Listo: ${nuevas} propiedades nuevas, ${existentes.length + nuevas} en total.`);
}

main().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
