import React from "react";

function FormBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="/w-80% space-y-1 pb-8 rounded-xl border-neutral-600 bg-background /p-4 dark:border dark:shadow-none">
      <h3 className="font-medium">{title}</h3>
      <article className="space-y-4">{children}</article>
    </section>
  );
}

export default FormBlock;
