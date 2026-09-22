export function AuthPageBackdrop({ children }) {
  return (
    <div className="relative -mx-4 -my-6 flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-10 md:-mx-6">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[url('/lumina_bg.png')] bg-cover bg-center opacity-80"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 w-full max-w-sm">{children}</div>
    </div>
  );
}
