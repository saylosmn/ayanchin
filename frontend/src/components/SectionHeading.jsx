import Reveal from "@/components/Reveal";

export default function SectionHeading({ eyebrow, title, description, align = "left" }) {
    const alignCls = align === "center" ? "text-center mx-auto items-center" : "text-left items-start";
    return (
        <Reveal className={`flex flex-col ${alignCls} max-w-2xl`}>
            {eyebrow && (
                <p className="text-gold tracking-[0.35em] text-xs uppercase mb-5">{eyebrow}</p>
            )}
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-cream leading-[1.05]">
                {title}
            </h2>
            {description && (
                <p className="mt-5 text-sm md:text-base text-stone2 leading-relaxed">{description}</p>
            )}
            <span className="mt-7 block h-px w-16 bg-gold/60" aria-hidden="true" />
        </Reveal>
    );
}
