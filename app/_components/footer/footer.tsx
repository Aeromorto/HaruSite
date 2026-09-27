import Image from "next/image";
import HeaderNavButtons from "../header/headerNavButtons";
import Link from "next/link";
import { asset } from "@/app/_lib/assets";

export default function Footer() {
  return (
    <footer className="py-5 px-10 flex flex-col gap-5 text-muted">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 items-center">
        <div className="flex gap-2 justify-center lg:justify-start items-center">
          <Image
            src={asset("/logos/logo-olive.png")}
            alt="Logo da HARU"
            width={544}
            height={642}
            className="w-10"
          ></Image>
          <Link href="/#top" className="font-[Cormorant_Garamond_Variable] font-bold text-lg tracking-widest">HARU</Link>
        </div>
        <div>
          <ul className="text-xs text-center tracking-widest gap-5 lg:gap-10 justify-center flex flex-col lg:flex-row flex-nowrap text-nowrap">
            <HeaderNavButtons />
          </ul>
        </div>
        <div>
          <p className="text-center lg:text-end text-sm">HARU. Higiene feita de matéria.</p>
        </div>
      </div>
      <div className="text-center text-xs flex gap-3 justify-center">
        <p>&copy; {new Date().getFullYear()} HARU. Todos os direitos reservados</p>
        <Link href="/privacy">Privacidade</Link>
        <Link href="/terms">Termos de uso</Link>
      </div>
    </footer>
  );
}
