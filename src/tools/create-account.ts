import * as https from "https";

export const createAccountTool = {
  name: "create_account",
  description:
    "Crea un nuevo cliente/cuenta en Siebel CRM via SOAP (OCS EAI024). " +
    "Usar cuando el cliente no existe en Siebel y se necesita crearlo antes de generar una oferta. " +
    "Para verificar si existe primero usa search_accounts.",
  inputSchema: {
    type: "object",
    properties: {
      rutCliente: {
        type: "string",
        description: "RUT del cliente (solo números, sin puntos ni guión). Ej: 137914859",
      },
      razonSocial: {
        type: "string",
        description: "Razón social o nombre completo del cliente",
      },
      giroComercial: {
        type: "string",
        description: "Giro o actividad comercial del cliente",
      },
      numeroSerie: {
        type: "string",
        description: "Número de serie del carnet/cédula (opcional)",
      },
      estadoCedula: {
        type: "string",
        description: "Estado de la cédula. Ej: Vigente",
        default: "Vigente",
      },
      region: {
        type: "string",
        description: "Código de región. Ej: 13 para RM, 05 para Valparaíso",
      },
      ciudad: {
        type: "string",
        description: "Código de ciudad. Ej: 083",
      },
      comuna: {
        type: "string",
        description: "Código de comuna. Ej: 1331",
      },
      resultadoEvaluacionScore: {
        type: "string",
        description: "Resultado evaluación score. Ej: Aprobado, Rechazado",
        default: "Aprobado",
      },
      fechaEvaluacion: {
        type: "string",
        description:
          "Fecha evaluación en formato ISO. Ej: 2024-01-15T08:00:00. Si no se indica, se usa la fecha actual.",
      },
      observaciones: {
        type: "string",
        description: "Observaciones adicionales del cliente (opcional)",
      },
      excepcion: {
        type: "string",
        description: "Tipo de excepción. Ej: Sin Excepción",
        default: "Sin Excepción",
      },
      contacto: {
        type: "object",
        description: "Datos del contacto principal del cliente",
        properties: {
          rutContacto: {
            type: "string",
            description: "RUT del contacto (solo números)",
          },
          nombre: {
            type: "string",
            description: "Nombre del contacto",
          },
          apellidoPaterno: {
            type: "string",
            description: "Apellido paterno",
          },
          apellidoMaterno: {
            type: "string",
            description: "Apellido materno (opcional)",
          },
          telefonoCelular: {
            type: "string",
            description: "Teléfono celular (opcional)",
          },
          correoElectronico: {
            type: "string",
            description: "Email del contacto",
          },
          medioContactoPreferido: {
            type: "string",
            description:
              "Medio de contacto preferido. Ej: Teléfono celular, Correo electrónico",
            default: "Teléfono celular",
          },
        },
        required: ["rutContacto", "nombre", "apellidoPaterno", "correoElectronico"],
      },
    },
    required: [
      "rutCliente",
      "razonSocial",
      "giroComercial",
      "region",
      "ciudad",
      "comuna",
      "contacto",
    ],
  },
};

