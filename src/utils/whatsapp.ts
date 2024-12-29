export function generateWhatsAppLink(message: string): string {
  const phone = '919019280245';
  const encodedMessage = encodeURIComponent(message);
  return `http://api.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`;
}
