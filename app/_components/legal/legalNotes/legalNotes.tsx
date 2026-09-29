interface LegalNotesProps{
  title: string
  description: string
}
export default function LegalNotes({title, description}: LegalNotesProps) {
  return (
    <span className="flex flex-col gap-2">
      <h2 className="font-[Cormorant_Garamond_Variable] text-3xl">
        {title}
      </h2>
      <p className="font-light">
        {description}
      </p>
    </span>
  );
}
