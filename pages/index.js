import FileUpload from "../src/components/FileUpload";
import Head from "next/head";
import React from "react";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Pdf Editor</title>
      </Head>
      <FileUpload />
    </div>
  );
}
