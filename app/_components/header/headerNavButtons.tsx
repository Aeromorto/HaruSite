import Link from "next/link";

export default function HeaderNavButtons() {
  return (
    <>
      <li>
        <Link href={'/#store'} className="p-2">LOJA</Link>
      </li>
      <li>
        <Link href={'/#brand'} className="p-2">A MARCA</Link>
      </li>
      <li>
        <Link href={'/microplastic'} className="p-2">MATÉRIA</Link>
      </li>
      <li>
        <Link href={'/use-notes'} className="p-2">O USO</Link>
      </li>
      <li>
        <Link href={'/#contact'} className="p-2">CONTATO</Link>
      </li>
    </>
  )
}