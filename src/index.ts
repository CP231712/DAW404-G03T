import express from 'express'
const app = express()
app.use(express.json())

const PORT = 4000

interface Materia {
    codigo: string;
    nombre: string;
    uv: number;
    prerequisitos: string;
    ciclo?: string;
}

interface Carrera {
    nombre: string;
    pensum: Materia[];
}

const tecnicoEnIngenieria: Carrera = {
    nombre: 'Técnico en Ingeniería en Computación',
    pensum: [
        { codigo: "PAL", nombre: "Programacion de Algoritmos", uv: 4, prerequisitos: "Bachillerato", ciclo:"1"},
        { codigo: "LME404", nombre: "Lenguajes de Marcado y Estilo Web", uv: 4, prerequisitos: "Bachillerato", ciclo:"1" },
        { codigo: "POO404", nombre: "Programación Orientada a Objetos", uv: 4, prerequisitos: "PAL404", ciclo:"2" },
        { codigo: "DAW404", nombre: "Desarrollo de Aplic. Web con Soft. Interpret. en el Cliente", uv: 4, prerequisitos: "LME404", ciclo:"2" },
        { codigo: "ASB404", nombre: "Análisis y Diseño de Sistemas y Base de Datos", uv: 4, prerequisitos: "PAL404", ciclo:"2" },
        { codigo: "ASN441", nombre: "Administración de Servicios en la Nube", uv: 4, prerequisitos: "REC404", ciclo:"3" },
        { codigo: "DPS441", nombre: "Diseño y Programación de Software Multiplataforma", uv: 4, prerequisitos: "DAW404", ciclo:"3" },
        { codigo: "DWF404", nombre: "Desarrollo de Aplicaciones con Web Frameworks", uv: 4, prerequisitos: "ASB404", ciclo:"3" },
        { codigo: "SDR404", nombre: "Seguridad de Redes", uv: 4, prerequisitos: "ASN441", ciclo:"4" },
        { codigo: "SPL404", nombre: "Servidores en Plataformas Libres", uv: 4, prerequisitos: "REC404", ciclo:"4" }
    ],
};

const ingenieriaEnComputacion: Carrera = {
    nombre: 'Ingeniería en Computación',
    pensum: [
        { codigo: "CAD501", nombre: "Calculo Diferencial", uv: 4, prerequisitos: "Bachillerato", ciclo:"1" },
        { codigo: "QUG501", nombre: "Quimica General", uv: 4, prerequisitos: "Bachillerato", ciclo:"1" },
        { codigo: "ANF231", nombre: "Antropologia Filosofica", uv: 3, prerequisitos: "Bachillerato", ciclo:"1" },
        { codigo: "PRE104", nombre: "Programacion Estructurada", uv: 4, prerequisitos: "Bachillerato", ciclo:"1" },
        { codigo: "ALG501", nombre: "Algebra Vectorial y matrices", uv: 4, prerequisitos: "Bachillerato", ciclo:"2" },
        { codigo: "POO104", nombre: "Programacion Orientada a Objetos", uv: 4, prerequisitos: "PRE104", ciclo:"2" },
        { codigo: "CVV501", nombre: "Calculo de varias variables", uv: 4, prerequisitos: "CAD501", ciclo:"3" },
        { codigo: "ESA501", nombre: "Estadistica aplicada", uv: 4, prerequisitos: "CVV501", ciclo:"4" },
        { codigo: "ACE102", nombre: "Analisis de circuitos electricos", uv: 4, prerequisitos: "Electricidad y magnetismo", ciclo:"5" },
        { codigo: "AUS104", nombre: "Auditoria de Sistemas", uv: 4, prerequisitos: "Gestion de calidad de software", ciclo:"10" }
    ],
};

app.get('/pensum/:carrera', (_req, res) => {
    if (_req.params.carrera == "tecnico") {
        res.send(tecnicoEnIngenieria.pensum)
    }
    else if (_req.params.carrera == "ingenieria") {
        res.send(ingenieriaEnComputacion.pensum)
    }
    else {
        res.send("Not Found")
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

app.get('/prerrequisitos/:codigo', (_req, res) => {
    res.send({ prerrequisitos: ingenieriaEnComputacion.pensum.concat(tecnicoEnIngenieria.pensum).find((x) => x.codigo == _req.params.codigo)?.prerequisitos })

})

app.get('/ciclo/tecnico/:ciclo', (_req, res) => {
    res.send(tecnicoEnIngenieria.pensum.filter(x => x.ciclo == _req.params.ciclo))

})

app.get('/ciclo/ingenieria/:ciclo', (_req, res) => {
    res.send(ingenieriaEnComputacion.pensum.filter(x => x.ciclo == _req.params.ciclo))

})

app.post('/inscripcion/:carrera', (req, res) => {
    const carrera = req.params.carrera;

    let pensum: Materia[];

    if (carrera === 'tecnico') {
        pensum = tecnicoEnIngenieria.pensum;
    } else if (carrera === 'ingenieria') {
        pensum = ingenieriaEnComputacion.pensum;
    } else {
        res.status(400).send('Carrera no válida');
        return; 
    }

    const materiasSeleccionadas = req.body.materias;

    if (!Array.isArray(materiasSeleccionadas) || materiasSeleccionadas.length !== 4) {
        res.status(400).send('Debes seleccionar exactamente 4 materias');
        return; 
    }

    const uvTotal = materiasSeleccionadas.reduce((total, materiaCodigo) => {
        const materia = pensum.find(m => m.codigo === materiaCodigo);
        return total + (materia ? materia.uv : 0);
    }, 0);

    if (uvTotal < 16) {
        res.status(400).send('Debes seleccionar materias con al menos 16 UV');
        return; 
    }

    res.send('Inscripción exitosa');
});

app.delete('/inscripcion/ingenieria/:codigo', (req, res) => {
    const codigoMateria = req.params.codigo;

    
    const index = ingenieriaEnComputacion.pensum.findIndex(materia => materia.codigo === codigoMateria);
    if (index !== -1) {
        ingenieriaEnComputacion.pensum.splice(index, 1);
        res.send({ mensaje: `Inscripción de la materia ${codigoMateria} eliminada exitosamente.` });
    } else {
        res.status(404).send({ error: `La materia con el código ${codigoMateria} no fue encontrada en las inscripciones.` });
    }
});

app.delete('/inscripcion/tecnico/:codigo', (req, res) => {
    const codigoMateria = req.params.codigo;

    const index = tecnicoEnIngenieria.pensum.findIndex(materia => materia.codigo === codigoMateria);
    if (index !== -1) {
        tecnicoEnIngenieria.pensum.splice(index, 1);
        res.send({ mensaje: `Inscripción de la materia ${codigoMateria} eliminada exitosamente.` });
    } else {
        res.status(404).send({ error: `La materia con el código ${codigoMateria} no fue encontrada en las inscripciones.` });
    }
});
