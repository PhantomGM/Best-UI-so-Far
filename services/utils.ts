// --- Common Utilities ---
export const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
export const randFloat = (min: number, max: number) => (Math.random() * (max - min) + min).toFixed(1);
export const pickOne = <T,>(arr: T[]): T => arr[randInt(0, arr.length - 1)];
export const shuffle = <T,>(arr: T[]): T[] => arr.sort(() => Math.random() - 0.5);

export const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                // The result includes the data URI prefix, so we split it off.
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            } else {
                reject(new Error('Failed to convert blob to base64 string.'));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};
