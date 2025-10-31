import { ContentItem } from '../types';

export const saveJsonToFile = (content: object, filename: string): void => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(content, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${filename}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
};

export const loadJsonFromFile = <T,>(file: File): Promise<T> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                if (event.target && typeof event.target.result === 'string') {
                    const json = JSON.parse(event.target.result);
                    resolve(json as T);
                } else {
                    reject(new Error("Failed to read file content."));
                }
            } catch (e) {
                reject(new Error("File is not valid JSON."));
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
    });
};