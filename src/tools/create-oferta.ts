import https from "https";
import http from "http";

export interface RepresentanteLegal {
  rut: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  celular?: string;
  telefono?: string;
  nacionalidad?: string;
  tipoRelacion?: string;
}

export interface AtributoProducto {
  nombre: string;
  valor: string;
}

export interface ContactoProducto {
  nombre: string;
  apellido?: string;
  email: string;
  telefonoMovil?: string;
  tipoContacto: string;
  razonSocial?: string;
}

export interface CuentaAbono {
  banco: string;
  moneda: string;
  nombreTitular: string;
  numeroCuenta: string;
  rutTitular: string;
  tipoCuenta: string;
  propiedadCuenta?: string;
}

export interface ProductoOferta {
  producto: string;
  tipoSolicitud: string;
  nombreFantasia: string;
  rubro: string;
  region: string;
  ciudad: string;
  comuna: string;
  calleDireccion: string;
  local?: string;
  numeroDireccion?: string;
  regionCorrespondencia?: string;
  ciudadCorrespondencia?: string;
  comunaCorrespondencia?: string;
  calleCorrespondencia?: string;
  localCorrespondencia?: string;
  numeroCorrespondencia?: string;
  telefonoDireccion?: string;
  telefonoCorrespondencia?: string;
  horaAperturaAM?: string;
  horaCierreAM?: string;
  horaAperturaPM?: string;
  horaCierrePM?: string;
  diasAtencion?: string;
  fechaCompromiso?: string;
  fechaInicio?: string;
  fechaTermino?: string;
  fechaFirmaContrato?: string;
  tipoDeFirma?: string;
  actividadEconomica?: string;
  codigoComercioPST?: string;
  statusComercioPST?: string;
  nombreFantasiaPST?: string;
  emailPST?: string;
  urlProveedor?: string;
  urlProducto?: string;
  atributos?: AtributoProducto[];
  contactos?: ContactoProducto[];
  cuentaAbono?: CuentaAbono;
}

export interface CreateOfertaArgs {
  rut: string;
  canalOrigen: string;
  comentarios?: string;
  nombreSolicitante: string;
  apellidoSolicitante: string;
  apellidoMaternoSolicitante?: string;
  rutSolicitante: string;
  telefonoFijoSolicitante?: string;
  telefonoMovilSolicitante?: string;
  emailContacto: string;
  representantesLegales?: RepresentanteLegal[];
  productos: ProductoOferta[];
}

