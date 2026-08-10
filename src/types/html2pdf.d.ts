declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | [number, number] | [number, number, number, number];
    filename?: string;
    image?: { type?: string; quality?: number };
    html2canvas?: any;
    jsPDF?: any;
    pagebreak?: { mode?: string | string[]; before?: string | string[]; after?: string | string[] };
  }

  interface Html2Pdf {
    set(options: Html2PdfOptions): Html2Pdf;
    from(element: HTMLElement | string): Html2Pdf;
    save(): Promise<void>;
    outputPdf(type?: string, param?: any): Promise<any>;
  }

  function html2pdf(): Html2Pdf;
  function html2pdf(element: HTMLElement, options?: Html2PdfOptions): Html2Pdf;

  export default html2pdf;
}
