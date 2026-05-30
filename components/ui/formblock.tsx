import React from "react";

function FormBlock({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      {title && (
        <h3 className="font-bold px-2 py-1 //text-lg text-secondary-foreground">
          {title}
        </h3>
      )}
      <section className="p-4 space-y-4 rounded-3xl //shadow-xl bg-background dark:border dark:shadow-none">
        {children}
      </section>
    </>
  );
}

export default FormBlock;
