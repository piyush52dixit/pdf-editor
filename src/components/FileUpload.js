import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { fabric } from "fabric";
import { useButtons } from "../context/CanvasContext";
import SideBar from "./SideBar";

export default function FileUpload() {
  const contextValues = useButtons();
  console.log("🚀 ~ FileUpload ~ contextValues:", contextValues);

  const [docIsLoading, setDocIsLoading] = React.useState(false);

  function onDocumentLoadSuccess({ numPages }) {
    contextValues.setEdits({});
    contextValues.setNumPages(numPages);
    contextValues.setCurrPage(1);
    setTimeout(() => setDocIsLoading(false), 2000);
  }

  function changePage(offset) {
    const page = contextValues.currPage;
    contextValues.edits[page] = contextValues.canvas.toObject();
    contextValues.setEdits(contextValues.edits);
    contextValues.setCurrPage((page) => page + offset);
    contextValues.canvas.clear();
    contextValues.edits[page + offset] &&
      contextValues.canvas.loadFromJSON(contextValues.edits[page + offset]);
    contextValues.canvas.renderAll();
  }

  console.log("🚀 ~ FileUpload ~ contextValues:", contextValues);

  React.useEffect(() => {
    if (contextValues.selectedFile) {
      const canvas = initCanvas();
      contextValues.setCanvas(canvas);
    }
  }, [contextValues.selectedFile]);

  // fabric js
  const initCanvas = () => {
    return new fabric.Canvas("canvas", {
      isDrawingMode: false,
      height: 842,
      width: 595,
      backgroundColor: "rgba(0,0,0,1)",
    });
  };

  // fabric js

  React.useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      {contextValues.selectedFile && <SideBar />}
      {contextValues.selectedFile ? (
        <div
          className={`w-full py-8 ${
            contextValues.theme ? "text-white bg-dark" : "text-black bg-white"
          }`}>
          <div
            className="close-button"
            onClick={() => contextValues.setFile(null)}>
            close
          </div>

          <div className="document-container">
            <div id="singlePageExport" className={`page-wrapper`}>
              {docIsLoading && (
                <>
                  <div className="loading-overlay"></div>
                  <div className="loading-message">
                    <p>docIsLoading....</p>
                  </div>
                </>
              )}
              <Document
                file={contextValues.selectedFile}
                onLoadSuccess={onDocumentLoadSuccess}
                className="document-container"
                id="doc">
                <div id="canvasWrapper">
                  <canvas id="canvas" />
                </div>
                <div className="page-wrapper">
                  <Page
                    pageNumber={contextValues.currPage}
                    id="docPage"
                    width={595}
                    height={842}
                  />
                </div>
              </Document>
            </div>
          </div>

          <div className="navigation">
            {contextValues.currPage > 1 && (
              <button onClick={() => changePage(-1)} className="button">
                {"<"}
              </button>
            )}
            <div className="page-info">
              Page {contextValues.currPage} of {contextValues.numPages}
            </div>
            {contextValues.currPage < contextValues.numPages && (
              <button onClick={() => changePage(1)} className="button">
                {">"}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full min-height py-8 flex items-center justify-center">
          <div className="upload-container">
            <div className="space-y-1 text-center">
              <div
                className={`flex text-md ${
                  contextValues.theme ? "text-gray-400" : "text-gray-600"
                }`}>
                <label className="relative cursor-pointer">
                  <span>Upload a file</span>
                </label>
                <input
                  type="file"
                  className="sr-only"
                  accept="application/pdf"
                  onChange={(e) => contextValues.setFile(e.target.files[0])}
                />
              </div>
              <p className="text-sm">PDF</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
