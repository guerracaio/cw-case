import { HOW_TO_STEPS } from "@/content/calculadora-de-precos";

/** Passos numerados, em <ol> real: ordem faz parte do significado. */
export function Steps() {
  return (
    <ol className="mt-6 grid gap-6">
      {HOW_TO_STEPS.map((step, index) => (
        <li key={step.name}>
          <h3 className="font-medium">
            {index + 1}. {step.name}
          </h3>
          <p className="mt-1 text-neutral-800">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}
