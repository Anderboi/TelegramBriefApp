import React from "react";

function FormBlock({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="p-4 space-y-4 rounded-xl shadow-xl bg-background dark:border dark:shadow-none">
      {title && <h3 className="font-bold text-lg">{title}</h3>}
      <article className="space-y-4">{children}</article>
    </section>
  );
}

export default FormBlock;
