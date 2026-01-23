import { Denuncia } from "./types";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "denuncias.json");

// Asegurar que el directorio existe
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Leer denuncias del archivo JSON
export function readDenuncias(): Denuncia[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const fileContent = fs.readFileSync(DATA_FILE, "utf-8");
    const denuncias = JSON.parse(fileContent);
    // Convertir fechas de string a Date
    return denuncias.map((d: any) => ({
      ...d,
      fecha: new Date(d.fecha),
      createdAt: new Date(d.createdAt),
      updatedAt: new Date(d.updatedAt),
    }));
  } catch (error) {
    console.error("Error al leer denuncias:", error);
    return [];
  }
}

// Escribir denuncias al archivo JSON
export function writeDenuncias(denuncias: Denuncia[]): void {
  try {
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(denuncias, null, 2), "utf-8");
  } catch (error) {
    console.error("Error al escribir denuncias:", error);
    throw error;
  }
}

// Agregar una nueva denuncia
export function addDenuncia(denuncia: Denuncia): void {
  const denuncias = readDenuncias();
  denuncias.push(denuncia);
  writeDenuncias(denuncias);
}

// Store temporal en memoria (fallback)
// TODO: Eliminar después de migrar completamente a JSON
export const denunciasStore: Denuncia[] = [];
