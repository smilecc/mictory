export * from "./axios";

export async function retry(
  func: (nextTry: () => void) => Promise<void>,
  time: number = 1000,
  max: number = 1
) {
  let count = 0;
  const nextTry = async (isFirst: boolean = false) => {
    if (count >= max + 1) {
      return;
    }

    count++;
    await new Promise<void>((resolve, reject) => {
      setTimeout(
        async () => {
          try {
            await func(nextTry);
            resolve();
          } catch {
            reject();
          }
        },
        isFirst ? 0 : time
      );
    }).catch(nextTry);
  };

  await nextTry(true);
}
