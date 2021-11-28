import React from "react";
import Router from "next/router";
import { ArrowLeft } from "react-feather";

export default function BackButton() {
  return (
    <div className="btn btn-light btn-sm" onClick={() => Router.back()}>
      <ArrowLeft/>
    </div>
  );
}