export const createOfertaTool = {
  name: "create_oferta",
  description: "Creates an Oferta Económica (Quote) in Siebel TBK via SOAP web service",
  inputSchema: {
    type: "object",
    properties: {
      rut:                         { type: "string",  description: "RUT of the account (e.g. 100685337)" },
      canalOrigen:                 { type: "string",  description: "Canal de origen (e.g. Portal TBK)" },
      comentarios:                 { type: "string",  description: "Comments for the offer" },
      nombreSolicitante:           { type: "string",  description: "First name of the applicant" },
      apellidoSolicitante:         { type: "string",  description: "Last name (paterno) of the applicant" },
      apellidoMaternoSolicitante:  { type: "string",  description: "Last name (materno) of the applicant" },
      rutSolicitante:              { type: "string",  description: "RUT of the applicant" },
      telefonoFijoSolicitante:     { type: "string",  description: "Fixed phone of the applicant" },
      telefonoMovilSolicitante:    { type: "string",  description: "Mobile phone of the applicant" },
      emailContacto:               { type: "string",  description: "Email of the contact" },
      representantesLegales: {
        type: "array",
        description: "Legal representatives",
        items: {
          type: "object",
          properties: {
            rut:             { type: "string" },
            nombre:          { type: "string" },
            apellidoPaterno: { type: "string" },
            apellidoMaterno: { type: "string" },
            email:           { type: "string" },
            celular:         { type: "string" },
            telefono:        { type: "string" },
            nacionalidad:    { type: "string" },
            tipoRelacion:    { type: "string" },
          },
          required: ["rut", "nombre", "apellidoPaterno", "apellidoMaterno", "email"],
        },
      },
      productos: {
        type: "array",
        description: "Products/Quote items",
        items: {
          type: "object",
          properties: {
            producto:                 { type: "string", description: "Product name (e.g. WEBPAY PLUS TIENDA EN MALL)" },
            tipoSolicitud:            { type: "string", description: "e.g. Nuevo punto de venta" },
            nombreFantasia:           { type: "string" },
            rubro:                    { type: "string", description: "Rubro code (e.g. 015)" },
            region:                   { type: "string", description: "Region code (e.g. 05)" },
            ciudad:                   { type: "string", description: "City code (e.g. 288)" },
            comuna:                   { type: "string", description: "Comuna code (e.g. 0515)" },
            calleDireccion:           { type: "string" },
            local:                    { type: "string" },
            numeroDireccion:          { type: "string" },
            regionCorrespondencia:    { type: "string" },
            ciudadCorrespondencia:    { type: "string" },
            comunaCorrespondencia:    { type: "string" },
            calleCorrespondencia:     { type: "string" },
            localCorrespondencia:     { type: "string" },
            numeroCorrespondencia:    { type: "string" },
            telefonoDireccion:        { type: "string" },
            telefonoCorrespondencia:  { type: "string" },
            horaAperturaAM:           { type: "string", description: "e.g. 09:00:00" },
            horaCierreAM:             { type: "string" },
            horaAperturaPM:           { type: "string" },
            horaCierrePM:             { type: "string" },
            diasAtencion:             { type: "string", description: "e.g. Lunes a Viernes" },
            fechaCompromiso:          { type: "string", description: "dd/MM/yyyy" },
            fechaInicio:              { type: "string", description: "dd/MM/yyyy" },
            fechaTermino:             { type: "string", description: "dd/MM/yyyy" },
            fechaFirmaContrato:       { type: "string", description: "dd/MM/yyyy" },
            tipoDeFirma:              { type: "string", description: "e.g. No aplica" },
            actividadEconomica:       { type: "string" },
            codigoComercioPST:        { type: "string" },
            statusComercioPST:        { type: "string" },
            nombreFantasiaPST:        { type: "string" },
            emailPST:                 { type: "string" },
            urlProveedor:             { type: "string" },
            urlProducto:              { type: "string" },
            atributos: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  nombre: { type: "string", description: "e.g. INTEGRADO, SIN DELIVERY, TIPO CAPTURA, Redcompra, Propina" },
                  valor:  { type: "string" },
                },
                required: ["nombre", "valor"],
              },
            },
            contactos: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  nombre:        { type: "string" },
                  apellido:      { type: "string" },
                  email:         { type: "string" },
                  telefonoMovil: { type: "string" },
                  tipoContacto:  { type: "string", description: "e.g. Tecnico, Integrador PST" },
                  razonSocial:   { type: "string" },
                },
                required: ["email", "tipoContacto"],
              },
            },
            cuentaAbono: {
              type: "object",
              properties: {
                banco:            { type: "string", description: "Bank code (e.g. 26)" },
                moneda:           { type: "string", description: "e.g. Peso" },
                nombreTitular:    { type: "string" },
                numeroCuenta:     { type: "string" },
                rutTitular:       { type: "string" },
                tipoCuenta:       { type: "string", description: "e.g. Cuenta corriente" },
                propiedadCuenta:  { type: "string", description: "e.g. Cuenta propia" },
              },
              required: ["banco", "moneda", "nombreTitular", "numeroCuenta", "rutTitular", "tipoCuenta"],
            },
          },
          required: ["producto", "tipoSolicitud", "nombreFantasia", "rubro", "region", "ciudad", "comuna", "calleDireccion"],
        },
      },
    },
    required: ["rut", "canalOrigen", "nombreSolicitante", "apellidoSolicitante", "rutSolicitante", "emailContacto", "productos"],
  },
};

