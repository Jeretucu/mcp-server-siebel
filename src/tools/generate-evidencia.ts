import puppeteer from "puppeteer";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

export const generateEvidenciaTool = {
  name: "generate_evidencia",
  description: "Generates a PDF evidence document for a Siebel Oferta Económica. Takes screenshots of the offer form and Atributos tab and generates a formatted PDF.",
  inputSchema: {
    type: "object",
    properties: {
      nro_oferta: { type: "string", description: "Offer number (e.g. 1-2510450209)" },
      proyecto:   { type: "string", description: "Project or ticket name (e.g. SERINCIPRO-1579)" },
      autor:      { type: "string", description: "Author name" },
      output_dir: { type: "string", description: "Directory to save the PDF (optional, defaults to Desktop)" },
    },
    required: ["nro_oferta", "proyecto", "autor"],
  },
};

function buildPdfHtml(nroOferta: string, proyecto: string, autor: string, fecha: string, s1: string, s2: string): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<style>
  @page { margin: 2cm; size: A4; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; font-size: 11pt; color: #222; }
  .page-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #16a34a; padding-bottom: 8px; margin-bottom: 20px; }
  .page-header .brand { font-size: 18pt; font-weight: 900; color: #111; letter-spacing: -1px; }
  .page-header .brand span { color: #16a34a; }
  .page-header .confidencial { font-size: 8pt; color: #16a34a; font-weight: bold; }
  .page-footer { position: fixed; bottom: 0; left: 0; right: 0; text-align: center; font-size: 8pt; color: #16a34a; border-top: 1px solid #16a34a; padding: 4px; background: white; }
  .cover { text-align: center; padding: 80px 40px; page-break-after: always; }
  .cover .logo-text { font-size: 42pt; font-weight: 900; color: #111; letter-spacing: -2px; margin-bottom: 60px; }
  .cover .logo-text span { color: #16a34a; }
  .cover h1 { font-size: 18pt; font-weight: bold; text-transform: uppercase; margin-bottom: 8px; }
  .cover h2 { font-size: 14pt; font-weight: normal; text-transform: uppercase; color: #444; margin-bottom: 40px; }
  .cover .ticket { font-size: 13pt; font-weight: bold; margin-bottom: 80px; }
  .cover .meta { font-size: 10pt; color: #555; text-align: right; }
  h2.section { font-size: 16pt; font-weight: bold; margin: 24px 0 12px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; }
  h3.subsection { font-size: 11pt; font-weight: bold; margin: 16px 0 8px; color: #16a34a; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
  th { background: #16a34a; color: white; padding: 7px 10px; text-align: left; font-size: 10pt; }
  td { padding: 7px 10px; border: 1px solid #d1fae5; font-size: 10pt; }
  tr:nth-child(even) td { background: #f0fdf4; }
  .screenshot-section { page-break-before: always; }
  .screenshot-label { font-size: 10pt; font-style: italic; color: #555; margin: 8px 0 12px; }
  img.screenshot { width: 100%; border: 1px solid #d1d5db; border-radius: 4px; }
  .page-break { page-break-before: always; }
</style>
</head>
<body>
<div class="page-footer">ACTIVEIT – ${proyecto} – DOCUMENTACIÓN CONFIDENCIAL</div>
<div class="cover">
  <div class="logo-text">active<span>IT</span></div>
  <h1>Continuidad Transbank</h1>
  <h2>Evidencias de Pruebas Internas</h2>
  <div class="ticket">${proyecto}: Creación de Oferta Económica</div>
  <div class="meta">${fecha}<br>${autor}</div>
</div>
<div class="page-header">
  <div class="brand">active<span>IT</span></div>
  <div class="confidencial">ACTIVEIT – ${proyecto} – DOCUMENTACIÓN CONFIDENCIAL</div>
</div>
<h2 class="section">1. Control de documento</h2>
<table>
  <thead><tr><th>Versión</th><th>Fecha</th><th>Actualización</th><th>Autor</th></tr></thead>
  <tbody><tr><td>V1</td><td>${fecha}</td><td>Versión original</td><td>${autor}</td></tr></tbody>
</table>
<h2 class="section">2. Datos de la Oferta</h2>
<table>
  <thead><tr><th>Campo</th><th>Valor</th></tr></thead>
  <tbody>
    <tr><td>Número de Oferta</td><td>${nroOferta}</td></tr>
    <tr><td>Proyecto</td><td>${proyecto}</td></tr>
    <tr><td>Fecha de creación</td><td>${fecha}</td></tr>
    <tr><td>Autor</td><td>${autor}</td></tr>
  </tbody>
</table>
<div class="screenshot-section">
<div class="page-header">
  <div class="brand">active<span>IT</span></div>
  <div class="confidencial">ACTIVEIT – ${proyecto} – DOCUMENTACIÓN CONFIDENCIAL</div>
</div>
<h2 class="section">3. Evidencias en Siebel</h2>
<h3 class="subsection">3.1. Formulario Principal de la Oferta</h3>
<p class="screenshot-label">Se verifica la creación exitosa de la Oferta Económica ${nroOferta} en Siebel CRM.</p>
<img class="screenshot" src="data:image/png;base64,${s1}" />
</div>
<div class="page-break">
<div class="page-header">
  <div class="brand">active<span>IT</span></div>
  <div class="confidencial">ACTIVEIT – ${proyecto} – DOCUMENTACIÓN CONFIDENCIAL</div>
</div>
<h3 class="subsection">3.2. Tab Atributos del Producto</h3>
<p class="screenshot-label">Se verifica que los atributos del producto quedaron correctamente configurados.</p>
<img class="screenshot" src="data:image/png;base64,${s2}" />
</div>
</body>
</html>`;
}

export async function generateEvidencia(args: {
  nro_oferta: string;
  proyecto: string;
  autor: string;
  output_dir?: string;
}): Promise<{ success: boolean; file_path: string; message: string }> {
  const siebelUrl  = process.env.SIEBEL_URL!;
  const username   = process.env.SIEBEL_USERNAME!;
  const password   = process.env.SIEBEL_PASSWORD!;

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--ignore-certificate-errors"],
    ignoreHTTPSErrors: true,
  } as any);

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });
    page.on("dialog", async (dialog: any) => await dialog.dismiss());

    // Login
    await page.goto(`${siebelUrl}/siebel/app/service/esn`, { waitUntil: "networkidle2", timeout: 30000 });
    await page.waitForSelector("input[name='SWEUserName'], input[type='text']", { timeout: 15000 });

    const userField = await page.$("input[name='SWEUserName']") || await page.$("input[type='text']");
    const passField = await page.$("input[name='SWEPassword']") || await page.$("input[type='password']");

    await (userField as any).click({ clickCount: 3 });
    await (userField as any).type(username);
    await (passField as any).click({ clickCount: 3 });
    await (passField as any).type(password);

    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle2", timeout: 30000 }),
      page.keyboard.press("Enter"),
    ]);

    // Navegar a la oferta
    const ofertaUrl = `${siebelUrl}/siebel/app/service/esn?SWECmd=GotoView&SWEView=Quote+Detail+View&SWERF=1&SWEHo=&SWEBU=1&SWEApplet0=Quote+Form+Applet&SWEQuoteNumber0=${args.nro_oferta}`;
    await page.goto(ofertaUrl, { waitUntil: "networkidle2", timeout: 30000 });
    await new Promise(r => setTimeout(r, 3000));

    // Screenshot 1 — formulario principal
    const screenshot1 = await page.screenshot({ encoding: "base64", fullPage: false }) as string;

    // Scroll down to find and click tab Atributos
    await page.evaluate(() => {
      const all = document.querySelectorAll("*");
      for (const el of Array.from(all)) {
        if ((el as HTMLElement).childElementCount === 0 && el.textContent?.trim() === "Atributos") {
          (el as HTMLElement).scrollIntoView({ behavior: "instant", block: "center" });
          (el as HTMLElement).click();
          return true;
        }
      }
      return false;
    });
    await new Promise(r => setTimeout(r, 2000));

    // Scroll to show the atributos content
    await page.evaluate(() => window.scrollBy(0, 300));
    await new Promise(r => setTimeout(r, 500));

    // Screenshot 2 — atributos
    const screenshot2 = await page.screenshot({ encoding: "base64", fullPage: false }) as string;

    // Generar PDF
    const fecha = new Date().toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" });
    const htmlContent = buildPdfHtml(args.nro_oferta, args.proyecto, args.autor, fecha, screenshot1, screenshot2);

    const pdfPage = await browser.newPage();
    await pdfPage.setContent(htmlContent, { waitUntil: "networkidle0" });
    const pdfBuffer = await pdfPage.pdf({
      format: "A4",
      margin: { top: "2cm", bottom: "2cm", left: "2cm", right: "2cm" },
      printBackground: true,
    });

    // Guardar PDF
    const outputDir = args.output_dir || path.join(os.homedir(), "Desktop");
    const filename = `EVIDENCIA-${args.proyecto}-${args.nro_oferta}.pdf`;
    const filePath = path.join(outputDir, filename);
    fs.writeFileSync(filePath, pdfBuffer);

    return {
      success: true,
      file_path: filePath,
      message: `PDF generado exitosamente: ${filePath}`,
    };
  } finally {
    await browser.close();
  }
}
