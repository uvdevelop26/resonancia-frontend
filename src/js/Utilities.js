import { isRef } from "vue"
import moment from "moment-timezone";
import { Constants } from "./Contants";

const Utilities = {
    close: (message) => {

        if (isRef(message)) {
            message.value = ""
        } else {
            console.log("mensaje inválido")
        }
    },

    cleanForm: (form) => {
        if (isRef(form)) {
            for (let clave in form.value) {
                if (Array.isArray(form.value[clave])) {
                    form.value[clave] = [];
                } else {
                    form.value[clave] = "";
                }
            }
        } else {
            console.error("Error al limpiar el formulario");
        }
    },

    slugify: (name, lastname) => {
        const fullName = `${name} ${lastname}`;

        const slug = fullName
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w\-]+/g, "")
            .replace(/\-\-+/g, "-");

        return slug;
    },

    getFormattedDate: (date) => {
        const formattedDate = moment(date).format("DD-MM-YYYY");
        return formattedDate;
    },

    absolutePath: (path) => {
        return `${Constants.serverPath + path}`
    },

    shortingString: (textstring) => {
        let substring;

        if (textstring.length > 30) {
            substring = textstring.substring(0, 30);

            return `${substring} ...ver más`;
        } else {
            substring = textstring;

            return substring;
        }

    },

    manageValidationErrors: (errorArray) => {
        const newObject = {};

        errorArray.forEach((err) => {
            const path = err.path;

            if (!newObject[path]) {
                newObject[path] = [];
            }
            newObject[path].push(err);
        });

        return newObject;
    },

    getDniFromString: (search) => {
        if (isRef(search)) {
            const value = search.value?.toLowerCase();

            const parts = value.split(" ");

            const dni = parts[parts.length - 1];

            return dni;

        } else {
            console.error("La variable es inválida")
        }

    },

    getClaseDescription: (type) => {
        switch (type) {
            case "Glioma":
                return "Es un tipo de tumor cerebral que se origina en las células gliales, que brindan soporte y protección a las neuronas.";
            case "Meningioma":
                return "Es generalmente un tumor benigno de crecimiento lento, pero en algunos casos puede volverse maligno.";
            case "No tumor":
                return "Puede representar un cerebro sano o la presencia de otras anomalías no relacionadas con tumores.";
            case "Pituitary":
                return "Es un tumor que se origina en la glándula pituitaria, ubicada en la base del cerebro.";
            default:
                return "Clasificación no encontrada.";
        }
    },

}

export { Utilities }