function buildSoap(args: CreateOfertaArgs, username: string, password: string): string {
  const rrll = (args.representantesLegales ?? []).map(r => `
            <tbk:tbkRepresentanteLegalBc>
               <tbk:tBKRUT>${r.rut}</tbk:tBKRUT>
               <tbk:tBKNombre>${r.nombre}</tbk:tBKNombre>
               <tbk:tBKApellidoPaterno>${r.apellidoPaterno}</tbk:tBKApellidoPaterno>
               <tbk:tBKApellidoMaterno>${r.apellidoMaterno}</tbk:tBKApellidoMaterno>
               <tbk:tBKEmail>${r.email}</tbk:tBKEmail>
               <tbk:tBKCelular>${r.celular ?? ""}</tbk:tBKCelular>
               <tbk:tBKTelefono>${r.telefono ?? ""}</tbk:tBKTelefono>
               <tbk:tBKNacionalidad>${r.nacionalidad ?? "CHILE"}</tbk:tBKNacionalidad>
               <tbk:tBKTipoRelacion>${r.tipoRelacion ?? "Representante Legal"}</tbk:tBKTipoRelacion>
            </tbk:tbkRepresentanteLegalBc>`).join("");

  const productos = args.productos.map(p => {
    const atributos = (p.atributos ?? []).map(a => `
                        <tbk:quoteItemXA>
                           <tbk:DisplayName2>${a.nombre}</tbk:DisplayName2>
                           <tbk:TextValue>${a.valor}</tbk:TextValue>
                        </tbk:quoteItemXA>`).join("");

    const contactos = (p.contactos ?? []).map(c => `
                        <tbk:tbkContactQuoteItemBc>
                           <tbk:tBKNombreContacto>${c.nombre ?? ""}</tbk:tBKNombreContacto>
                           <tbk:tBKApellidoContacto>${c.apellido ?? ""}</tbk:tBKApellidoContacto>
                           <tbk:tBKEmailContacto2>${c.email}</tbk:tBKEmailContacto2>
                           <tbk:tBKTelefonoMovil>${c.telefonoMovil ?? ""}</tbk:tBKTelefonoMovil>
                           <tbk:tBKTipoContacto>${c.tipoContacto}</tbk:tBKTipoContacto>
                           <tbk:tBKRazonSocial>${c.razonSocial ?? ""}</tbk:tBKRazonSocial>
                        </tbk:tbkContactQuoteItemBc>`).join("");

    const cuenta = p.cuentaAbono ? `
                     <tbk:listOftbkCuentaAbonoQuoteitemBc>
                        <tbk:tbkCuentaAbonoQuoteitemBc>
                           <tbk:tBKBancoAfiliacion>${p.cuentaAbono.banco}</tbk:tBKBancoAfiliacion>
                           <tbk:tBKMoneda>${p.cuentaAbono.moneda}</tbk:tBKMoneda>
                           <tbk:tBKNombreTitular>${p.cuentaAbono.nombreTitular}</tbk:tBKNombreTitular>
                           <tbk:tBKNumeroCuenta>${p.cuentaAbono.numeroCuenta}</tbk:tBKNumeroCuenta>
                           <tbk:tBKPropiedadCuenta>${p.cuentaAbono.propiedadCuenta ?? "Cuenta propia"}</tbk:tBKPropiedadCuenta>
                           <tbk:tBKRUTTitular>${p.cuentaAbono.rutTitular}</tbk:tBKRUTTitular>
                           <tbk:tBKTipoCuentaAfiliacion>${p.cuentaAbono.tipoCuenta}</tbk:tBKTipoCuentaAfiliacion>
                        </tbk:tbkCuentaAbonoQuoteitemBc>
                     </tbk:listOftbkCuentaAbonoQuoteitemBc>` : "";

    return `
                  <tbk:quoteItem>
                     <tbk:aTPStatus>Solicitado</tbk:aTPStatus>
                     <tbk:tBKProduct>${p.producto}</tbk:tBKProduct>
                     <tbk:tBKTipoSolicitud>${p.tipoSolicitud}</tbk:tBKTipoSolicitud>
                     <tbk:tBKNombreFantasia>${p.nombreFantasia}</tbk:tBKNombreFantasia>
                     <tbk:tBKRubro>${p.rubro}</tbk:tBKRubro>
                     <tbk:tBKRegion>${p.region}</tbk:tBKRegion>
                     <tbk:tBKCiudad>${p.ciudad}</tbk:tBKCiudad>
                     <tbk:tBKComuna>${p.comuna}</tbk:tBKComuna>
                     <tbk:tBKCalleDireccion>${p.calleDireccion}</tbk:tBKCalleDireccion>
                     <tbk:tBKLocal>${p.local ?? ""}</tbk:tBKLocal>
                     <tbk:tBKBUCRegionCorrespondencia>${p.regionCorrespondencia ?? p.region}</tbk:tBKBUCRegionCorrespondencia>
                     <tbk:tBKBUCCiudadCorrespondencia>${p.ciudadCorrespondencia ?? p.ciudad}</tbk:tBKBUCCiudadCorrespondencia>
                     <tbk:tBKBUCComunaCorrespondencia>${p.comunaCorrespondencia ?? p.comuna}</tbk:tBKBUCComunaCorrespondencia>
                     <tbk:tBKBUCCalleCorrespondencia>${p.calleCorrespondencia ?? p.calleDireccion}</tbk:tBKBUCCalleCorrespondencia>
                     <tbk:tBKBUCLocalCorrespondencia>${p.localCorrespondencia ?? p.local ?? ""}</tbk:tBKBUCLocalCorrespondencia>
                     <tbk:tBKBUCNumeroCorrespondencia>${p.numeroCorrespondencia ?? p.numeroDireccion ?? ""}</tbk:tBKBUCNumeroCorrespondencia>
                     <tbk:tBKBUCTelefonoDireccionFis>${p.telefonoDireccion ?? ""}</tbk:tBKBUCTelefonoDireccionFis>
                     <tbk:tBKBUCTelefonoDireccionCorr>${p.telefonoCorrespondencia ?? p.telefonoDireccion ?? ""}</tbk:tBKBUCTelefonoDireccionCorr>
                     <tbk:tBKHoraAperturaComercioAM>${p.horaAperturaAM ?? ""}</tbk:tBKHoraAperturaComercioAM>
                     <tbk:tBKHoraCierreComercioAM>${p.horaCierreAM ?? ""}</tbk:tBKHoraCierreComercioAM>
                     <tbk:tBKHoraAperturaComercioPM>${p.horaAperturaPM ?? ""}</tbk:tBKHoraAperturaComercioPM>
                     <tbk:tBKHoraCierreComercioPM>${p.horaCierrePM ?? ""}</tbk:tBKHoraCierreComercioPM>
                     <tbk:tBKDiaAtencion>${p.diasAtencion ?? ""}</tbk:tBKDiaAtencion>
                     <tbk:tBKFechaCompromisoProd>${p.fechaCompromiso ?? ""}</tbk:tBKFechaCompromisoProd>
                     <tbk:tBKFechaInicio_PR>${p.fechaInicio ?? ""}</tbk:tBKFechaInicio_PR>
                     <tbk:tBKFechaTermino_PR>${p.fechaTermino ?? ""}</tbk:tBKFechaTermino_PR>
                     <tbk:tBKFechafirmacontrato>${p.fechaFirmaContrato ?? ""}</tbk:tBKFechafirmacontrato>
                     <tbk:tBKTipodeFirma>${p.tipoDeFirma ?? "No aplica"}</tbk:tBKTipodeFirma>
                     <tbk:tBKActividadEconomicaStock>${p.actividadEconomica ?? ""}</tbk:tBKActividadEconomicaStock>
                     <tbk:tBK_CodigoComercioPST>${p.codigoComercioPST ?? ""}</tbk:tBK_CodigoComercioPST>
                     <tbk:tBK_Status_Comercio_PST>${p.statusComercioPST ?? ""}</tbk:tBK_Status_Comercio_PST>
                     <tbk:tBK_Comercio_PST_Nombre_Fant>${p.nombreFantasiaPST ?? ""}</tbk:tBK_Comercio_PST_Nombre_Fant>
                     <tbk:tBK_Comercio_PST_Email>${p.emailPST ?? ""}</tbk:tBK_Comercio_PST_Email>
                     <tbk:tBKBUCURLProveedor>${p.urlProveedor ?? ""}</tbk:tBKBUCURLProveedor>
                     <tbk:tBKURL_PR>${p.urlProducto ?? ""}</tbk:tBKURL_PR>
                     <tbk:listOfquoteItemXA>${atributos}
                     </tbk:listOfquoteItemXA>
                     <tbk:listOftbkContactQuoteItemBc>${contactos}
                     </tbk:listOftbkContactQuoteItemBc>
                     ${cuenta}
                  </tbk:quoteItem>`;
  }).join("");

  return `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cus="http://siebel.com/CustomUI" xmlns:tbk="http://www.siebel.com/xml/TBK%20VE%20Quote%20EAI%20IO">
   <soapenv:Header>
      <soapenv:UsernameToken>${username}</soapenv:UsernameToken>
      <soapenv:PasswordText>${password}</soapenv:PasswordText>
      <soapenv:SessionType>None</soapenv:SessionType>
   </soapenv:Header>
   <soapenv:Body>
      <cus:crearOferta_Input>
         <tbk:listOfTbkVeQuoteEaiIo>
            <tbk:quote>
               <tbk:Status>En Configuración de oferta</tbk:Status>
               <tbk:RUT>${args.rut}</tbk:RUT>
               <tbk:CanaldeOrigen>${args.canalOrigen}</tbk:CanaldeOrigen>
               <tbk:tBKComentarios>${args.comentarios ?? ""}</tbk:tBKComentarios>
               <tbk:tBKNombreSolicitante>${args.nombreSolicitante}</tbk:tBKNombreSolicitante>
               <tbk:tBKApellidoContact>${args.apellidoSolicitante}</tbk:tBKApellidoContact>
               <tbk:tBKApellidoMaternoSolicitante>${args.apellidoMaternoSolicitante ?? ""}</tbk:tBKApellidoMaternoSolicitante>
               <tbk:RutSolicitante>${args.rutSolicitante}</tbk:RutSolicitante>
               <tbk:tBKTelefonoFijoSolicitante>${args.telefonoFijoSolicitante ?? ""}</tbk:tBKTelefonoFijoSolicitante>
               <tbk:tBKTelefonoMovilSolicitante>${args.telefonoMovilSolicitante ?? ""}</tbk:tBKTelefonoMovilSolicitante>
               <tbk:tBKEmailContacto>${args.emailContacto}</tbk:tBKEmailContacto>
               <tbk:listOftbkRepresentanteLegalBc>${rrll}
               </tbk:listOftbkRepresentanteLegalBc>
               <tbk:listOfquoteItem>${productos}
               </tbk:listOfquoteItem>
            </tbk:quote>
         </tbk:listOfTbkVeQuoteEaiIo>
      </cus:crearOferta_Input>
   </soapenv:Body>
</soapenv:Envelope>`;
}

export async function createOferta(
  args: CreateOfertaArgs
): Promise<{ success: boolean; response: string }> {
  const username = process.env.SIEBEL_USERNAME!;
  const password = process.env.SIEBEL_PASSWORD!;
  const baseUrl  = process.env.SIEBEL_URL!;

  const soapBody = buildSoap(args, username, password);
  const url = new URL(`${baseUrl}/siebel/app/eai/esn?SWEExtSource=WebService&SWEExtCmd=Execute&WSSOAP=1`);

  return new Promise((resolve, reject) => {
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === "https:" ? 443 : 80),
      path: `${url.pathname}${url.search}`,
      method: "POST",
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        "SOAPAction":   '"document/http://siebel.com/CustomUI:crearOferta"',
        "Content-Length": Buffer.byteLength(soapBody),
      },
      rejectUnauthorized: false,
    };

    const lib = url.protocol === "https:" ? https : http;
    const req = lib.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        if (res.statusCode && res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        } else {
          resolve({ success: true, response: body });
        }
      });
    });

    req.on("error", reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error("Timeout (30s)")); });
    req.write(soapBody);
    req.end();
  });
}
