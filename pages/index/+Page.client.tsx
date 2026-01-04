import { ChangeEvent, FormEventHandler, useState } from "react";

export default function Page() {
  const [file, setFile] = useState<File | null | undefined>();
  const [outputUri, setOutputUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const pollForResult = async (task_id: string) => {
    while (true) {
      const response = await fetch(`/api/generate/status?task_id=${task_id}`);
      const { result, status } = await response.json();
      if (result || status === "completed") {
        return result;
      }

      // Wait 1 second before polling again
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  };

  const submit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (file) {
      setError("");
      setOutputUri(null);
      setLoading(true);
      const formData = new FormData();
      formData.append("gambar", file);
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          body: formData,
        });
        const task = await res.json();
        if (task.error) {
          setError(task.message);
        } else {
          const result = await pollForResult(task.task_id);
          setOutputUri(result);
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <>
      <form
        onSubmit={submit}
        className="mx-auto p-4 max-w-4xl flex flex-col items-stretch gap-4"
      >
        <input
          className="file-input file-input-primary w-full"
          type="file"
          accept="image/png, image/jpeg"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setFile(e.currentTarget.files?.item(0))
          }
        />
        <button type="submit" className="btn btn-primary btn-block">
          Ubah ke Bahlil
        </button>
      </form>

      <section className="mx-auto w-full max-w-4xl flex flex-col items-stretch p-4">
        {error ? (
          <div role="alert" className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        ) : loading ? (
          <div className="skeleton aspect-3/4"></div>
        ) : outputUri == null ? (
          <></>
        ) : (
          <img
            src={outputUri}
            alt={outputUri}
            className="aspect-3/4 object-center object-contain bg-base-300 rounded-md overflow-hidden"
          />
        )}
      </section>
    </>
  );
}
