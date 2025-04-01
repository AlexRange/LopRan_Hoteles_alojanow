CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    imagen_usuario LONGTEXT,
    telefono VARCHAR(10),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo ENUM('cliente', 'admin') DEFAULT 'cliente', 
    estatus TINYINT(1) DEFAULT 0 COMMENT '1=Activo, 0=Inactivo',
    token VARCHAR(255) DEFAULT NULL
);

-- Tabla de Hoteles
CREATE TABLE hoteles (
    id_hotel INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    zona VARCHAR(50) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    pais VARCHAR(100) NOT NULL,
    descripcion TEXT,
    estrellas INT CHECK (estrellas BETWEEN 1 AND 5),
    imagen_hotel LONGTEXT NOT NULL,
    descripcion_imagen_hot VARCHAR(255),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Habitaciones
CREATE TABLE habitaciones (
    id_habitacion INT AUTO_INCREMENT PRIMARY KEY,
    id_hotel INT NOT NULL,
    num_habitacion int NOT NULL,
    tipo_habitacion VARCHAR(50) NOT NULL,
    descripcion TEXT,
    capacidad INT NOT NULL,
    precio_noche DECIMAL(10, 2) NOT NULL,
    disponibilidad BOOLEAN DEFAULT TRUE,
    imagen_habitacion LONGTEXT NOT NULL,
    descripcion_imagen_hab VARCHAR(255),
    FOREIGN KEY (id_hotel) REFERENCES hoteles(id_hotel) ON DELETE CASCADE
);

-- Tabla de Reservaciones
CREATE TABLE reservaciones (
    id_reservacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_habitacion INT NOT NULL,
    id_hotel INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    precio_total DECIMAL(10, 2) NOT NULL,
    estado ENUM('pendiente', 'confirmada', 'cancelada') DEFAULT 'pendiente',
    fecha_reservacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_habitacion) REFERENCES habitaciones(id_habitacion) ON DELETE CASCADE
    FOREIGN KEY (id_hotel) REFERENCES habitaciones(id_hotel) ON DELETE CASCADE
);

-- Tabla de Servicios Adicionales
CREATE TABLE servicios_adicionales (
    id_servicio INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL
);

-- Tabla de Reservaciones con Servicios Adicionales
CREATE TABLE reservaciones_servicios (
    id_reserva_servicio SERIAL PRIMARY KEY,
    id_reservacion INT NOT NULL,
    id_servicio INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1 CHECK (cantidad > 0),
    FOREIGN KEY (id_reservacion) REFERENCES reservaciones(id_reservacion) ON DELETE CASCADE,
    FOREIGN KEY (id_servicio) REFERENCES servicios_adicionales(id_servicio) ON DELETE RESTRICT
);

-- Tabla de Comentarios y Calificaciones
CREATE TABLE comentarios_calificaciones (
    id_comentario INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_hotel INT NOT NULL,
    comentario TEXT,
    calificacion INT CHECK (calificacion BETWEEN 1 AND 5),
    fecha_comentario TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_hotel) REFERENCES hoteles(id_hotel) ON DELETE CASCADE
);

-- Tabla de Promociones
CREATE TABLE promociones (
    id_promocion INT AUTO_INCREMENT PRIMARY KEY,
    id_hotel INT NOT NULL,
    descripcion TEXT,
    descuento DECIMAL(5, 2) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    FOREIGN KEY (id_hotel) REFERENCES hoteles(id_hotel) ON DELETE CASCADE
);

-- Tabla de Pagos
CREATE TABLE pagos (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_reservacion INT NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    metodo_pago ENUM('tarjeta', 'paypal', 'transferencia') NOT NULL,
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('pendiente', 'completado', 'fallido') DEFAULT 'pendiente',
    FOREIGN KEY (id_reservacion) REFERENCES reservaciones(id_reservacion) ON DELETE CASCADE
);

CREATE TABLE verification_codes (
    id INT(11) NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    estatus ENUM('Activo', 'Expirado', 'Verificado') DEFAULT 'Activo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE otp_codes (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Identificador único del registro
    email VARCHAR(255) NOT NULL,      -- Correo electrónico del usuario
    code_otp VARCHAR(10) NOT NULL,         -- Código OTP generado
    status ENUM('Pendiente', 'Verificado') DEFAULT 'Pendiente', -- Estado del código (pendiente o verificado)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha y hora de creación del código
    expires_at DATETIME NOT NULL       -- Fecha y hora de expiración del código
);

-- Tabla de Relación entre Hoteles y Servicios Adicionales
CREATE TABLE hotel_servicios (
    id_hotel INT,
    id_servicio INT,
    PRIMARY KEY (id_hotel, id_servicio),
    FOREIGN KEY (id_hotel) REFERENCES hoteles(id_hotel) ON DELETE CASCADE,
    FOREIGN KEY (id_servicio) REFERENCES servicios_adicionales(id_servicio) ON DELETE CASCADE
);

-- Triger actualizar estatus a expirado en tabla verification_codes

DELIMITER $$

CREATE TRIGGER update_code_status
AFTER INSERT ON verification_codes
FOR EACH ROW
BEGIN
    -- Actualiza el estatus a 'Expirado' después de 2 minutos
    UPDATE verification_codes
    SET status = 'Expirado'
    WHERE id = NEW.id AND TIMESTAMPDIFF(MINUTE, created_at, NOW()) >= 2;
END$$

DELIMITER ;