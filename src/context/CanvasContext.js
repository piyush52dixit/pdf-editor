import React, { useRef } from "react";
import { fabric } from "fabric";

const funButtons = React.createContext();

export const useButtons = () => {
  return React.useContext(funButtons);
};

export const CanvasProvider = ({ children }) => {
  const [numPages, setNumPages] = React.useState(null);
  const [currPage, setCurrPage] = React.useState(1);
  const [selectedFile, setFile] = React.useState(null);
  const [canvas, setCanvas] = React.useState("");
  const [isExporting, setExporting] = React.useState(false);
  const [hideCanvas, setHiddenCanvas] = React.useState(false);

  const sigCanvasRef = useRef(null);
  const exportPage = useRef(null);
  const [exportPages, setExportPages] = React.useState([]);
  const [edits, setEdits] = React.useState({});

  React.useEffect(() => {
    if (document.getElementById("canvasWrapper"))
      document.getElementById("canvasWrapper").style.visibility =
        document.getElementById("canvasWrapper").style.visibility === "hidden"
          ? "visible"
          : "hidden";
  }, [hideCanvas]);

  React.useEffect(() => {
    if (canvas !== "") {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        activeObject.set("fill", color);
        canvas.renderAll();
      }
    }
  }, []);

  const addImage = (e, canvi) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (f) => {
      const data = f.target.result;
      fabric.Image.fromURL(data, (img) => {
        img.scaleToWidth(300);
        const canvasWidth = canvi.width;
        const canvasHeight = canvi.height;
        img.set({
          left: (canvasWidth - img.width * img.scaleX) / 2,
          top: (canvasHeight - img.height * img.scaleY) / 2,
        });
        canvi.add(img).renderAll();
      });
    };
    reader.readAsDataURL(file);
    canvi.isDrawingMode = false;
  };

  const deleteBtn = () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
    }
  };

  const addText = (canvi) => {
    const text = new fabric.Textbox("Type Here ...", { editable: true });
    text.set({
      fill: "#000",
      //   fontFamily: removeEventListener,
      left: (canvi.width - 200) / 2,
      top: (canvi.height - 200) / 2,
    });
    canvi.add(text);
    canvi.centerObject(text);
    text.setCoords();
    canvi.renderAll();
    canvi.isDrawingMode = false;
  };

  const toggleDraw = (canvi) => {
    canvi.isDrawingMode = !canvi.isDrawingMode;
    const brush = canvas.freeDrawingBrush;
    brush.color = borderColor;
    brush.strokeWidth = strokeWidth;
  };

  const exportPdf = () => {
    setExportPages((prev) => [...prev, exportPage.current]);
    console.log(exportPages);
  };

  return (
    <funButtons.Provider
      value={{
        canvas,
        setCanvas,
        addText,
        addImage,
        numPages,
        setNumPages,
        currPage,
        setCurrPage,
        selectedFile,
        setFile,
        toggleDraw,
        edits,
        setEdits,
        deleteBtn,
        exportPage,
        exportPdf,
        isExporting,
        setHiddenCanvas,
      }}>
      {children}
    </funButtons.Provider>
  );
};