export async function createAccount(args: {
  rutCliente: string;
  razonSocial: string;
  giroComercial: string;
  numeroSerie?: string;
  estadoCedula?: string;
  region: string;
  ciudad: string;
  comuna: string;
  resultadoEvaluacionScore?: string;
  fechaEvaluacion?: string;
  observaciones?: string;
  excepcion?: string;
  contacto: {
    rutContacto: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno?: string;
    telefonoCelular?: string;
    correoElectronico: string;
    medioContactoPreferido?: string;
  };
}): Promise<unknown> {
  const siebelUrl = process.env.SIEBEL_URL || "";
  const username = process.env.SIEBEL_USERNAME || "";
  const password = process.env.SIEBEL_PASSWORD || "";

  const {
    rutCliente,
    razonSocial,
    giroComercial,
    numeroSerie = "",
    estadoCedula = "Vigente",
    region,
    ciudad,
    comuna,
    resultadoEvaluacionScore = "Aprobado",
    fechaEvaluacion,
    observaciones = "",
    excepcion = "Sin Excepción",
    contacto,
  } = args;

  const fechaISO =
    fechaEvaluacion || new Date().toISOString().replace(/\.\d{3}Z$/, "");

  const soapBody = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Header>
    <UsernameToken xmlns="http://siebel.com/webservices">${username}</UsernameToken>
    <PasswordText xmlns="http://siebel.com/webservices">${password}</PasswordText>
    <SessionType xmlns="http://siebel.com/webservices">None</SessionType>
  </soapenv:Header>
  <soapenv:Body>
    <NS1:Crear_Input xmlns:NS1="http://siebel.com/CustomUI">
      <NS2:ClienteCreacion xmlns:NS2="http://www.siebel.com/xml/OCS%20Creacion%20Cliente%20EAI%20024%20Input%20IO/Data">
        <NS2:RutCliente>${rutCliente}</NS2:RutCliente>
        <NS2:GiroComercial>${giroComercial}</NS2:GiroComercial>
        <NS2:RazonSocial>${razonSocial}</NS2:RazonSocial>
        <NS2:NumeroSerie>${numeroSerie}</NS2:NumeroSerie>
        <NS2:EstadoCedula>${estadoCedula}</NS2:EstadoCedula>
        <NS2:Region>${region}</NS2:Region>
        <NS2:Ciudad>${ciudad}</NS2:Ciudad>
        <NS2:Comuna>${comuna}</NS2:Comuna>
        <NS2:ResultadoEvaluacionScore>${resultadoEvaluacionScore}</NS2:ResultadoEvaluacionScore>
        <NS2:FechaEvaluacion>${fechaISO}</NS2:FechaEvaluacion>
        <NS2:Observaciones>${observaciones}</NS2:Observaciones>
        <NS2:ContactoCreacion>
          <NS2:RutContacto>${contacto.rutContacto}</NS2:RutContacto>
          <NS2:Nombre>${contacto.nombre}</NS2:Nombre>
          <NS2:ApellidoPaterno>${contacto.apellidoPaterno}</NS2:ApellidoPaterno>
          <NS2:ApellidoMaterno>${contacto.apellidoMaterno || ""}</NS2:ApellidoMaterno>
          <NS2:TelefonoCelular>${contacto.telefonoCelular || ""}</NS2:TelefonoCelular>
          <NS2:TieneEmail>${contacto.correoElectronico ? "true" : "false"}</NS2:TieneEmail>
          <NS2:CorreoElectronico>${contacto.correoElectronico}</NS2:CorreoElectronico>
          <NS2:MedioContactoPreferido>${contacto.medioContactoPreferido || "Teléfono celular"}</NS2:MedioContactoPreferido>
        </NS2:ContactoCreacion>
        <NS2:ListOfCliente_ExcepcionCreacion>
          <NS2:ClienteExcepcionCreacion>
            <NS2:ClienteConExcepcion>${excepcion}</NS2:ClienteConExcepcion>
          </NS2:ClienteExcepcionCreacion>
        </NS2:ListOfCliente_ExcepcionCreacion>
      </NS2:ClienteCreacion>
    </NS1:Crear_Input>
  </soapenv:Body>
</soapenv:Envelope>`;

  const endpointPath =
    "/siebel/app/eai/esn?SWEExtSource=WebService&SWEExtCmd=Execute&WSSOAP=1";

  const urlObj = new URL(siebelUrl);

  const responseText = await new Promise<string>((resolve, reject) => {
    const bodyBuffer = Buffer.from(soapBody, "utf-8");
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: endpointPath,
      method: "POST",
      rejectUnauthorized: false, // Siebel suele usar certificados autofirmados
      headers: {
        "Content-Type": "text/xml; charset=UTF-8",
        "SOAPAction": "document/http://siebel.com/CustomUI:Crear",
        "Content-Length": bodyBuffer.length,
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    });

    req.on("error", reject);
    req.write(bodyBuffer);
    req.end();
  });

  // Parsear respuesta SOAP
  const errorCode =
    responseText.match(/<[^:]*:?Error_spcCode[^>]*>(.*?)<\/[^:]*:?Error_spcCode>/)?.[1] || "";
  const errorMsg =
    responseText.match(/<[^:]*:?Error_spcMessage[^>]*>(.*?)<\/[^:]*:?Error_spcMessage>/)?.[1] || "";

  return {
    success: errorCode === "0",
    errorCode,
    errorMessage: errorMsg,
    response: responseText,
  };
}
