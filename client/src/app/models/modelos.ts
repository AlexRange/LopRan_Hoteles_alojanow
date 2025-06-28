// Interface para tabla Usuarios
export interface Usuarios {
    id_usuario: number;
    nombre: string;
    email: string;
    contrasena: string;
    imagen_usuario: string;
    telefono?: string;
    fecha_registro: string;
    tipo: 'cliente' | 'admin';
    estatus: boolean;
    token: string;
}

// Interface para tabla Habitaciones
export interface TipoHabitacion {
    id_tipo_habitacion: number;
    tipo_habitacion: string;
    precio: number;
    capacidad_personas: number;
}

// Interface para tabla Hoteles
export interface Hoteles {
    id_hotel: number;
    nombre: string;
    direccion: string;
    zona: string;
    ciudad: string;
    pais: string;
    descripcion?: string;
    estrellas: number;
    imagen_hotel: string;
    descripcion_imagen_hot?: string;
    fecha_registro: string;
}

// Interface para tabla Habitaciones
export interface Habitaciones {
    id_habitacion: number;
    id_hotel: number;
    tipo_habitacion: string;
    descripcion?: string;
    num_habitacion: number;
    capacidad: number;
    precio_noche: number;
    disponibilidad: boolean;
    imagen_habitacion: string;
    descripcion_imagen_hab?: string;
}

// Interface para tabla Reservaciones
export interface Reservaciones {
    id_reservacion: number;
    id_usuario: number;
    id_habitacion: number;
    id_hotel: number,
    fecha_inicio: string;
    fecha_fin: string;
    precio_total: number;
    estado: 'pendiente' | 'confirmada' | 'cancelada';
    fecha_reservacion: string;
}

// Interface para tabla ServiciosAdicionales
export interface ServiciosAdicionales {
    id_servicio: number;
    nombre: string;
    descripcion?: string;
    precio: number;
}

export interface HotelServicios {
    id_servicio: number;
    id_hotel: number;
}

// Interface para tabla ReservacionesServicios
export interface ReservacionesServicios {
    id_reserva_servicio?: number;
    id_reservacion: number;
    id_servicio: number;
    cantidad: number;
}

// Interface para tabla ComentariosCalificaciones
export interface ComentariosCalificaciones {
    id_comentario: number;
    id_usuario: number;
    id_hotel: number;
    comentario?: string;
    calificacion: number;
    fecha_comentario: string;
}

// Interface para tabla Promociones
export interface Promociones {
    id_promocion: number;
    id_hotel: number;
    descripcion?: string;
    descuento: number;
    fecha_inicio: string;
    fecha_fin: string;
}

// Interface para tabla Pagos
export interface Pagos {
    id_pago: number;
    id_reservacion: number;
    monto: number;
    metodo_pago: 'tarjeta' | 'paypal' | 'transferencia';
    fecha_pago: string;
    estado: 'pendiente' | 'completado' | 'fallido';
}

export interface RecaptchaResponse {
    success: boolean;
    message?: string; // Opcional, dependiendo de lo que devuelva tu backend
    score?: number;   // Opcional, si incluyes la puntuación en la respuesta
}