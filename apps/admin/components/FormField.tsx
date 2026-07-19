import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase tracking-wide text-[#A7B0C0]">{label}</span>
      {children}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="min-h-11 rounded-lg border border-[#2A3142] bg-[#05070D] px-3 text-sm text-white outline-none focus:border-[#38BDF8]"
    />
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="min-h-24 rounded-lg border border-[#2A3142] bg-[#05070D] px-3 py-2 text-sm text-white outline-none focus:border-[#38BDF8]"
    />
  );
}

export function SelectInput(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="min-h-11 rounded-lg border border-[#2A3142] bg-[#05070D] px-3 text-sm text-white outline-none focus:border-[#38BDF8]"
    />
  );
}

export function SubmitButton({ children }: { children: ReactNode }) {
  return (
    <button
      className="w-fit rounded-lg bg-[#38BDF8] px-4 py-3 text-sm font-black text-[#05070D]"
      type="submit"
    >
      {children}
    </button>
  );
}
