interface LegalTitleProps{
  title: string
  subtitle?: string
}
export default function LegalTitle({title, subtitle = 'LEGAL'}: LegalTitleProps) {
  return (
    <>
      <h3 className="font-extralight tracking-widest text-sm">{subtitle}</h3>
      <h1 className="font-[Cormorant_Garamond_Variable] text-7xl font-medium">
        {title}
      </h1>
      <p></p>
    </>
  );
}
