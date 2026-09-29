import React from "react";
import Header from "../_components/header/header";
import Footer from "../_components/footer/footer";

export default function NavigationLayout({children}: {children: React.ReactNode}){
  return (
    <>
    <Header />
    {children}
    <Footer />
    </>
  )
}