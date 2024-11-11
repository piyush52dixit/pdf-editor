import { Fragment } from "react";
import React, { useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { fabric } from "fabric";
import { useButtons } from "../context/CanvasContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Backdrop, Dialog, Slide, Button } from "@mui/material";

export default function ExportPopup(props) {
  const contextValues = useButtons();
  const [exportCanvas, setExportCanvas] = React.useState(null);
  const [numPages, setNumPages] = React.useState(null);
  const [currPage, setCurrPage] = React.useState(1);
  const [isExporting, setExporting] = React.useState(false);

  useEffect(() => {
    if (exportCanvas) {
      contextValues.edits[currPage] &&
        exportCanvas.loadFromJSON(contextValues.edits[currPage]);
    }
  }, [contextValues.edits, currPage, exportCanvas]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setCurrPage(1);
    setExportCanvas(initCanvas());
  }

  function changePage(offset) {
    const page = currPage;
    setCurrPage((page) => page + offset);
    exportCanvas.clear();
    contextValues.edits[page + offset] &&
      exportCanvas.loadFromJSON(
        contextValues.edits[page + offset],
        exportCanvas.renderAll.bind(exportCanvas)
      );
  }

  const initCanvas = () =>
    new fabric.StaticCanvas("canvas-export", {
      isDrawingMode: false,
      height: 842,
      width: 595,
      backgroundColor: "rgba(0,0,0,0)",
    });

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  }, []);

  const onExport = () => {
    setCurrPage(1);
    setExporting(true);

    const docToExport = document.querySelector("#toExport");
    const pdf = new jsPDF("p", "mm", "a4");

    setTimeout(() => {
      let i = 0;
      let intervalId = setInterval(() => {
        html2canvas(docToExport, {
          scale: 1.5,
          scrollY: 0,
          scrollX: 0,
        }).then((canvas) => {
          const imgData = canvas.toDataURL("image/jpeg", 0.8);
          pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);
        });

        i += 1;
        i <= numPages ? changePage(1) : stopInterval();

        pdf.addPage();
        pdf.setPage(i);
      }, 3000);

      const stopInterval = () => {
        clearInterval(intervalId);
        var pageCount = pdf.internal.getNumberOfPages();
        pdf.deletePage(pageCount);
        pdf.save("Edge_lamp_editor.pdf");
        setExporting(false);
        props.setOpen(false);
      };
    }, 1000);
  };

  return (
    <>
      <style>{`
        .popup-backdrop {
          background-color: rgba(75, 85, 99, 0.75);
        }
        .popup-container {
          display: flex;
          min-height: 100vh;
          justify-content: center;
          align-items: center;
          padding: 0 1rem;
          text-align: center;
        }
        .popup-panel {
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        .popup-panel-dark {
          background-color: #1a1a1a;
          color: white;
        }
        .popup-panel-light {
          background-color: white;
          color: black;
        }
        .loader-container {
          position: fixed;
          top: 25%;
        }
        .export-btn {
          display: inline-flex;
          justify-content: center;
          padding: 0.5rem 1rem;
          background-color: #6366f1;
          color: white;
          border-radius: 0.25rem;
          transition: background-color 0.2s ease-in-out;
        }
        .export-btn:hover {
          background-color: #4f46e5;
        }
        .pagination-controls {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        .pagination-button {
          padding: 0.5rem;
          background-color: #374151;
          color: white;
          border-radius: 0.25rem;
        }
      `}</style>

      <Dialog
        open={props.open}
        onClose={() => props.setOpen(false)}
        TransitionComponent={Slide}
        className="popup-container">
        <div
          className={`popup-panel ${
            contextValues.theme ? "popup-panel-dark" : "popup-panel-light"
          }`}>
          <Backdrop
            sx={{
              color: "#fff",
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={isExporting}>
            <div className="loader-container">docIsLoading...</div>
          </Backdrop>
          <div>
            <div className="mt-3 text-center sm:mt-5">
              <div className="mt-2">
                <div>
                  {contextValues.selectedFile ? (
                    <div className="w-full py-4">
                      <div
                        ref={contextValues.exportPage}
                        id="toExport"
                        style={{
                          opacity: currPage <= numPages ? "1" : "0",
                        }}>
                        <Document
                          file={contextValues.selectedFile}
                          onLoadSuccess={onDocumentLoadSuccess}
                          className="flex justify-center">
                          <div className="absolute z-[9]">
                            <canvas id="canvas-export" />
                          </div>

                          <Page
                            pageNumber={currPage}
                            id="docPage"
                            className={`px-4 py-2 ${
                              !isExporting && "shadow-lg border"
                            } ${
                              contextValues.theme && "border-[rgba(36,36,36,0)]"
                            }`}
                            width={595}
                            height={842}
                          />
                        </Document>
                      </div>
                      <div
                        className="pagination-controls"
                        style={{
                          opacity: currPage <= numPages ? "1" : "0",
                        }}>
                        {currPage > 1 && (
                          <button
                            onClick={() => changePage(-1)}
                            className="pagination-button">
                            {"<"}
                          </button>
                        )}
                        <div className="pagination-button">
                          Page {currPage} of {numPages}
                        </div>
                        {currPage < numPages && (
                          <button
                            onClick={() => changePage(1)}
                            className="pagination-button">
                            {">"}
                          </button>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-6">
            <Button
              variant="contained"
              className="export-btn"
              onClick={() => onExport()}>
              {isExporting ? <span>Exporting...</span> : <span>Export</span>}
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
