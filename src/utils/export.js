import html2canvas from 'html2canvas-pro';

export async function exportAsPng(element, filename = 'gitglance-card.png') {
  const canvas = await html2canvas(element, {
    backgroundColor: '#000000',
    scale: 2,
    useCORS: true,
    allowTaint: false,
    logging: false,
  });

  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
