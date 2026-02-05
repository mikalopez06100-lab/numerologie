interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SectionTitle({
  title,
  subtitle,
  className = '',
}: SectionTitleProps) {
  return (
    <div className={`text-center mb-8 ${className}`}>
      <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#FAF7F2] mb-2">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}
