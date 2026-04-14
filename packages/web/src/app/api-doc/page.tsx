"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { openApiSpec } from "@/lib/swagger";

export default function ApiDocPage() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>API Dokumentation</h1>
      <SwaggerUI spec={openApiSpec} />
    </div>
  );
}
