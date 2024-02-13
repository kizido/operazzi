import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import styles from "../styles/Barcode.module.css";
import JsBarcode from "jsbarcode";

export default function UPCBarcodeModal({
  upcBarcode,
  onDismiss,
}: {
  upcBarcode: string;
  onDismiss: () => void;
}) {
  const [errorMessage, setErrorMessage] = useState("");
  function isChecksum(code: string) {
    let odds = 0;
    let evens = 0;
    for (let i = 0; i < code.length - 1; i++) {
      if (i % 2 === 0) {
        odds += +code.charAt(i);
        console.log("ODDS: " + odds);
      } else {
        evens += +code.charAt(i);
        console.log("EVENS: " + evens);
      }
    }
    odds *= 3;
    console.log("ODDS: " + odds);
    let remainder = (odds + evens) % 10;
    console.log("REMAINDER: " + remainder);
    if (remainder !== 0) remainder = 10 - remainder;
    console.log("REMAINDER: " + remainder);
    console.log("RECEIVED CHECKSUM DIGIT: " + code.charAt(code.length - 1));
    return +code.charAt(code.length - 1) === remainder;
  }
  function generateUPCBarcode() {
    if (/^\d{12}$/.test(upcBarcode)) {
      if (isChecksum(upcBarcode)) {
        console.log("VALUE CORRECT");
        JsBarcode("#barcode", upcBarcode, {
          format: "UPC",
          width: 2,
          height: 100,
          textMargin: 0,
          fontSize: 16,
          background: "#ffffff",
          lineColor: "#000000",
        });
      } else {
        console.error("Invalid checksum digit.");
        setErrorMessage("Invalid checksum digit.");
      }
    } else {
      console.error("Invalid UPC-A number. Please provide a 12-digit number.");
      setErrorMessage(
        "Invalid UPC-A number. Please provide a 12-digit number."
      );
    }
  }
  function openSVGInNewTab() {
    const svgElement = document.getElementById("barcode");
    if (svgElement) {
      const svgMarkup = svgElement.outerHTML;
      const dataUrl = 'http://localhost:3000/generate-barcode'
      const newTab = window.open(dataUrl);
      newTab!.document.open();
      newTab!.document.write("<html><body>");
      newTab!.document.write(svgMarkup); // Display the SVG as well.
      newTab!.document.write("</body></html>");
      newTab!.document.close();
    }
  }

  useEffect(() => {
    generateUPCBarcode();
  }, []);
  return (
    <Modal
      show
      onHide={() => {
        onDismiss();
      }}
      centered={true}
      className={styles.barcodeModal}
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>Barcode</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={styles.barcodeModalContainer}>
          {errorMessage ? (
            <h3 className={styles.barcodeErrorMessage}>{errorMessage}</h3>
          ) : (
            <div className={styles.barcodeContainer}>
              <svg id="barcode" xmlns="http://www.w3.org/2000/svg"/>
              <button onClick={openSVGInNewTab}>Open in new tab</button>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}
