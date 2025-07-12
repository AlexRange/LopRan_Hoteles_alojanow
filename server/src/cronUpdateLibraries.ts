// cronUpdateLibraries.js
const cron = require('node-cron');
const { exec } = require('child_process');

console.log('Iniciando verificador de dependencias desactualizadas...');

// Función para verificar y actualizar dependencias
const checkAndUpdateDependencies = () => {
  console.log('Verificando dependencias desactualizadas...');

  // Paso 1: Ejecutar npm outdated --json para obtener librerías desactualizadas
  exec('npm outdated --json', (error: { code: number; }, stdout: any, stderr: any) => {
    if (error) {
      // Si hay dependencias desactualizadas, npm outdated devuelve error (código 1)
      if (error.code === 1) {
        console.log('Se encontraron dependencias desactualizadas. Actualizando...');
        
        // Paso 2: Ejecutar npm update para actualizar
        exec('npm update', (updateError: any, updateStdout: any, updateStderr: any) => {
          if (updateError) {
            console.error('Error al actualizar:', updateError);
          } else {
            console.log('Dependencias actualizadas correctamente:\n', updateStdout);
          }
        });
      } else {
        console.error('Error inesperado al verificar dependencias:', error);
      }
    } else {
      console.log('Todas las dependencias están actualizadas.');
    }
  });
};

// Programar la ejecución cada 15 días a medianoche (0 0 */15 * *)
cron.schedule('0 0 */15 * *', checkAndUpdateDependencies);

// Ejecutar inmediatamente al iniciar (opcional)
checkAndUpdateDependencies();