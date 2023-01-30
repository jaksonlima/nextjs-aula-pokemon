import css from "@/styles/Spinner.module.css";

export function Spinner() {
  return (
    <div className={css?.["lds-ripple"]}>
      <div></div>
      <div></div>
    </div>
  );
}
