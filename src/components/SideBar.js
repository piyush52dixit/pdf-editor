import React, { useState } from "react";
import { CgFormatText } from "react-icons/cg";
import { BiImageAdd } from "react-icons/bi";
import { AiOutlineClear, AiOutlineDelete } from "react-icons/ai";
import { FiSave } from "react-icons/fi";
import { FaSignature } from "react-icons/fa"; // Import the signature icon
import { useButtons } from "../context/CanvasContext";
import Tooltip from "@mui/material/Tooltip";
import ExportPopup from "./ExportPopup";
import SignatureCanvas from "react-signature-canvas";

export default function SideBar() {
  const contextValues = useButtons();
  const [openExporter, setOpenExporter] = useState(false);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const sigCanvasRef = useState(null);

  // Function to handle adding signature to canvas
  const addSignatureToCanvas = () => {
    if (sigCanvasRef.current && contextValues.canvas) {
      const dataUrl = sigCanvasRef.current.toDataURL("image/png");
      fabric.Image.fromURL(dataUrl, (img) => {
        img.scaleToWidth(200);
        img.set({
          left: (contextValues.canvas.width - img.width) / 2,
          top: (contextValues.canvas.height - img.height) / 2,
        });
        contextValues.canvas.add(img);
        contextValues.canvas.renderAll();
        setShowSignaturePad(false); // Close signature pad after adding
      });
    }
  };

  // Function to clear the signature pad
  const clearSignature = () => {
    if (sigCanvasRef.current) {
      sigCanvasRef.current.clear();
    }
  };

  return (
    <div className="fixed z-50 top-[85%] md:top-0 left-0 md:h-[100vh] md:w-max h-[15vh] w-[100vw] flex md:flex-col flex-row items-center justify-center md:mx-16">
      <div
        className={`"md:mx-10 border max-h-[68vh] flex md:flex-col flex-wrap flex-row items-center justify-center shadow-lg rounded-lg md:py-8 py-2 px-4 md:text-[1.5rem] text-[1.2rem] min-w-[8vw] gap-8 ${
          contextValues.theme
            ? "border-[rgba(36,36,36,0.5)] bg-[rgb(25,25,25)] text-white shadow-[0px_0px_8px_rgb(0,0,0)]"
            : "bg-white text-black"
        }`}>
        <ExportPopup
          className="text-[1.5rem] cursor-pointer"
          open={openExporter}
          setOpen={setOpenExporter}
        />

        <Tooltip title="TextBox">
          <div>
            <CgFormatText
              className="md:text-[1.8rem] text-[1.5rem] cursor-pointer"
              onClick={() => contextValues.addText(contextValues.canvas)}
            />
          </div>
        </Tooltip>

        <Tooltip title="Add Image">
          <div>
            <label htmlFor="img-input">
              <BiImageAdd className="md:text-[1.8rem] text-[1.5rem] cursor-pointer" />
            </label>
            <input
              type="file"
              id="img-input"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => contextValues.addImage(e, contextValues.canvas)}
            />
          </div>
        </Tooltip>

        <Tooltip title="Delete Selected">
          <div>
            <AiOutlineDelete
              className="md:text-[1.8rem] text-[1.5rem] cursor-pointer"
              onClick={() => contextValues.deleteBtn()}
            />
          </div>
        </Tooltip>

        <Tooltip title="Reset Page">
          <div>
            <AiOutlineClear
              className="md:text-[1.8rem] text-[1.5rem] cursor-pointer"
              onClick={() => contextValues.canvas.clear()}
            />
          </div>
        </Tooltip>

        <Tooltip title="Download Whole PDF">
          <div>
            <FiSave
              className="md:text-[1.8rem] text-[1.5rem] cursor-pointer"
              onClick={() => {
                contextValues.edits[contextValues.currPage] =
                  contextValues.canvas.toObject();
                setOpenExporter(true);
              }}
            />
          </div>
        </Tooltip>

        {/* Signature Pad Icon */}
        <Tooltip title="Add Signature">
          <div>
            <FaSignature
              className="md:text-[1.8rem] text-[1.5rem] cursor-pointer"
              onClick={() => setShowSignaturePad(!showSignaturePad)}
            />
          </div>
        </Tooltip>

        {/* Signature Pad Modal */}
        {showSignaturePad && (
          <div className="fixed z-50 bg-white p-4 border border-gray-300 rounded shadow-lg">
            <h3>Signature Pad</h3>
            <SignatureCanvas
              ref={sigCanvasRef}
              penColor="black"
              canvasProps={{
                width: 500,
                height: 200,
                className: "sigCanvas",
              }}
            />
            <button onClick={clearSignature} className="mr-2">
              Clear
            </button>
            <button onClick={addSignatureToCanvas}>Add to Canvas</button>
            <button onClick={() => setShowSignaturePad(false)} className="ml-2">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
