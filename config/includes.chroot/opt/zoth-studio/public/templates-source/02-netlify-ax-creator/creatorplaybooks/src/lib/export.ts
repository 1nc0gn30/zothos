import JSZip from 'jszip';

export function downloadZip(bundle: Record<string, string>, filename: string) {
  const zip = new JSZip();
  Object.entries(bundle).forEach(([path, content]) => {
    zip.file(path, content);
  });
  zip.generateAsync({ type: 'blob' }).then((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  });
}
