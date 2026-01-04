import { ChangeEvent, FormEventHandler, useState } from "react";

export default function Page() {
  const [file, setFile] = useState<File | null | undefined>();
  const [outputUri, setOutputUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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
        const result = await pollForResult(task.task_id);
        setOutputUri(result);
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
        {loading ? (
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
